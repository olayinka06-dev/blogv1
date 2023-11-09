"use client";
import React, { useState } from "react";
import { useChatContext } from "../provider/ChatProvider";
import { BiPlus, BiSend } from "react-icons/bi";
import { handleImageSaveToFireBase } from "@/lib/__hs";
import { SlClose } from "react-icons/sl";
import { Error, Success } from "@/lib/entities";

const FormSubmit = () => {
  const { chatData } = useChatContext();
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
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
  } = chatData;
  const [showMedia, setShowMedia] = useState(false);


  const handleUploadMedia = async (e) => {
    setShowMedia(true);
    const file = e.target.files[0];
    if (!e.target.files) return;
    const saveImageToFirebase = await handleImageSaveToFireBase(
      e.target.files[0]
    );

    if (saveImageToFirebase !== "") {
      // setImageLoading(false);
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
      // setImageLoading(true);
      return true;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // console.log("Message", imagePreviewUrl ? popUpChat : newMessage);
    try {
      let BASE_URL;
      let params;

      if (ept === "edit") {
        BASE_URL  = "/api/chat/message";
        params = {
          messageId: chatId,
          content: newMessage.message,
        }
        console.log("type edit", params);
      }
      else if (ept === "reply"){
        BASE_URL  = "/api/chat/reply";
        params = {

        }
        console.log("type reply", params);
      }
      else {
        
        BASE_URL  = "/api/chat/message";
        params = { 
          recipientId: receiver, 
          content: imagePreviewUrl ? popUpChat.message : newMessage.message, 
          media : imagePreviewUrl ? popUpChat.media : newMessage.media,
        }
        console.log("type post", params);
      }

      const resp = await fetch(BASE_URL, {
        method: "POST",
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
        setImagePreviewUrl("")
        setNewMessage({...newMessage, message: "", media: null})
        setpopUpChat({...popUpChat, message: "", media: null})
        //   router.push("/blog");
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
            <div className="absolute top-[-45px] px-2 py-2 border w-full bg-white">
              <span className="border-l-[4px] py-1 rounded pl-2 border-accent">{newMessage.message}</span>
              <span onClick={()=> {setInputSwitcher(false); setNewMessage({...newMessage, message: ""})}} className="float-right cursor-pointer"><SlClose/></span>
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

