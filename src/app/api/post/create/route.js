import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  // Extract form fields from formData
  const payload = await request.json();
  const { title, description, tagId, media } = payload;

  console.log("payload", payload); // Access the uploaded files through request.files

  if (!title||!description||!tagId||!media) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  try {
    const post = await db.post.create({
      data: {
        title: title,
        content: description,
        tagId: tagId,
        media: media,
      },
    });

    return NextResponse.json(
      { post: payload, message: "User successfully created Post" },
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
