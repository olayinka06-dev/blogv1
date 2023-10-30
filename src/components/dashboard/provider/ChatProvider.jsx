"use client";
import { createContext, useContext } from "react";

export const ChatContext = createContext({
  chatData: {
    newMessage: {
      media: null,
      message: "",
    },
    chatComments: {
      id: "",
      text: "",
      postId: "",
      userId: "",
      createdAt: Date,
      updatedAt: Date,
    },
    setNewMessage: () => {},
  },
});

export const useChatContext = () => useContext(ChatContext);
