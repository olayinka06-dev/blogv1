"use client";
import React, { useState } from "react";
import { useChatContext, useMessageContext } from "../provider/ChatProvider";
import { BiPlus, BiSend } from "react-icons/bi";
import { handleImageSaveToFireBase } from "@/lib/__hs";
import { SlClose } from "react-icons/sl";
import { Error, Success } from "@/lib/entities";
import Image from "next/image";

const FormSubmit = () => {
  const { chatData } = useChatContext();
  const { messages: message, session } = useMessageContext();
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([message]);
  const {
    newMessage,
    setNewMessage,
    receiver,
    popUpChat,
    setpopUpChat,
    inputSwitcher,
    setInputSwitcher,
    ept,
    chatId,
    setChatId,
    replyPreview,
    setReplyPreview,
  } = chatData;
  const [showMedia, setShowMedia] = useState(false);

  // console.log();

  const handleUploadMedia = async (e) => {
    setShowMedia(true);
    setLoading(true);
    const file = e.target.files[0];
    if (!e.target.files) return;
    const saveImageToFirebase = await handleImageSaveToFireBase(
      e.target.files[0]
    );

    if (saveImageToFirebase !== "") {
      setLoading(false);
      console.log(saveImageToFirebase, "saveImageToFirebase");
      setpopUpChat((prevPopUpChat) => ({
        ...prevPopUpChat,
        media: saveImageToFirebase,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl("");
      setLoading(false);
      return true;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Update the local state with the new comment
    const newMsg = {
      id: new Date().getSeconds(),
      content: imagePreviewUrl ? popUpChat.message : newMessage.message,
      media: imagePreviewUrl,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      senderId: session?.user?.id,
      recipientId: receiver,
      isRead: false,
      sender: {
        id: session?.user?.id,
        username: session?.user?.username,
        profile: {
          profilePicture: "/placeholder.jpg",
        },
      },
    };

    setMessages([newMsg, ...messages]);

    try {
      let BASE_URL;
      let params;

      if (ept === "edit") {
        BASE_URL = "/api/chat/message";
        params = {
          messageId: chatId,
          content: newMessage.message,
        };
        console.log("type edit", params);
      } else if (ept === "reply") {
        BASE_URL = "/api/chat/reply";
        params = {
          content: imagePreviewUrl ? popUpChat.message : newMessage.message,
          media: imagePreviewUrl ? popUpChat.media : newMessage.media,
          messageId: chatId,
          recipientId: receiver,
        };
        console.log("type reply", params);
      } else {
        BASE_URL = "/api/chat/message";
        params = {
          recipientId: receiver,
          content: imagePreviewUrl ? popUpChat.message : newMessage.message,
          media: imagePreviewUrl ? popUpChat.media : newMessage.media,
        };
        console.log("type post", params);
      }
      const resp = await fetch(BASE_URL, {
        method: ept === "edit" ? "PATCH" : ept === "reply" ? "POST" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      console.log("response", resp?.payload);
      const result = await resp.json();
      const { message, status } = result;

      if (resp.ok) {
        Success(message);
        setShowMedia(false);
        setInputSwitcher(false);
        setChatId("");
        setImagePreviewUrl("");
        setNewMessage({ ...newMessage, message: "", media: null });
        setpopUpChat({ ...popUpChat, message: "", media: null });
      } else {
        Error(message);
      }
    } catch (error) {
      console.log(error);
      Error(error);
    }
  };
  return (
    <div className=" relative">
      <div className="fixed left-0 md:left-[27%] shadow bg-[rgba(255,255,255,0.9)] backdrop:blur-sm z-[500] w-full md:w-[70%] py-5 mx-auto bottom-0">
        <form
          onSubmit={handleSendMessage}
          className="px-2  flex items-center gap-2"
        >
          {showMedia ? (
            <div className="absolute top-[-20rem] shadow border rounded py-7 px-3 max-w-[28rem] bg-white">
              <span
                className="flex justify-end cursor-pointer mb-2"
                onClick={() => {
                  setShowMedia(false);
                  setImagePreviewUrl("");
                }}
              >
                <SlClose />
              </span>
              <label htmlFor="media">
                <figure className="max-w-full mb-2 relative">
                  {loading && (
                    <span className="loading absolute top-1/2 z-[1000] left-1/2 bg-white loading-spinner"></span>
                  )}
                  {imagePreviewUrl.includes("image") ? (
                    <img
                      className="max-h-[200px] max-w-full rounded-lg"
                      src={imagePreviewUrl}
                      alt="Image Preview"
                    />
                  ) : (
                    <video
                      className="max-h-[200px] max-w-full rounded-lg"
                      src={imagePreviewUrl}
                      controls
                    />
                  )}
                </figure>
                <div className="flex items-center gap-2">
                  <textarea
                    type="text"
                    placeholder="( optional caption )"
                    value={popUpChat.message}
                    onChange={(e) =>
                      setpopUpChat({ ...popUpChat, message: e.target.value })
                    }
                    className="w-[80%] input h-[2rem] resize-none leading-normal flex-grow input-bordered input-md"
                    name=""
                    id=""
                  />
                  <button
                    onClick={handleSendMessage}
                    className="btn h-[2rem] btn-accent text-white rounded-full px-4"
                  >
                    <BiSend />
                  </button>
                </div>
              </label>
            </div>
          ) : null}

          <label htmlFor="media">
            <span className="btn h-[2rem] btn-accent text-white rounded-full px-4">
              <BiPlus />
            </span>
            <input
              type="file"
              onChange={handleUploadMedia}
              className="hidden"
              name="media"
              id="media"
              multiple
            />
          </label>
          <div className="relative w-[90%]">
            {inputSwitcher && (
              <div className="absolute top-[-65px] flex flex-col px-2 py-2 border w-full bg-white">
                <div className="border-l-[4px] w-full relative flex items-center justify-between py-1 rounded pl-2 border-accent">
                  <span className="text-[10px]">{replyPreview.username}</span>
                  <span
                    onClick={() => {
                      setInputSwitcher(false);
                      setNewMessage({ ...newMessage, message: "" });
                    }}
                    className=" cursor-pointer"
                  >
                    <SlClose />
                  </span>
                </div>
                <div className="flex w-full justify-between items-center">
                  <span className=" ">{replyPreview.content}</span>

                  {replyPreview.media && (
                    <Image
                      src={replyPreview.media}
                      height={30}
                      width={30}
                      alt="logo"
                      priority
                    />
                  )}
                </div>
              </div>
            )}
            <textarea
              value={newMessage.message}
              onChange={(e) => {
                setNewMessage({ ...newMessage, message: e.target.value }),
                  setpopUpChat({ ...popUpChat, message: e.target.value });
              }}
              className="input flex-grow input-bordered input-md w-full"
              type="text"
              placeholder="Type your message..."
              disabled={showMedia}
            />
          </div>
          <button
            disabled={!newMessage.message}
            type="submit"
            className={` disabled:btn-accent btn h-[2rem] btn-accent text-white rounded-full px-4`}
          >
            <BiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormSubmit;
