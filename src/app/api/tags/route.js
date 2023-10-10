import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function GET() {
  try {
    const tags = await db.tag.findMany();

    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not fetch Tags" },
      { status: 500 }
    );
  }
}
