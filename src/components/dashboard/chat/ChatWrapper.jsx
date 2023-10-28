"use client";
import React, {useState} from "react";
import ChatComponent from "@/components/dashboard/chat/ChatComponent";
import { ChatContext } from "@/components/dashboard/provider/ChatProvider";

const ChatWrapper = () => {
    const [newMessage, setNewMessage] = useState({
        media: null,
        message: ""
    });


    const chatData = {
        newMessage,
        setNewMessage
    }
  return (
    <section>
      <ChatContext.Provider value={{chatData: chatData}}>
        <ChatComponent />
      </ChatContext.Provider>
    </section>
  );
};

export default ChatWrapper;
