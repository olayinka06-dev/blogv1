import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "You must be logged in to like/unlike a post.",
    });
  }

  try {
    // Check if the user has already liked the post
    const existingLike = await db.like.findFirst({
      where: {
        postId,
        userId: session?.user?.id,
      },
    });

    if (existingLike) {
      // User has already liked the post, so remove the like
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json(
        { message: "Post unliked successfully", likes: existingLike.likes - 1 },
        { status: 200 }
      );
    } else {
      // User has not liked the post, so create a new like record
      const newLike = await db.like.create({
        data: {
          userId: session.user.id,
          postId,
          likes: 1, // Set the initial like count to 1
        },
      });
      return NextResponse.json(
        { message: "Post liked successfully", likes: newLike.likes },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error liking/unliking the post:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const session = await getServerSession(authOptions);
//   const postId = searchParams.get("id");


//   if (!session) {
//     return NextResponse.json({
//       message: "You must be logged in to like/unlike a post.",
//     });
//   }

//   try {
//     const like = await db.like.findFirst({
//       where: {
//         postId: postId,
//         userId: session.user.id,
//       },
//     });

//     if (like) {
//       // User has already liked the post
//       return NextResponse.json({ liked: true });
//     } else {
//       // User has not liked the post
//       return NextResponse.json({ liked: false });
//     }
//   } catch (error) {
//     console.error("Error checking liked status:", error);
//     return res.status(500).end(); // Internal Server Error
//   }
// }

