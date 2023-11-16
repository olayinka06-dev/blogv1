// pages/api/chat.js
import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";

// Send a reply to a reply
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const payload = await request.json();
  const { content, replyId } = payload;
  const senderId = session?.user?.id;

  if (!session) {
    return NextResponse.json({
      message: "Unauthorized! Please log in to send a reply",
    });
  }

  try {
    const reply = await db.reply.create({
      data: {
        content,
        senderId,
        replyId,
      },
    });

    if (reply) {
      return NextResponse.json(
        { message: "Reply sent successfully", data: reply },
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
