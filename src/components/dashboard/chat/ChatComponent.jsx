"use client";
import { useEffect, useState } from "react";
import { BiChevronDown, BiCopy } from "react-icons/bi";
import {FormSubmit} from "@/components/dashboard/forms/FormGroup"
import Pusher from "pusher-js";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillReplyAllFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [commentInfo, setCommentInfo] = useState(false);
  


  // var pusher = new Pusher('c847b0654ba40d0595cc', {
  //   cluster: 'mt1'
  // });

  // var channel = pusher.subscribe('my-channel');
  // channel.bind('my-event', function(data) {
  //   alert(JSON.stringify(data));
  // });

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
        // Remove the deleted comment from the local state
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

  const handleEditComment = (comment) => {
    setEditingComment({
      commentId: comment.id,
      text: comment.text,
    });
  };


  return (
    <div>
      {/* ${
          message.uid === currentUser.uid ? "chat-end" : "chat-start"
        } */}
      <div className={`chat chat-start `}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src={"/my-profile.jpeg"} />
          </div>
        </div>
        <div className="chat-header">Olayinka</div>
        <div className="chat-bubble">
          <span
            onClick={handleShowCommentInfo}
            className=" absolute top-0 right-0"
          >
            <BiChevronDown />
          </span>
          Hey how are you doing
          {commentInfo && (
            <div className="flex flex-col z-[100] bg-white w-[200px] shadow border rounded-xl h-fit gap-2 absolute top-[-5rem] left-0 items-center mt-3">
            {/* {comment?.user?.id === session?.user?.id && ( */}
              <span
                className="btn flex flex-row justify-start gap-1 btn-sm w-full bg-white border-none text-right"
                onClick={() => handleEditComment(comment)}
              >
                <span>
                  <MdModeEditOutline />
                </span>
                <span>Edit</span>
              </span>
            {/* )} */}
            {/* {comment?.user?.id === session?.user?.id && ( */}
              <button
                className="btn btn-sm w-full flex flex-row justify-start gap-1 bg-white border-none text-right"
                onClick={() => handleDeleteComment(comment?.id)}
              >
                <span>
                  <RiDeleteBin5Line />
                </span>
                <span>Delete</span>
              </button>
            {/* )} */}

            <button className="btn btn-sm w-full flex flex-row justify-start bg-white border-none text-right">
              <span>
                <BiCopy />
              </span>
              <span>Copy</span>
            </button>
            <button
              onClick={() => handleReplyComment(comment)}
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
      </div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.user_id}</strong>: {message.content}
          </div>
        ))}
      </div>
     <FormSubmit/>
    </div>
  );
};

export default ChatComponent;
