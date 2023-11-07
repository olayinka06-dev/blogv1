import { NextResponse } from "next/server";
import {db} from "../../../lib/db";

export async function GET() {
    
    try {
        const users = await db.user.findMany({
            include: {
                sentMessages: true,
                receivedMessages: true
            }
        });
    
        return NextResponse.json({users, message: "all data"}, {status: 200})
    } catch (error) {
       console.log(error); 
       return NextResponse.json({message: "Internal server error"}, {status: 500})
    }
}