"use client";
import { createContext, useContext } from "react";

export const ChatContext = createContext({
  chatData: {
    newMessage: {
      media: null,
      message: "",
    },
    setNewMessage: () => {},
  },
});

export const useChatContext = () => useContext(ChatContext);
