// pages/api/chat.js
import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";
// import Pusher from "pusher";
import pusher from "../../../../lib/pusher";

// POST /api/send-message
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const senderId = session?.user?.id;
  const payload = await request.json();

  const { recipientId, content, media } = payload;
  console.log("type post", payload);

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized!, please login to engage in a conversation",
      },
      { status: 401 }
    );
  }

  try {
    const chatMessages = await db.message.create({
      data: {
        senderId,
        recipientId,
        content,
        media,
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

    await pusher.trigger("chat", "hello", {
      message: `${JSON.stringify(chatMessages)}\n\n`,
    });

    if (chatMessages) {
      return NextResponse.json(
        {
          message: "sent successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "unable to send message",
        },
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


// Function to delete Message
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
        { message: "Comment Id is required" },
        { status: 401 }
      );
    }
    // Find the comment in the database
    const message = await db.message.findUnique({
      where: { id: messageId },
      select: { senderId: true },
    });

    if (!message) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if the authenticated user is the owner of the comment
    if (message.senderId === session.user.id) {
      // Delete the comment
      await db.message.delete({ where: { id: messageId } });

      // Trigger Pusher event for message deletion
      await pusher.trigger("chat", "delete-message", messageId);

      return NextResponse.json(
        { message: "message deleted successfully" },
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

  console.log("type edit", payload);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // First, check if the user making the request is the owner of the message
    const message = await db.message.findUnique({
      where: { id: messageId },
      select: {
        sender: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    if (message.sender.id !== session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized, you can only edit your message" },
        { status: 403 }
      );
    }

    // If the user is authorized, update the comment text
    const updatedMessage = await db.message.update({
      where: { id: messageId },
      data: {
        content,
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
    await pusher.trigger("chat", "edit-message", {
      message: `${JSON.stringify(updatedMessage)}\n\n`,
    });

    return NextResponse.json(
      { message: "Message updated successfully" },
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
