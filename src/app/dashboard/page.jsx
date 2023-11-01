import React from "react";
import ChatWrapper from "@/components/dashboard/chat/ChatWrapper";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getAllChatComment() {
  try {
    const allChatComment = await db.comment.findMany();
    return allChatComment;
  } catch (error) {
    
  }
}

async function getMyFriends(userId) {
  try {
    // Get the authenticated user's ID
    // Find the user and include their friends
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        friends: {
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

    // Extract the list of friends
    const response = user.friends;

    console.log("friends", response);

    return response;
  } catch (error) {
    console.error("Error getting friends:", error);
  }
}

const Chat = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const allChat = await getAllChatComment();
  const friendList = await getMyFriends(userId);

  return (
    <section>
      <ChatWrapper chatComments={allChat} friendList={friendList} />
    </section>
  );
};

export default Chat;
