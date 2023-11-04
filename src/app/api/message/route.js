import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";


export async function POST(request) {
  const session = await getServerSession(authOptions);
  const senderId = session?.user?.id;
  const payload = await request.json();
  const { receiver: recipientId, message: content, media } = payload;

  console.log("payload", payload);

  try {

    const created = await db.message.createMany({
      data: {
        senderId,
        recipientId,
        content,
        media
      }
    });

    console.log("created", created);

    return NextResponse.json(
      {
        message: "sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}