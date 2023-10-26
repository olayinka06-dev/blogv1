"use client";
import { useEffect, useState } from "react";
import supabase from "../../components/dashboard/provider/Mydatabase";
import { BiChevronDown } from "react-icons/bi";

const Chat = ({ user, conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [commentInfo, setCommentInfo] = useState(false);

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

  // useEffect(() => {
  //   // Subscribe to real-time updates for the chat messages in the conversation
  //   const subscription = supabase
  //     .from(`chat_messages:conversation_id=eq.${conversationId}`)
  //     .on('INSERT', (payload) => {
  //       setMessages((prevMessages) => [...prevMessages, payload.new]);
  //     })
  //     .subscribe();

  //   return () => {
  //     // Unsubscribe from the real-time subscription when the component unmounts
  //     subscription.unsubscribe();
  //   };
  // }, [conversationId]);

  // const sendMessage = async () => {
  //   if (newMessage.trim() !== '') {
  //     const { data, error } = await supabase
  //       .from('chat_messages')
  //       .upsert([
  //         {
  //           user_id: user.id,
  //           conversation_id: conversationId,
  //           content: newMessage,
  //         },
  //       ]);

  //     if (error) {
  //       console.error('Error sending message:', error);
  //     } else {
  //       setNewMessage('');
  //     }
  //   }
  // };

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
            <div className="flex flex-col bg-white w-[200px] shadow border rounded-xl h-fit gap-2 absolute items-center mt-3">
              <span
                className="btn btn-sm w-full bg-white border-none text-right"
                onClick={() => handleEditComment(comment)}
              >
                Edit
              </span>
              <button
                className="btn btn-sm w-full bg-white border-none text-right"
                onClick={() => handleDeleteComment(comment?.id)}
              >
                Delete
              </button>
              <button className="btn btn-sm w-full bg-white border-none text-right">Copy</button>
              <button className="btn btn-sm w-full bg-white border-none text-right">Reply</button>
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
      <div className="fixed w-[70%] py-5 mx-auto bottom-0">
        <form onSubmit={handleSendMessage} className="px-2 flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input input-bordered input-md w-[90%] "
            type="text"
          />
          <button type="submit" className="w-[10%] btn ">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
