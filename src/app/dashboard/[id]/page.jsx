import React from "react";
import ChatWrapper from "@/components/dashboard/chat/ChatWrapper";
import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

async function getAllChatComment(friendId, userId) {
  try {
    // const messages = await db.chatMessage.findMany({
    //   where: {
    //     OR: [
    //       { userId, chatRoom: { members: { some: { id: friendId } } } },
    //       { userId: friendId, chatRoom: { members: { some: { id: userId } } }},
    //     ],
    //   },
    // });

    const chatRoom = await db.chatRoom.findFirst({
      where: {
        AND: [
          { members: { some: { id: userId } } },
          { members: { some: { id: friendId } } },
        ],
      },
    });

    if (!chatRoom) {
      // Handle the case where a chat room between the user and the selected friend doesn't exist.
      return "Chat room not found.";
    }

    const messages = await db.chatMessage.findMany({
      where: {
        chatRoomId: chatRoom.id, // Use the chat room ID to filter messages
      },
    });
    return messages;
  } catch (error) {
    console.error(error);
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

async function getUserProfile(friendId) {
  try {
    const response = await db.user.findFirst({
      where: { id: friendId },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            profilePicture: true,
          },
        },
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

const Chat = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const friendId = params?.id;
  const allChat = await getAllChatComment(friendId, userId);
  const friendList = await getMyFriends(userId);
  const profile = await getUserProfile(friendId);
  console.log(params.id);
  return (
    <section>
      <ChatWrapper
        chatComments={allChat}
        friendId={friendId}
        friendList={friendList}
      />
    </section>
  );
};

export default Chat;
