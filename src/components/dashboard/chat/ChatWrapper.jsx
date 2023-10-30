"use client";
import React, { useState } from "react";
import ChatComponent from "@/components/dashboard/chat/ChatComponent";
import { ChatContext } from "@/components/dashboard/provider/ChatProvider";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

const ChatWrapper = ({ chatComments, friendList }) => {
  const [newMessage, setNewMessage] = useState({
    media: null,
    message: "",
  });
  const [receiver, setReceiver] = useState(null);

  const handleSelect = (receiverId) => {
    setReceiver(receiverId);
  }

  const chatData = {
    setNewMessage,
    setReceiver,
    receiver, 
    newMessage,
    chatComments,
    friendList,
  };
  return (
    <section>
      <ChatContext.Provider value={{ chatData: chatData }}>
        <>
          <Sidebar handleSelect={handleSelect} />
          <ChatComponent />
        </>
      </ChatContext.Provider>
    </section>
  );
};

export default ChatWrapper;
