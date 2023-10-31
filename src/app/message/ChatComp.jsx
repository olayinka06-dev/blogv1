"use client";
import { useState, useEffect } from "react";

function Chat({ data, receiverId, senderId }) {
  // console.log("data", data);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    setMessages(data);
  }, []);

  // const loadMessages = async () => {
  //   const response = await fetch(`/api/message?senderId=${senderId}&receiverId=${receiverId}`);
  //   const data = await response.json();
  //   setMessages(data);
  // };

  const sendMessage = async () => {
    if (newMessage) {
      await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          content: newMessage,
          parentMessageId: replyingTo, // Set the parent message ID if replying
        }),
      });
      setNewMessage("");
      setReplyingTo(null);
      // loadMessages();
    }
  };

  const handleReply = (messageId) => {
    setReplyingTo(messageId);
  };

  // useEffect(() => {
  //   loadMessages();
  // }, []);

  return (
    <div>
      <div className="chat-messages">
        {messages?.map((message) => (
          <div key={message.id}>
            <p>{message.content}</p>
            {message.id === replyingTo ? (
              <div>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                />
                <button onClick={sendMessage}>Send Reply</button>
              </div>
            ) : (
              <button onClick={() => handleReply(message.id)}>Reply</button>
            )}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;