"use client";
import { useEffect, useState } from "react";
import { BiChevronDown, BiCopy } from "react-icons/bi";
import { FormSubmit } from "@/components/dashboard/forms/FormGroup";
import Pusher from "pusher-js";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillReplyAllFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { useChatContext } from "../provider/ChatProvider";
import { formatDate } from "@/lib/__hs";
import Image from "next/image";

const ChatComponent = ({ session }) => {
  const { chatData } = useChatContext();
  const { chatComments: data } = chatData;
  const [messages, setmessages] = useState(data);
  const [commentInfo, setCommentInfo] = useState(false);

  useEffect(() => {
    var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "mt1",
    });
  
    var channel = pusher.subscribe("chat");
    channel.bind("hello", function (data) {
      const parsedComments = JSON.parse(data.message);
  
      setmessages((prev) => [...prev, parsedComments]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const handleShowCommentInfo = () => {
    setCommentInfo(!commentInfo);
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

  return (
    <div className="p-6 flex-grow max-h-screen overflow-y-auto pt-10 pb-48">
      {/* ${
          message.uid === currentUser.uid ? "chat-end" : "chat-start"
        } */}
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
              onClick={() => handleShowCommentInfo(message.id)}
              className=" absolute cursor-pointer top-0 right-0"
            >
              <BiChevronDown />
            </span>
            {message?.content}
            {commentInfo === message.id && (
              <div className="flex flex-col z-[100] bg-white w-[200px] shadow border rounded-xl h-fit gap-2 absolute top-[-5rem] left-0 items-center mt-3">
                {message?.sender?.id === session?.user?.id && (
                  <span
                    className="btn flex flex-row justify-start gap-1 btn-sm w-full bg-white border-none text-right"
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

                <button className="btn btn-sm w-full flex flex-row justify-start bg-white border-none text-right">
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

      <FormSubmit />
    </div>
  );
};

export default ChatComponent;
