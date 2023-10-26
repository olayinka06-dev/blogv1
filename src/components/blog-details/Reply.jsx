import Image from "next/image";
import React from "react";
import { BiChevronDown } from "react-icons/bi";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { formatDate } from '@/lib/__hs';

const Reply = () => {
  return (
    <div
      key={index}
      className={`chat  ${
        comment?.user?.id === session?.user?.id ? " chat-end" : "chat-start"
      }`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image
            src={comment?.user?.profile?.profilePicture || "/next.svg"}
            alt={comment?.user?.profile?.profilePicture}
            height={50}
            width={50}
          />
        </div>
      </div>
      <div className="chat-header">
        {comment?.user?.username}
        <time className="text-xs opacity-50">
          {formatDate(comment?.createdAt)}
        </time>
      </div>
      <div className="chat-bubble bg-white relative text-gray-700">
        {comment?.user?.id === session?.user?.id && (
          <span
            onClick={() => handleShowCommentInfo(comment.id)}
            className=" absolute cursor-pointer top-0 right-0"
          >
            <BiChevronDown />
          </span>
        )}
        {comment?.text}
        {commentInfo === comment.id &&
          comment?.user?.id === session?.user?.id && (
            <div className="flex flex-col z-[100] bg-white w-[200px] shadow border rounded-xl h-fit gap-2 absolute items-center mt-3">
              <span
                className="btn flex flex-row justify-start gap-1 btn-sm w-full bg-white border-none text-right"
                onClick={() => handleEditComment(comment)}
              >
                <span>
                  <MdModeEditOutline />
                </span>
                <span>Edit</span>
              </span>
              <button
                className="btn btn-sm w-full flex flex-row justify-start gap-1 bg-white border-none text-right"
                onClick={() => handleDeleteComment(comment?.id)}
              >
                <span>
                  <RiDeleteBin5Line />
                </span>
                <span>Delete</span>
              </button>
              <button className="btn btn-sm w-full bg-white border-none text-right">
                Copy
              </button>
              <button className="btn btn-sm w-full bg-white border-none text-right">
                Reply
              </button>
            </div>
          )}
      </div>
      <div className="chat-footer opacity-50">Delivered</div>
    </div>
  );
};

export default Reply;
