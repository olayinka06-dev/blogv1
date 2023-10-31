import React from "react";
import ChatWrapper from "@/components/dashboard/chat/ChatWrapper";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getAllChatComment(friendId, userId) {
  try {
    const messages = await db.chatMessage.findMany({
      where: {
        OR: [
          { userId, chatRoom: { members: { some: { id: friendId } } } },
          { userId: friendId, chatRoom: { members: { some: { id: userId } } }},
        ],
      },
    });
    return messages
  } catch (error) {
    console.error(error);
  }
}

async function getMyFriends(){
  try {
    const response = await db.user.findMany({
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            profilePicture: true,
          }
        }
      }
    });
     return response
  } catch (error) {
    console.error(error);
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
  const friendList = await getMyFriends();
  const profile = await getUserProfile(friendId);
  console.log(params.id);
  return (
    <section>
      <ChatWrapper chatComments={allChat} friendList={friendList} />
    </section>
  );
};

export default Chat;
