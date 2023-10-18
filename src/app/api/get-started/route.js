import { authOptions } from "@/lib/auth";
import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  try {
    const payload = await request.json();
    const username = session?.user?.username;
    const { termsAgreed: newTermsAgree, ...userData } = payload;
    const profileData = { ...userData, username };
    console.log("profileData", profileData);

    const newlyCreatedUserProfileData = await db.profile.create({
      data: {
        ...profileData,
      },
    });

    console.log("newlyCreatedUserProfileData", newlyCreatedUserProfileData);

    if (newlyCreatedUserProfileData) {
      return NextResponse.json(
        {
          newlyCreatedUserProfileData,
          message: "User Profile Successfully Created",
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Registeration failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allData = await db.profile.findMany();
    return NextResponse.json({ allData, message: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
