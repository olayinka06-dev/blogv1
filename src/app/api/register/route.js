import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(request) {
  const payload = await request.json();
  const { username, password } = payload;
  try {
    const usernameExist = await db.user.findUnique({
      where: { username: username },
    });

    if (usernameExist) {
      return NextResponse.json(
        {
          user: null,
          message: "User with this username already exist",
        },
        { status: 409 }
      );
    }
    const hashPassword = await hash(password, 10);
    const newlyCreatedUser = await db.user.create({
      data: {
        username: username,
        password: hashPassword,
      },
    });
    if (newlyCreatedUser) {
      const { password: newUserPassword, ...rest } = newlyCreatedUser;
      return NextResponse.json(
        {
          user: rest,
          message: "User Profile Successfully Created",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { user: null, message: "Registeration failed" },
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
