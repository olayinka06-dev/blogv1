"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BiChevronDown, BiCopy } from "react-icons/bi";
import { useMessageContext } from "../provider/ChatProvider";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillReplyAllFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { formatDate } from "@/lib/__hs";
import { CopyToClipBoard } from "@/lib/entities";

const ChatMessages = () => {
  const { messages, session } = useMessageContext();
  const [commentInfo, setCommentInfo] = useState(null);

  const handleShowMessageInfo = (messageId) => {
    
    if (commentInfo === messageId) {
      setCommentInfo(null);
       // Close the comment info if it's already open
    } else {
      setCommentInfo(messageId); // Open the comment info if it's closed
    }
  };

  const handleSendMessage = () => {
    console.log("hello");
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const BASE_URL = `/api/post/comments?id=${commentId}`;
      const resp = await fetch(BASE_URL, {
        method: "DELETE",
      });

      const result = await resp.json();
      const { message } = result;

      if (resp.ok) {
        Success(message);
        router.refresh();
        // Remove the deleted message from the local state
        const updatedComments = comments.filter((c) => c.id !== commentId);
        setComments(updatedComments);
      } else {
        Error(message);
      }
    } catch (error) {
      console.log(error);
      Error(error);
    }
  };

  const handleEditComment = (message) => {
    setEditingComment({
      commentId: message.id,
      text: message.text,
    });
  };

  const handleCopy = async (message) => {
    await CopyToClipBoard(message);
    setCommentInfo(null);
  };

  return (
    <section>
      {messages?.map((message) => (
        <div
          key={message}
          className={`chat  ${
            message?.sender?.id === session?.user?.id
              ? " chat-end"
              : "chat-start"
          }`}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image
                src={message?.sender?.profile?.profilePicture || "/next.svg"}
                alt={message?.sender?.profile?.profilePicture}
                height={50}
                width={50}
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
             
              <div className="flex flex-col z-[100] bg-white w-[200px] shadow border  h-fit gap-2 absolute top-[-5rem] left-0 items-center mt-3">
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
                  <div>
                    <button
                      className="btn btn-sm w-full flex flex-row justify-start gap-1 bg-white border-none text-right"
                      onClick={() => handleDeleteComment(message?.id)}
                    >
                      <span>
                        <RiDeleteBin5Line />
                      </span>
                      <span>Delete</span>
                    </button>
                  </div>
                )}

                <button onClick={()=> handleCopy(message?.content)} className="btn btn-sm w-full flex flex-row justify-start bg-white border-none text-right">
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
      ))}
    </section>
  );
};

export default ChatMessages;
