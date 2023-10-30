import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const payload = await request.json();
  const { media, message } = payload;

  console.log("payload", payload);

  if (!session) {
    return NextResponse.json({
      message: "Unauthorized!, please login to begin a chat",
    });
  }

  try {
    if (payload) {
      return NextResponse.json(
        { payload, message: "Success!" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "error! uploading the comment" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET(request) {}
