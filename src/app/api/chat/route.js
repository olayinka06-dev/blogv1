import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import pusher from "../../../lib/pusher";

export async function DELETE(request) {
  const session = getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("t");
  const messageId = searchParams.get("id");
  console.log("messageId", { messageId, type });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    if (type === "") {
      if (!messageId) {
        return NextResponse.json(
          { message: "Message Id is required" },
          { status: 401 }
        );
      }
      // Find the comment in the database
      const message = await db.message.findUnique({
        where: { id: messageId },
        select: { senderId: true },
      });

      if (!message) {
        return NextResponse.json(
          { message: "MessaGE not found" },
          { status: 404 }
        );
      }

      // Check if the authenticated user is the owner of the comment
      if (message.senderId === session.user.id) {
        // Delete the comment
        await db.message.delete({ where: { id: messageId } });

        //   Trigger Pusher event for message deletion
        await pusher.trigger("chat", "delete-message", messageId);

        return NextResponse.json(
          { message: "message deleted successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Unauthorized, you can only delete your message" },
          { status: 403 }
        );
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
