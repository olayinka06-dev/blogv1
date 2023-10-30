import React from "react";
import ChatWrapper from "@/components/dashboard/chat/ChatWrapper";
import { db } from "@/lib/db";

async function getAllChatComment() {
  try {
    const allChatComment = await db.comment.findMany();
    return allChatComment;
  } catch (error) {
    
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

const Chat = async () => {
  const allChat = await getAllChatComment();
  const friendList = await getMyFriends();

  return (
    <section>
      <ChatWrapper chatComments={allChat} friendList={friendList} />
    </section>
  );
};

export default Chat;
