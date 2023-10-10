import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await db.post.delete({
      where: {
        id: id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not delete post" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    console.log(id);
    const payload = await request.json();
    console.log(payload);
    const { title, content, tagId } = payload;

    await db.post.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        content: content,
        tagId: tagId,
      },
    });

    return NextResponse.json(
      { message: "Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not update post" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const post = await db.post.findFirst({
      where: {
        id: id,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not fetch Post" },
      { status: 500 }
    );
  }
}
