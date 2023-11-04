"use client";
import React, { useState } from "react";
import ChatComponent from "@/components/dashboard/chat/ChatComponent";
import { ChatContext } from "@/components/dashboard/provider/ChatProvider";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { Navbar } from "../navbar/Navbar";

const ChatWrapper = ({
  chatComments,
  friendList,
  friendId,
  profilePicture,
  unread,
  receipant_info,
  session,
}) => {
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
    profilePicture,
    receipant_info,
  };
  return (
    <section>
      <ChatContext.Provider value={{ chatData: chatData }}>
        <>
          <Sidebar picture={profilePicture} unread={unread} />
          <>
            <Navbar />
            <ChatComponent session={session}/>
          </>
        </>
      </ChatContext.Provider>
    </section>
  );
};

export default ChatWrapper;
