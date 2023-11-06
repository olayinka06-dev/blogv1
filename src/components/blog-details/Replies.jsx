"use client";
import React, { useState } from "react";
import { BiChevronDown, BiCopy } from "react-icons/bi";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { formatDate } from "../../lib/__hs";
import { BsFillReplyAllFill } from "react-icons/bs";
import { Success } from "@/lib/entities";
import { Error } from "@/lib/entities";
import { CopyToClipBoard } from "../../lib/entities";
import Image from "next/image";

const Replies = ({ reply, session }) => {
  const [replyInfo, setReplyInfo] = useState(null);
  const [replyingComment, setReplyingComment] = useState({
    commentId: null,
    text: "",
  });
  const [editingCommentReply, setEditingCommentReply] = useState({
    commentId: null,
    text: "",
  });

  const handleShowReplyInfo = (replyId) => {
    if (replyInfo === replyId) {
      setReplyInfo(null); // Close the comment info if it's already open
    } else {
      setReplyInfo(replyId); // Open the comment info if it's closed
    }
  };

  const handleReplyReplies = (reply) => {
    setReplyingComment({
      commentId: reply?.id,
    });
    setReplyInfo(null);
    setEditingCommentReply({ commentId: null, text: "" });
  };

  const handleSaveReplyRelies = async (reply, commentId) => {
    try {
      const BASE_URL = `/api/post/reply/replies`;
      const resp = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: replyingComment.text,
          parentReplyId: reply.id,
          commentId: commentId,
        }),
      });
      const result = await resp.json();
      const { message } = result;

      if (resp.ok) {
        Success(message);
        router.refresh();
        // Reset the editing state
        setReplyingComment({ commentId: null, text: "" });
        // Refresh comments to show the updated one
        // const updatedComments = [...comments];
        // const editedCommentIndex = updatedComments.findIndex(
        //   (c) => c.id === comment.id
        // );
        // if (editedCommentIndex !== -1) {
        //   updatedComments[editedCommentIndex].text = editingComment.text;
        //   setComments(updatedComments);
        // }
      } else {
        Error(message);
      }
    } catch (error) {
      console.error(error);
      Error(error);
    }
  };

  //implemented
  const handleDeleteReply = async (replyId) => {
    try {
      const BASE_URL = `/api/post/reply?id=${replyId}`;
      const resp = await fetch(BASE_URL, {
        method: "DELETE",
      });

      const result = await resp.json();
      const { message } = result;
      setReplyInfo(null);

      if (resp.ok) {
        Success(message);
        router.refresh();
        // Remove the deleted comment from the local state
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

  //implemented
  const handleEditReply = (reply) => {
    setEditingCommentReply({
      commentId: reply?.id,
      text: reply?.text,
    });
    setReplyInfo(null);
    setReplyingComment({ commentId: null });
  };
  //implemented
  const handleEditSaveReply = async (reply) => {
    try {
      const BASE_URL = `/api/post/reply`;
      const resp = await fetch(BASE_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          replyId: reply?.id,
          text: editingCommentReply.text,
        }),
      });
      const result = await resp.json();
      const { message } = result;

      if (resp.ok) {
        Success(message);
        router.refresh();
        // Reset the editing state
        setEditingCommentReply({ commentId: null, text: "" });
        // // Refresh comments to show the updated one
        // const updatedComments = [...comments];
        // const editedCommentIndex = updatedComments.findIndex(
        //   (c) => c.id === comment.id
        // );
        // if (editedCommentIndex !== -1) {
        //   updatedComments[editedCommentIndex].text = editingComment.text;
        //   setComments(updatedComments);
        // }
      } else {
        Error(message);
      }
    } catch (error) {
      console.error(error);
      Error(error);
    }
  };

  //implemented
  const handleCopy = async (message) => {
    await CopyToClipBoard(message);
    setReplyInfo(null);
  };

  return (
    <>
      {reply?.childReplies.map((replies, index) => (
        <div
          key={index}
          className={`chat mt-3 ${
            replies?.user?.id === session?.user?.id ? " chat-end" : "chat-start"
          }`}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image
                src={replies?.user?.profile?.profilePicture || "/placeholder.jpg"}
                alt={replies?.user?.profile?.profilePicture}
                height={50}
                width={50}
              />
            </div>
          </div>
          <div className="chat-header flex flex-row gap-2 items-center">
            {replies?.user?.username}
            <time className="text-xs mr-2 opacity-50">
              {formatDate(replies?.createdAt)}
            </time>
          </div>

          <div className="chat-bubble bg-white relative text-gray-700">
            <div className="bg-white  px-[1rem] py-[0.5rem] border rounded-xl text-gray-700">
              <div className="flex items-center justify-between">
                  <Image
                    alt="logo"
                    src={reply?.user?.profile?.profilePicture}
                    height={20}
                    width={20}
                    className="rounded-full "
                    priority
                  />
                <span><BsFillReplyAllFill/></span>
              </div>
              <span>{reply?.text?.slice(0, 30) + "..."}</span>
            </div>
            <span
              onClick={() => handleShowReplyInfo(replies.id)}
              className=" absolute cursor-pointer top-0 right-0"
            >
              <BiChevronDown />
            </span>
            {replies?.text}
            {replyInfo === replies?.id && (
              <div className="flex flex-col z-[100] bg-white w-[200px] shadow border rounded-xl h-fit gap-2 absolute top-[-5rem] left-0 items-center mt-3">
                {replies?.user?.id === session?.user?.id && (
                  <span
                    className="btn flex flex-row justify-start gap-1 btn-sm w-full bg-white border-none text-right"
                    onClick={() => handleEditReply(replies)}
                  >
                    <span>
                      <MdModeEditOutline />
                    </span>
                    <span>Edit</span>
                  </span>
                )}
                {replies?.user?.id === session?.user?.id && (
                  <button
                    className="btn btn-sm w-full flex flex-row justify-start gap-1 bg-white border-none text-right"
                    onClick={() => handleDeleteReply(replies?.id)}
                  >
                    <span>
                      <RiDeleteBin5Line />
                    </span>
                    <span>Delete</span>
                  </button>
                )}

                <button
                  onClick={() => handleCopy(replies?.text)}
                  className="btn btn-sm w-full flex flex-row justify-start bg-white border-none text-right"
                >
                  <span>
                    <BiCopy />
                  </span>
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => handleReplyReplies(replies)}
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
    </>
  );
};

export default Replies;
