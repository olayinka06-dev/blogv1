"use client";
import React, { useState, useEffect, useRef } from "react";
import { BiChevronDown, BiCopy, BiSelection } from "react-icons/bi";
import {
  ReplyContext,
  useChatContext,
  useMessageContext,
} from "../provider/ChatProvider";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillReplyAllFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { formatDate } from "@/lib/__hs";
import { CopyToClipBoard, Error, Success } from "@/lib/entities";
import { NetworkError } from "@/components/NetworkError";
import ChatReply from "./ChatReply";

const ChatMessages = () => {
  const commentPopupRef = useRef(null);
  const { messages, session } = useMessageContext();
  const { chatData } = useChatContext();
  const {
    setNewMessage,
    newMessage,
    setInputSwitcher,
    setEpt,
    setChatId,
    setReplyPreview,
    replyPreview,
    showCheckBox,
    setShowCheckBox,
    handleCheckboxChange,
    selectedMessages,
  } = chatData;

  const [commentInfo, setCommentInfo] = useState(null);
  const [checkMessage, setCheckMessage] = useState(null);

  const handleDeleteSelected = async () => {
    // try {
    //   // Make an API call to delete selected messages
    //   const response = await fetch('/api/messages/delete', {
    //     method: 'DELETE',
    //     body: JSON.stringify({ messageIds: selectedMessages }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   if (response.ok) {
    //     // Handle successful deletion
    //     console.log('Messages deleted successfully');
    //     // Update UI or fetch updated message list
    //   } else {
    //     // Handle deletion failure
    //     console.error('Failed to delete messages');
    //   }
    // } catch (error) {
    //   console.error('Error deleting messages:', error);
    // }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        commentPopupRef.current &&
        !commentPopupRef.current.contains(event.target)
      ) {
        // Clicked outside the comment popup, close it.
        setCommentInfo(null); // Set commentInfo to null or perform any action to hide the popup
      }
    };

    // Add the event listener
    document.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [commentInfo]);

  const handleShowMessageInfo = (messageId) => {
    if (commentInfo === messageId) {
      setCommentInfo(null);
      // Close the comment info if it's already open
    } else {
      setCommentInfo(messageId); // Open the comment info if it's closed
    }
  };

  const handleReplyComment = (message) => {
    setReplyPreview({
      ...replyPreview,
      media: message?.media,
      content: message?.content,
      username: message?.sender?.username,
    });
    setInputSwitcher(true);
    setCommentInfo(null);
    setChatId(message?.id);
    setEpt("reply");
  };

  const handleDeleteComment = async (messageId) => {
    try {
      const BASE_URL = `/api/chat/message?id=${messageId}`;
      const resp = await fetch(BASE_URL, {
        method: "DELETE",
      });

      const result = await resp.json();
      const { message } = result;
      setCommentInfo(null);

      if (resp.ok) {
        Success(message);
        // router.refresh();
      } else {
        Error(message);
      }
    } catch (error) {
      console.log(error);
      Error(error);
    }
  };

  const handleEditComment = (message) => {
    setNewMessage({ ...newMessage, message: message?.content });
    setCommentInfo(null);
    setChatId(message?.id);
    setEpt("edit");
  };

  const handleCopy = async (message) => {
    await CopyToClipBoard(message);
    setCommentInfo(null);
  };

  const handleRestoreMessage = async (messageId) => {
    try {
      const BASE_URL = `/api/chat?id=${messageId}&t=restore`;
      const resp = await fetch(BASE_URL, {
        method: "DELETE",
      });

      const result = await resp.json();
      const { message } = result;
      setCommentInfo(null);

      if (resp.ok) {
        Success(message);
      } else {
        Error(message);
      }
    } catch (error) {
      console.log(error);
      Error(error);
    }
  };
  const handleRemoveMessage = async (messageId) => {
    try {
      const BASE_URL = `/api/chat?id=${messageId}&t=remove`;
      const resp = await fetch(BASE_URL, {
        method: "DELETE",
      });

      const result = await resp.json();
      const { message } = result;
      setCommentInfo(null);

      if (resp.ok) {
        Success(message);
      } else {
        Error(message);
      }
    } catch (error) {
      console.log(error);
      Error(error);
    }
  };

  return (
    <section>
      {messages?.length === 0 ? (
        <div className="">
          <p>Get Started with a new message</p>
        </div>
      ) : messages?.includes("Error") ? (
        <NetworkError text={messages} />
      ) : (
        messages?.map((message) => (
          <div key={message?.id} className="">
            <div
              className={`chat  ${
                message?.sender?.id === session?.user?.id
                  ? " chat-end"
                  : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      message?.sender?.profile?.profilePicture ||
                      "/placeholder.jpg"
                    }
                    alt={message?.sender?.profile?.profilePicture}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              </div>
              <div className="chat-header flex flex-row gap-2 items-center">
                {message?.sender?.username}
                <time className="text-xs opacity-50">
                  {formatDate(message?.createdAt)}
                </time>
              </div>
              <div className="chat-bubble bg-gray-100 relative text-gray-700">
                <span
                  onClick={() => handleShowMessageInfo(message.id)}
                  className=" absolute cursor-pointer top-0 right-0"
                >
                  <BiChevronDown />
                </span>

                <div className="relative">
                  {showCheckBox && (
                    <input
                      type="checkbox"
                      className="absolute checkbox h-[1rem] w-[1rem] bg-white text-white checkbox-accent"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => handleCheckboxChange(message.id)}
                    />
                  )}

                  {message.isDeleted ? (
                    <span>This Message Was Deleted!</span>
                  ) : (
                    <div className="flex flex-col">
                      {message?.media && (
                        <img
                          className={`max-w-[300px] ${
                            message?.media && "mt-2"
                          }`}
                          src={message?.media}
                          alt=""
                        />
                      )}
                      {message?.content && <span>{message?.content}</span>}
                      {message?.isEdit && (
                        <span className="text-[10px] flex justify-end">
                          Edited
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {commentInfo === message.id && !message.isDeleted && (
                  <div
                    ref={commentPopupRef}
                    className={`flex  flex-col z-[100] bg-white w-[200px] shadow border  h-fit gap-2 absolute top-[-5rem] ${
                      message?.sender?.id === session?.user?.id
                        ? "right-6"
                        : "left-0"
                    } items-center mt-3`}
                  >
                    {message?.sender?.id === session?.user?.id && (
                      <span
                        className="btn flex flex-row justify-start gap-1 btn-sm w-full rounded-none bg-white border-none text-right"
                        onClick={() => handleEditComment(message)}
                      >
                        <span>
                          <MdModeEditOutline />
                        </span>
                        <span>Edit</span>
                      </span>
                    )}
                    {message?.sender?.id === session?.user?.id && (
                      <button
                        className="btn btn-sm w-full flex flex-row rounded-none justify-start gap-1 bg-white border-none text-right"
                        onClick={() => handleDeleteComment(message?.id)}
                      >
                        <span>
                          <RiDeleteBin5Line />
                        </span>
                        <span>Delete</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(message?.content)}
                      className="btn btn-sm w-full rounded-none flex flex-row justify-start bg-white border-none text-right"
                    >
                      <span>
                        <BiCopy />
                      </span>
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={() => handleReplyComment(message)}
                      className="btn btn-sm w-full rounded-none flex flex-row justify-start bg-white border-none text-right"
                    >
                      <span>
                        <BsFillReplyAllFill />
                      </span>
                      <span>Reply</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowCheckBox(true);
                        setCommentInfo(null);
                      }}
                      className="btn btn-sm w-full rounded-none flex flex-row justify-start bg-white border-none text-right"
                    >
                      <span>
                        <BiSelection />
                      </span>
                      <span>Select</span>
                    </button>
                  </div>
                )}
                {commentInfo === message.id && message.isDeleted && (
                  <div
                    ref={commentPopupRef}
                    className={`flex  flex-col z-[100] bg-white w-[200px] shadow border  h-fit gap-2 absolute top-[-5rem] ${
                      message?.sender?.id === session?.user?.id
                        ? "right-6"
                        : "left-0"
                    } items-center mt-3`}
                  >
                    {message?.sender?.id === session?.user?.id && (
                      <span
                        className="btn flex flex-row justify-start gap-1 btn-sm w-full rounded-none bg-white border-none text-right"
                        onClick={() => handleRestoreMessage(message?.id)}
                      >
                        <span>
                          <MdModeEditOutline />
                        </span>
                        <span>Restore</span>
                      </span>
                    )}
                    {message?.sender?.id === session?.user?.id && (
                      <button
                        className="btn btn-sm w-full flex flex-row rounded-none justify-start gap-1 bg-white border-none text-right"
                        onClick={() => handleRemoveMessage(message?.id)}
                      >
                        <span>
                          <RiDeleteBin5Line />
                        </span>
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="chat-footer opacity-50">Delivered</div>
            </div>
            <ReplyContext.Provider
              value={{ replies: message.replies, session, message }}
            >
              <ChatReply />
            </ReplyContext.Provider>
          </div>
        ))
      )}
    </section>
  );
};

export default ChatMessages;
