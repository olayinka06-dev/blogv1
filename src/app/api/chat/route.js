import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import pusher from "../../../lib/pusher";

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("t");
  const messageId = searchParams.get("id");
  console.log("messageId", { messageId, type });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!messageId) {
    return NextResponse.json(
      { message: "Message Id is required" },
      { status: 401 }
    );
  }
  // Find the comment in the database
  const message = await db.message.findUnique({
    where: { id: messageId },
    select: { 
      senderId: true,
      replies: true,
     },
  });

  if (!message) {
    return NextResponse.json({ message: "Message not found" }, { status: 404 });
  }

  try {
    if (type === "remove") {
      // Check if the authenticated user is the owner of the comment
      if (message.senderId === session.user.id) {

        // Delete associated replies first
        await Promise.all(
          message.replies.map(async (reply) => {
            await db.reply.delete({ where: { id: reply.id } });
          })
        );

        // Then delete the message after its associated replies are deleted
        await db.message.delete({ where: { id: messageId } });

        //   Trigger Pusher event for message deletion
        await pusher.trigger("chat", "remove-message", messageId);

        return NextResponse.json(
          { message: "message Removed successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Unauthorized, you can only Removed your message" },
          { status: 403 }
        );
      }
    } else if (type === "restore") {
      // Check if the authenticated user is the owner of the comment
      if (message.senderId === session.user.id) {
        // Delete the Message
        // Update the message's status to indicate it's deleted
        const deletedMessage = await db.message.update({
          where: { id: messageId },
          data: { isDeleted: false },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    profilePicture: true,
                  },
                },
              },
            },
          },
        });

        // Trigger Pusher event for message update
        await pusher.trigger("chat", "delete-message", {
          message: `${JSON.stringify(deletedMessage)}\n\n`,
        });

        return NextResponse.json(
          { message: "message Restored successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Unauthorized, you can only Restore your message" },
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
