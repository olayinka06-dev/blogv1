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
    chatComments: [
      {
        id: "",
        content: "",
        media: "",
        createdAt: Date,
        updatedAt: Date,
        senderId: "",
        recipientId: "",
        isRead: Boolean,
        sender: {
          id: "",
          username: "",
          profile: {
            profilePicture: "",
          },
        },
      },
    ],
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

export const MessageContext = createContext({
  messages: [{
    id: String,
    content: String,
    media: String,
    createdAt: Date,
    updatedAt: Date,
    senderId: String,
    recipientId: String,
    isRead: Boolean,
    sender: {
      id: String,
      username: String,
      profile: {
        profilePicture: String,
      },
    },
  }],
  session: {
    user: {
      id: String,
    },
  },
});

export const useMessageContext = () => useContext(MessageContext);
