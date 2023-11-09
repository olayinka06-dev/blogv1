"use client";

// "use client";
import React, { useRef, useState } from "react";
import { postData } from "@/action";
import { BiPlus, BiSend } from "react-icons/bi";
import { handleImageSaveToFireBase } from "@/lib/__hs";
import { SlClose } from "react-icons/sl";
import { useChatContext } from "../provider/ChatProvider";

export default function FormSubmit() {
  const formRef = useRef(null);
  const { chatData } = useChatContext();
  const {
    newMessage,
    setNewMessage,
    receiver,
    popUpChat,
    setpopUpChat,
    inputSwitcher,
    setInputSwitcher,
  } = chatData;
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

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

    try {
      const formData = new FormData();
      if (imagePreviewUrl) {
        formData.append("content", popUpChat.message);
        formData.append("media", popUpChat.media);
        formData.append("receiver", receiver);
      } else {
        formData.append("content", newMessage.message);
        formData.append("media", newMessage.media);
        formData.append("receiver", receiver);
      }

      await postData(formData);
      formRef.current?.reset();
      setInputSwitcher(false);
      setShowMedia(false);
      setImagePreviewUrl("");
      setNewMessage({ ...newMessage, message: "", media: null });
      setpopUpChat({ ...popUpChat, message: "", media: null });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed w-full md:w-[70%] py-5 mx-auto bottom-0">
      <form
        ref={formRef}
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
          className={`w-[10%] disabled:btn-accent btn btn-accent text-white`}
        >
          <BiSend />
        </button>
      </form>
    </div>
  );
}

