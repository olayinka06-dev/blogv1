// pages/api/chat.js
import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";
import pusher from "../../../../lib/pusher";
// import Pusher from "pusher";

// Send a reply to a message
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const payload = await request.json();
  const { content, media, messageId, recipientId } = payload;
  console.log("payload type is post a reply", payload);
  const senderId = session?.user?.id;

  if (!session) {
    return NextResponse.json({
      message: "Unauthorized! Please log in to send a reply",
    }, {status: 401});
  }

  try {
    const reply = await db.reply.create({
      data: {
        content,
        media,
        recipientId,
        senderId,
        messageId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    await pusher.trigger("reply", "new-reply", {
      message: `${JSON.stringify(reply)}\n\n`,
    });

    if (reply) {
      return NextResponse.json(
        { message: "Reply sent successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Unable to send the reply" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Function to delete Reply
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get("id");
  console.log("messageId", messageId)
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!messageId) {
      return NextResponse.json(
        { message: "Reply Id is required" },
        { status: 401 }
      );
    }
    // Find the reply in the database
    const reply = await db.reply.findUnique({
      where: { id: messageId },
      select: { senderId: true },
    });

    if (!reply) {
      return NextResponse.json(
        { message: "Reply not found" },
        { status: 404 }
      );
    }

    // Check if the authenticated user is the owner of the reply
    if (reply.senderId === session?.user?.id) {
      // Delete the Reply
      await db.reply.delete({ where: { id: messageId } });

      // Trigger Pusher event for message deletion
      await pusher.trigger("reply", "forward", messageId);

      return NextResponse.json(
        { message: "Reply deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Unauthorized, you can only delete your message" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  const payload = await request.json();
  const session = await getServerSession(authOptions);
  const { messageId, content } = payload;

  console.log("type edit a reply", payload);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // First, check if the user making the request is the owner of the reply
    const reply = await db.reply.findUnique({
      where: { id: messageId },
      select: {
        sender: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!reply) {
      return NextResponse.json(
        { message: "Reply not found" },
        { status: 404 }
      );
    }

    if (reply.sender.id !== session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized, you can only edit your replies" },
        { status: 403 }
      );
    }

    // If the user is authorized, update the comment text
    const updatedMessage = await db.reply.update({
      where: { id: messageId },
      data: {
        content,
        isEdit: true,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    // Trigger Pusher event for message update
    await pusher.trigger("reply", "edit-reply", {
      message: `${JSON.stringify(updatedMessage)}\n\n`,
    });

    return NextResponse.json(
      { message: "Reply updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

