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
  const [popUpChat, setpopUpChat] = useState({
    media: null,
    message: "",
  });
  const [receiver] = useState(friendId);
  const [inputSwitcher, setInputSwitcher] = useState(false);
  const [replyPreview, setReplyPreview] = useState({
    username: "",
    media: "",
    content: "",
  });
  const [ept, setEpt] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showCheckBox, setShowCheckBox] = useState(false);

  const handleCheckboxChange = (messageId) => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(selectedMessages.filter((id) => id !== messageId));
    } else {
      setSelectedMessages([...selectedMessages, messageId]);
    }
  };

  const chatData = {
    setNewMessage,
    setpopUpChat,
    setInputSwitcher,
    setReplyPreview,
    setEpt,
    setChatId,
    setShowCheckBox,
    setSelectedMessages,
    selectedMessages,
    showCheckBox, 
    chatId, 
    ept, 
    replyPreview,
    inputSwitcher,
    receiver,
    newMessage,
    popUpChat,
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
