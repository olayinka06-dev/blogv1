"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { BiChevronDown, BiCopy } from "react-icons/bi";
import { useChatContext, useReplyContext } from "../provider/ChatProvider";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillReplyAllFill, BsReplyFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { formatDate } from "@/lib/__hs";
import { CopyToClipBoard, Error, Success } from "@/lib/entities";
import Pusher from "pusher-js";

const ChatReply = () => {
  const { replies: reply, session, message } = useReplyContext();
  const { chatData } = useChatContext();
  const replyPopupRef = useRef(null);
  const [replies, setReplies] = useState(reply);
  const {
    setNewMessage,
    newMessage,
    setInputSwitcher,
    setEpt,
    setChatId,
    setReplyPreview,
    replyPreview,
  } = chatData;
  const [replyInfo, setReplyInfo] = useState(null);

  useEffect(() => {
    var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "mt1",
    });

    var channel = pusher.subscribe("reply");
    // channel.bind("forward", function (data) {
    //   const parsedComments = JSON.parse(data.message);
    //   setReplies((prev) => [...prev, parsedComments]);
    // });

    channel.bind("new-reply", function (data) {
      const newReply = JSON.parse(data.message);
      // Update the corresponding message with the new reply
      setReplies((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === newReply.messageId) {
            return {
              ...message,
              replies: [...message.replies, newReply],
            };
          }
          return message;
        })
      );
    });

    channel.bind("edit-reply", function (data) {
      const updatedMessage = JSON.parse(data.message);
      setReplies((prevMessages) =>
        prevMessages?.map((message) =>
          message.id === updatedMessage.id ? updatedMessage : message
        )
      );
    });

    // channel.bind("delete-message", function (data) {
    //   const deletedMessage = JSON.parse(data.message);
    //   setMessages((prevMessages) =>
    //     prevMessages.map((message) =>
    //       message.id === deletedMessage.id ? deletedMessage : message
    //     )
    //   );
    // });
    // channel.bind("remove-message", function (messageId) {
    //   setMessages((prevMessages) =>
    //     prevMessages.filter((message) => message.id !== messageId)
    //   );
    // });

    return () => {
      pusher.unsubscribe("reply");
    };
  }, [replies]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        replyPopupRef.current &&
        !replyPopupRef.current.contains(event.target)
      ) {
        // Clicked outside the message popup, close it.
        setReplyInfo(null); // Set commentInfo to null or perform any action to hide the popup
      }
    };

    // Add the event listener
    document.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [replyInfo]);

  const handleShowReplyInfo = (replyId) => {
    if (replyInfo === replyId) {
      setReplyInfo(null);
      // Close the message info if it's already open
    } else {
      setReplyInfo(replyId); // Open the message info if it's closed
    }
  };

  const handleReplyReplies = (reply) => {
    setReplyPreview({
      ...replyPreview,
      media: reply?.media,
      content: reply?.content,
      username: reply?.sender?.username,
    });
    setInputSwitcher(true);
    setReplyInfo(null);
    setChatId(message?.id);
    setEpt("reply_replies");
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const BASE_URL = `/api/chat/reply?id=${replyId}`;
      const resp = await fetch(BASE_URL, {
        method: "DELETE",
      });

      const result = await resp.json();
      const { message } = result;
      setReplyInfo(null);

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

  const handleEditReply = (reply) => {
    setNewMessage({ ...newMessage, message: reply?.content });
    setReplyInfo(null);
    setChatId(reply?.id);
    setEpt("edit_reply");
  };

  const handleCopy = async (reply) => {
    await CopyToClipBoard(reply);
    setReplyInfo(null);
  };

  return (
    <div className="">
      {replies?.map((reply) => (
        <div
          key={reply?.id}
          className={`chat  ${
            reply?.sender?.id === session?.user?.id ? " chat-end" : "chat-start"
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
                    src={message?.sender?.profile?.profilePicture}
                    height={20}
                    width={20}
                    className="rounded-full w-4 h-4"
                    priority
                  />
                </div>
                <span>
                  <BsReplyFill />
                </span>
              </div>
              <span>{message?.content?.slice(0, 30) + "..."}</span>
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
              {reply?.isEdit && (
                <span className="text-[10px] flex justify-end">Edited</span>
              )}
            </div>
            {replyInfo === reply.id && (
              <div
                ref={replyPopupRef}
                className={`flex  flex-col z-[100] bg-white w-[200px] shadow border  h-fit gap-2 absolute top-[-5rem] ${
                  reply?.sender?.id === session?.user?.id ? "right-6" : "left-0"
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
