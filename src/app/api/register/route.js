import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const payload = await request.json();
    // const { confirmPassword: newconfirmPassword, termsAgreed: newTermsAgree, ...userData } = payload;
    console.log(payload);
    // const newlyCreatedUserProfileData = await db.user.create({
    //   data: {
    //     ...userData,
    //   },
    // });
    // console.log(newlyCreatedUserProfileData);
    if (payload) {
      return NextResponse.json(
        {
          payload,
          message: "User Profile Successfully Created",
        },
        { status: 200 }
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
