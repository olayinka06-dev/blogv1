"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { BiChevronDown, BiCopy } from "react-icons/bi";
import { useChatContext, useMessageContext } from "../provider/ChatProvider";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillReplyAllFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { formatDate } from "@/lib/__hs";
import { CopyToClipBoard, Error, Success } from "@/lib/entities";
import { NetworkError } from "@/components/NetworkError";
import { postData } from "@/action";

const ChatMessages = () => {
  const commentPopupRef = useRef(null);
  const { messages, session } = useMessageContext();
  const { chatData } = useChatContext();
  const { setNewMessage, newMessage } = chatData;

  const [commentInfo, setCommentInfo] = useState(null);

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
    setNewMessage({ ...newMessage, message: message?.content });
    setCommentInfo(null);
  };

  const handleDeleteComment = async (messageId) => {
    // try {
    //   const formData = new FormData();
    //   formData.append("messageId", messageId);

    //   await postData(formData);
    // } catch (error) {
    //   console.error(error);
    // }

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
        router.refresh();
        // // Remove the deleted comment from the local state
        // const updatedComments = comments.filter((c) => c.id !== commentId);
        // setComments(updatedComments);
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
  };

  const handleCopy = async (message) => {
    await CopyToClipBoard(message);
    setCommentInfo(null);
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
          <div
            key={message?.id}
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
              {message?.content}
              {commentInfo === message.id && (
                <div
                  ref={commentPopupRef}
                  className="flex flex-col z-[100] bg-white w-[200px] shadow border  h-fit gap-2 absolute top-[-5rem] left-0 items-center mt-3"
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
                      className="btn btn-sm w-full flex flex-row justify-start gap-1 bg-white border-none text-right"
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
                    className="btn btn-sm w-full flex flex-row justify-start bg-white border-none text-right"
                  >
                    <span>
                      <BiCopy />
                    </span>
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleReplyComment(message)}
                    className="btn btn-sm w-full flex flex-row justify-start bg-white border-none text-right"
                  >
                    <span>
                      <BsFillReplyAllFill />
                    </span>
                    <span>Reply</span>
                  </button>
                </div>
              )}
            </div>
            <div className="chat-footer opacity-50">Delivered</div>
          </div>
        ))
      )}
    </section>
  );
};

export default ChatMessages;
