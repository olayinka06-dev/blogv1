"use client";
import React, { useState } from "react";
import { useChatContext } from "../provider/ChatProvider";
import { BiPlus, BiSend } from "react-icons/bi";
import { handleImageSaveToFireBase } from "@/lib/__hs";
import { SlClose } from "react-icons/sl";

export const FormSubmit = () => {
  const { chatData } = useChatContext();
  const { newMessage, setNewMessage } = chatData;
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [showMedia, setShowMedia] = useState(false);
  const handleUploadMedia = (e) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setNewMessage({ ...newMessage, media: file });
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    setShowMedia(true);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log(newMessage);
    try {
      const BASE_URL = "/api/get-started";
      const saveImageToFirebase = await handleImageSaveToFireBase(
        newMessage.media
      );
      if (saveImageToFirebase !== "") {
        const resp = await fetch(BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });
        const result = await resp.json();
        const { message, status } = result;

        if (resp.ok) {
          Success(message);
          //   router.push("/blog");
        } else {
          Error(message);
        }
      } else {
        Error("Unable to upload");
      }
    } catch (error) {
      console.log(error);
      Error(error);
    }
  };
  return (
    <div className="fixed w-full md:w-[70%] py-5 mx-auto bottom-0">
      <form
        onSubmit={handleSendMessage}
        className="px-2  flex items-center gap-2"
      >
        {showMedia ? (
          <div className="absolute top-[-20rem] shadow border rounded py-7 px-3 max-w-lg bg-white">
            <span className="flex justify-end cursor-pointer mb-2" onClick={()=> setShowMedia(false)}><SlClose /></span>
            <label htmlFor="media">
              <figure className="max-w-full mb-2 ">
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
                <input type="text" placeholder="enter your message" className="w-[80%] input py-[7px!important] flex-grow input-bordered input-md" name="" id="" />
                <button className="btn w-[20%]"><BiSend/></button>
              </div>
            </label>
          </div>
        ) : null}

        <label htmlFor="media">
          <span>
            <BiPlus />
          </span>
          <input
            type="file"
            onChange={handleUploadMedia}
            className="hidden"
            name="media"
            id="media"
          />
        </label>
        <input
          value={newMessage.message}
          onChange={(e) =>
            setNewMessage({ ...newMessage, message: e.target.value })
          }
          className="input flex-grow input-bordered input-md w-[90%] "
          type="text"
        />
        <button type="submit" className="w-[10%] btn">
          Send
        </button>
      </form>
    </div>
  );
};
