import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


// Function to post comment
export async function POST(request) {
  const payload = await request.json();
  const { comment, postId } = payload;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const uploadedComment = await db.comment.create({
      data: {
        text: comment,
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: session?.user?.id,
          },
        },
      },
    });

    if (uploadedComment) {
      return NextResponse.json(
        { message: "comment uploaded successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Could not upload comment uploaded" },
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
  const commentId = searchParams.get("id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!commentId) {
      return NextResponse.json(
        { message: "Comment Id is required" },
        { status: 401 }
      );
    }
    // Find the comment in the database
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.userId === session.user.id) {
      // Delete the comment
      await db.comment.delete({ where: { id: commentId } });
      return NextResponse.json(
        { message: "Comment deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Unauthorized, you can only delete your comment" },
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


// Function to get single blog post
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("id");
  try {
    if (!postId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const comments = await db.comment.findMany({
      where: { postId: postId },
      select: {
        id: true,
        text: true,
        user: {
          select: {
            username: true,
            profile: {
              select: {
                profilePicture: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });
    if (comments) {
      return NextResponse.json(
        comments,
        { message: "Single Comment Returned" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Unable to load Comment" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

