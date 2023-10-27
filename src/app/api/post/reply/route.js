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
export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  const payload = await request.json();
  console.log(payload);
  const { replyId, text } = payload;

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Create the reply in the database
    const replyComment = await db.commentreply.findUnique({
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

// Function to delete comment
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const replyId = searchParams.get("id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!replyId) {
      return NextResponse.json(
        { message: "Reply Id is required" },
        { status: 401 }
      );
    }
    // Find the reply in the database
    const reply = await db.commentreply.findUnique({
      where: { id: replyId },
      select: { userId: true },
    });

    if (!reply) {
      return NextResponse.json(
        { message: "reply not found" },
        { status: 404 }
      );
    }

    // Check if the authenticated user is the owner of the comment
    if (reply.userId === session.user.id) {
      // Delete the comment
      await db.commentreply.delete({ where: { id: replyId } });
      return NextResponse.json(
        { message: "reply deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Unauthorized, you can only delete your reply to a comment" },
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
