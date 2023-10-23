import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    if (!id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const response = await db.post.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        tag: true,
        media: true,
        Comment: true,
        user: {
          select: {
            id: true,
            Comment: true,
            username: true,
            profile: {
              select: {
                profilePicture: true,
                userRole: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    if (response) {
      return NextResponse.json(
        response,
        { message: "Single Blog Post Returned" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Unable to load Blog Post" },
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
