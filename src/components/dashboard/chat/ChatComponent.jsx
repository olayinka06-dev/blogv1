"use client";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { MessageContext, useChatContext } from "../provider/ChatProvider";
import Form from "../forms/Form";
import ChatMessages from "../chat/ChatMessages";
import FormSubmit from "../forms/FormGroup";

const ChatComponent = ({ session }) => {
  const { chatData } = useChatContext();
  const { chatComments: data } = chatData;
  const [messages, setMessages] = useState(data);


  useEffect(() => {
    var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "mt1",
    });

    var channel = pusher.subscribe("chat");
    channel.bind("hello", function (data) {
      const parsedComments = JSON.parse(data.message);
      setMessages((prev) => [...prev, parsedComments]);
    });

    channel.bind("edit-message", function (data) {
      const updatedMessage = JSON.parse(data.message);
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === updatedMessage.id ? updatedMessage : message
        )
      );
    });

    channel.bind("delete-message", function (data) {
      const deletedMessage = JSON.parse(data.message);
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === deletedMessage.id ? deletedMessage : message
        )
      );
      // setMessages((prevMessages) =>
      //   prevMessages.filter((message) => message.id !== messageId)
      // );
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, [messages]);

  return (
    <div className="p-6 flex-grow max-h-screen overflow-y-auto pt-10 pb-48">
      <MessageContext.Provider value={{ messages, session }}>
        <ChatMessages />
        <FormSubmit />
      </MessageContext.Provider>
      {/* <Form /> */}
    </div>
  );
};

export default ChatComponent;
