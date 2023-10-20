import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const payload = await request.json();
  const { title, description, tagId, media } = payload;

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  } else if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  } else if (!description) {
    return NextResponse.json(
      { message: "Description is required" },
      { status: 400 }
    );
  } else if (!tagId) {
    return NextResponse.json(
      { message: "Please select a Tag" },
      { status: 400 }
    );
  }

  try {
    const post = await db.post.create({
      data: {
        title: title,
        content: description,
        tagId: tagId,
        media: media,
        userId: session?.user.id,
      },
    });

    return NextResponse.json(
      { post: post, message: "User successfully created Post" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not create post" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allData = await db.tag.findMany();
    return NextResponse.json(
      { allData, message: "all data returned" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "unable to get data" },
      { status: 500 }
    );
  }
}
