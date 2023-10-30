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

const Chat = async () => {
  const allChat = await getAllChatComment();

  return (
    <section>
      <ChatWrapper chatComments={allChat} />
    </section>
  );
};

export default Chat;
