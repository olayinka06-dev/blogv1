"use client";
import React, { useState } from "react";
import ChatComponent from "@/components/dashboard/chat/ChatComponent";
import { ChatContext } from "@/components/dashboard/provider/ChatProvider";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

const ChatWrapper = ({ chatComments, friendList, friendId }) => {
  const [newMessage, setNewMessage] = useState({
    media: null,
    message: "",
  });
  const [receiver] = useState(friendId);

  const chatData = {
    setNewMessage,
    receiver, 
    newMessage,
    chatComments,
    friendList,
  };
  return (
    <section>
      <ChatContext.Provider value={{ chatData: chatData }}>
        <>
          <Sidebar />
          <ChatComponent />
        </>
      </ChatContext.Provider>
    </section>
  );
};

export default ChatWrapper;
