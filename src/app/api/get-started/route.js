import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const payload = await request.json();
    const { termsAgreed: newTermsAgree, ...userData } = payload;
    console.log(userData);
    const newlyCreatedUserProfileData = await db.profile.create({
      data: {
        ...userData,
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

export async function GET(){
  try {
    const allData = await db.user.findMany({
      include: {
        posts: true,
        profile: true
      }
    });
    return NextResponse.json({allData, message: "success"}, {status: 200})
  } catch (error) {
    console.log(error);
    return NextResponse.json({message: "error"}, {status: 500})
  }
}
