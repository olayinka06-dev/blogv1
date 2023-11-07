// pages/api/chat.js
import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";
import Pusher from "pusher";

// POST /api/send-message
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const senderId = session?.user?.id;
  const payload = await request.json();

  const { receiver: recipientId, message: content, media } = payload;
  console.log(payload);

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
    });

    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: "mt1",
      useTLS: true,
    });

    await pusher.trigger("chat", "hello", {
      message: `${JSON.stringify(chatMessages)}\n\n`,
    });

    // console.log("message", chatMessages);

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
