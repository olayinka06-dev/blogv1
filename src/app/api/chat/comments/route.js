import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const payload = await request.json();
  const { media, message: content, receiver: friendId } = payload;

  console.log("payload", payload);

  if (!session) {
    return NextResponse.json({
      message: "Unauthorized!, please login to begin a chat",
    });
  }
  const status = 'SENT';
  try {
    const newMessage = await db.chatMessage.create({
      data: {
        content,
        media,
        userId,
        status,
        chatRoom: {
          create: {
            members: {
              connect: [
                { id: userId },
                { id: friendId },
              ],
            },
          },
        },
      },
    });
    if (newMessage) {
      return NextResponse.json(
        { newMessage, message: "Success!" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "error! uploading the comment" },
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
export async function GET(request) {}
