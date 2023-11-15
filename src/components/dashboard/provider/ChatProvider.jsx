"use client";
import { createContext, useContext } from "react";

export const ChatContext = createContext({
  chatData: {
    newMessage: {
      media: null,
      message: "",
    },
    popUpChat: {
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
    inputSwitcher: false,
    replyPreview: {
      username: String,
      media: String,
      content: String,
    },
    ept: null,
    chatId: null,
    showCheckBox: false,
    setShowCheckBox: () => {},
    setChatId: () => {},
    setEpt: () => {},
    setReplyPreview: () => {},
    setInputSwitcher: () => {},
    setNewMessage: () => {},
    setpopUpChat: () => {},
  },
});

export const useChatContext = () => useContext(ChatContext);

export const MessageContext = createContext({
  messages: [
    {
      id: String,
      content: "",
      media: "",
      createdAt: Date,
      updatedAt: Date,
      senderId: String,
      recipientId: String,
      isRead: Boolean,
      isDeleted: Boolean,
      isEdit: Boolean,
      sender: {
        id: String,
        username: String,
        profile: {
          profilePicture: String,
        },
      },
      replies: [{}],
    },
  ],
  session: {
    user: {
      id: String,
    },
  },
});

export const useMessageContext = () => useContext(MessageContext);

export const ReplyContext = createContext({
  replies: [
    {
      id: String,
      content: null,
      media: null,
      createdAt: Date,
      updatedAt: Date,
      senderId: String,
      recipientId: String,
      messageId: String,
      isRead: Boolean,
      isEdit: Boolean,
      sender: {
        id: String,
        username: String,
        profile: {
          profilePicture: String,
        },
      },
    },
  ],
  session: {
    user: {
      id: String,
    },
  },
  message: {
    content: null,
    media: null,
    sender: {
      profile: {
        profilePicture: String,
      },
    },
  },
});

export const useReplyContext = () => useContext(ReplyContext);
