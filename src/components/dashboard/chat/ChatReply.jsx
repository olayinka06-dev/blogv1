"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { BiChevronDown, BiCopy } from "react-icons/bi";
// import { useChatContext, useMessageContext } from "../provider/ChatProvider";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillReplyAllFill, BsReplyFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { formatDate } from "@/lib/__hs";
import { CopyToClipBoard, Error, Success } from "@/lib/entities";

const ChatReply = () => {
  return (
    <div className="">
      {replies?.map((reply) => (
        <div
          key={reply?.id}
          className={`chat  ${
            reply?.sender?.id === session?.user?.id
              ? " chat-end"
              : "chat-start"
          }`}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                src={
                  reply?.sender?.profile?.profilePicture || "/placeholder.jpg"
                }
                alt={reply?.sender?.profile?.profilePicture}
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
          <div className="chat-header flex flex-row gap-2 items-center">
            {reply?.sender?.username}
            <time className="text-xs opacity-50">
              {formatDate(reply?.createdAt)}
            </time>
          </div>
          <div className="chat-bubble bg-gray-100 relative text-gray-700">
            <div className="bg-white  px-[1rem] py-[0.5rem] border rounded-xl text-gray-700">
              <div className="flex items-center justify-between">
                <div className="">
                  <Image
                    alt="logo"
                    src={comment?.user?.profile?.profilePicture}
                    height={20}
                    width={20}
                    className="rounded-full "
                    priority
                  />
                </div>
                <span>
                  <BsReplyFill />
                </span>
              </div>
              <span>{comment?.text?.slice(0, 30) + "..."}</span>
            </div>
            <span
              onClick={() => handleShowReplyInfo(reply.id)}
              className=" absolute cursor-pointer top-0 right-0"
            >
              <BiChevronDown />
            </span>
            <div className="flex flex-col">
              {reply?.media && (
                <img
                  className={`max-w-[300px] ${reply?.media && "mt-2"}`}
                  src={reply?.media}
                  alt=""
                />
              )}
              {reply?.content && <span>{reply?.content}</span>}
            </div>
            {commentInfo === reply.id && (
              <div
                ref={commentPopupRef}
                className={`flex  flex-col z-[100] bg-white w-[200px] shadow border  h-fit gap-2 absolute top-[-5rem] ${
                  reply?.sender?.id === session?.user?.id
                    ? "right-6"
                    : "left-0"
                } items-center mt-3`}
              >
                {reply?.sender?.id === session?.user?.id && (
                  <span
                    className="btn flex flex-row justify-start gap-1 btn-sm w-full rounded-none bg-white border-none text-right"
                    onClick={() => handleEditReply(reply)}
                  >
                    <span>
                      <MdModeEditOutline />
                    </span>
                    <span>Edit</span>
                  </span>
                )}
                {reply?.sender?.id === session?.user?.id && (
                  <button
                    className="btn btn-sm w-full flex flex-row rounded-none justify-start gap-1 bg-white border-none text-right"
                    onClick={() => handleDeleteReply(reply?.id)}
                  >
                    <span>
                      <RiDeleteBin5Line />
                    </span>
                    <span>Delete</span>
                  </button>
                )}

                <button
                  onClick={() => handleCopy(reply?.content)}
                  className="btn btn-sm w-full rounded-none flex flex-row justify-start bg-white border-none text-right"
                >
                  <span>
                    <BiCopy />
                  </span>
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => handleReplyReplies(reply)}
                  className="btn btn-sm w-full rounded-none flex flex-row justify-start bg-white border-none text-right"
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
    </div>
  );
};

export default ChatReply;
