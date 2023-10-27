"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { BiChevronDown, BiCopy } from "react-icons/bi";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { formatDate } from "@/lib/__hs";
import { BsFillReplyAllFill } from "react-icons/bs";
import { Success } from "@/lib/entities";
import { Error } from "@/lib/entities";
import { CopyToClipBoard } from "../../lib/entities";

const Reply = ({ comment, session }) => {
  const [replyInfo, setReplyInfo] = useState(null);
  const [replyingComment, setReplyingComment] = useState({
    commentId: null,
    text: "",
  });
  const [editingCommentReply, setEditingCommentReply] = useState({
    commentId: null,
    text: "",
  });
//implemented
  const handleShowReplyInfo = (replyId) => {
    if (replyInfo === replyId) {
      setReplyInfo(null); // Close the comment info if it's already open
    } else {
      setReplyInfo(replyId); // Open the comment info if it's closed
    }
  };



  const handleReplyComment = (reply) => {
    setReplyingComment({
      commentId: reply?.id,
    });
    setReplyInfo(null);
    setEditingCommentReply({ commentId: null, text: "" });
  };

  const handleSaveReplyComment = async (comment) => {
    try {
      const BASE_URL = `/api/post/reply`;
      const resp = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: comment.id,
          text: replyingComment.text,
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
    setReplyingComment({ commentId: null})
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
      {comment?.commentreply?.map((reply, index) => (
        <div key={index}>
          <div
            className={`chat mt-3 ${
              reply?.user?.id === session?.user?.id ? " chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <Image
                  src={reply?.user?.profile?.profilePicture || "/next.svg"}
                  alt={reply?.user?.profile?.profilePicture}
                  height={50}
                  width={50}
                />
              </div>
            </div>
            <div className="chat-header flex flex-row gap-2 items-center">
              {reply?.user?.username}
              <time className="text-xs mr-2 opacity-50">
                {formatDate(reply?.createdAt)}
              </time>
            </div>

            <div className="chat-bubble bg-white relative text-gray-700">
              <div className="bg-white  px-[1rem] py-[0.5rem] border rounded-xl text-gray-700">
                <Image
                  alt="logo"
                  src={comment?.user?.profile?.profilePicture}
                  height={20}
                  width={20}
                  className="rounded-full "
                  priority
                />
                <span>{comment?.text?.slice(0, 30) + "..."}</span>
              </div>
              <span
                onClick={() => handleShowReplyInfo(reply.id)}
                className=" absolute cursor-pointer top-0 right-0"
              >
                <BiChevronDown />
              </span>
              {reply?.text}
              {replyInfo === reply?.id && (
                <div className="flex flex-col z-[100] bg-white w-[200px] shadow border rounded-xl h-fit gap-2 absolute top-[-5rem] left-0 items-center mt-3">
                  {reply?.user?.id === session?.user?.id && (
                    <span
                      className="btn flex flex-row justify-start gap-1 btn-sm w-full bg-white border-none text-right"
                      onClick={() => handleEditReply(reply)}
                    >
                      <span>
                        <MdModeEditOutline />
                      </span>
                      <span>Edit</span>
                    </span>
                  )}
                  {reply?.user?.id === session?.user?.id && (
                    <button
                      className="btn btn-sm w-full flex flex-row justify-start gap-1 bg-white border-none text-right"
                      onClick={() => handleDeleteReply(reply?.id)}
                    >
                      <span>
                        <RiDeleteBin5Line />
                      </span>
                      <span>Delete</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopy(reply?.text)}
                    className="btn btn-sm w-full flex flex-row justify-start bg-white border-none text-right"
                  >
                    <span>
                      <BiCopy />
                    </span>
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleReplyComment(reply)}
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
          {replyingComment.commentId === reply?.id && (
            <div className="flex flex-row gap-2 mt-5">
              <input
                type="text"
                value={replyingComment.text}
                placeholder="reply to a reply ..."
                className="input input-bordered input-md w-[90%]"
                onChange={(e) =>
                  setReplyingComment({
                    ...replyingComment,
                    text: e.target.value,
                  })
                }
              />
              <button
                className="btn btn-accent text-white py-2 px-5"
                onClick={() => handleSaveReplyComment(reply)}
              >
                Reply
              </button>
            </div>
          )}
          {editingCommentReply.commentId === reply?.id && (
            <div className="flex flex-row gap-2 mt-5">
              <input
                type="text"
                value={editingCommentReply.text}
                className="input input-bordered input-md w-[90%]"
                onChange={(e) =>
                  setEditingCommentReply({
                    ...editingCommentReply,
                    text: e.target.value,
                  })
                }
              />
              <button
                className="btn btn-accent text-white py-2 px-5"
                onClick={() => handleEditSaveReply(reply)}
              >
                Edit and Save
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Reply;
