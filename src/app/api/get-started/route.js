import { NextResponse } from "next/server";

export async function POST(request){
    const payload = await request.json();
    const { confirmPassword: newconfirmPassword, ...rest } = payload;
    console.log(rest);
    try {
        if (payload) {
            return NextResponse.json({rest, message: "User Profile Successfully Created"}, {status: 200})
        } else {
            return NextResponse.json({message: "Registeration failed"}, {status: 400})
        }
    } catch (error) {
        return NextResponse.json({message: "Internal server error"}, {status: 500})
    }
}