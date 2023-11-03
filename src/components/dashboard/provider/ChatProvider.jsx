"use client";
import { createContext, useContext } from "react";

export const ChatContext = createContext({
  chatData: {
    newMessage: {
      media: null,
      message: "",
    },
    receiver: null,
    unread: 0,
    receipant_info: {
      id: "",
      username: "",
      profile: {
        profilePicture: null,
      },
    },
    profilePicture: {
      id: "",
      username: "",
      profile: {
        profilePicture: "",
      },
    },
    chatComments: {
      id: "",
      text: "",
      postId: "",
      userId: "",
      createdAt: Date,
      updatedAt: Date,
    },
    friendList: [
      {
        id: "",
        username: "",
        profile: {
          profilePicture: "",
        },
      },
    ],
    setNewMessage: () => {},
  },
});

export const useChatContext = () => useContext(ChatContext);
