import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  //   if (!session) {
  //     return NextResponse.json(
  //       { message: "Unauthorized, you must be login to access the dashboard" },
  //       { status: 401 }
  //     );
  //   }

  try {
    const profile = await db.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            profilePicture: true,
          },
        },
      },
    });

    if (profile) {
      return NextResponse.json({ profile }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Error loading profile" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error getting profile:", error);
    return NextResponse.json(
      { message: "Error loading profile please check your connection" },
      { status: 500 }
    );
  }
}
