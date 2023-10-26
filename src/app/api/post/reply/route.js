import { getServerSession } from "next-auth";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const payload = await request.json();
  console.log(payload);
  const { commentId, text } = payload;

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Create the reply in the database
    const replyComment = await db.commentreply.create({
      data: {
        text,
        userId: session?.user?.id,
        commentId,
      },
    });

    if (replyComment) {
      return NextResponse.json(
        { replyComment, message: "reply uploaded successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Could not upload reply" },
        { status: 400 }
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
