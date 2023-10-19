import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  const payload = await request.json();
  const { comment, postId } = payload;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
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


// export async function GET(request) {
//     const postId = req.query.postId;

//     const comments = await db.comment.findMany({
//       where: { postId },
//       include: {
//         user: {
//           select: {
//             username: true,
//             profile: {
//               select: {
//                 profilePicture: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     res.status(200).json(comments);
//     res.status(405).json({ error: 'Method not allowed' });
// }

