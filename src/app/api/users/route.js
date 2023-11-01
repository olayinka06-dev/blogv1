import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            profilePicture: true,
            userRole: true,
            email: true,
            phoneNumber: true,
          }
        },
      },
    });
    const data = allUsers;
    if (data) {
      return NextResponse.json(
        { data, message: "successfully fetch all users" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { allUsers: null, message: "Unable to fetch all users" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
