"use client";
import React, { useState } from "react";
import { useChatContext } from "../provider/ChatProvider";
import { BiPlus, BiSend } from "react-icons/bi";
import { handleImageSaveToFireBase } from "@/lib/__hs";
import { SlClose } from "react-icons/sl";
import { Error, Success } from "@/lib/entities";

export const FormSubmit = () => {
  const { chatData } = useChatContext();
  const { newMessage, setNewMessage, receiver } = chatData;
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [popUpChat, setpopUpChat] = useState({
    media: null,
    message: "",
  });
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

    console.log("Message", imagePreviewUrl ? popUpChat : newMessage);
    try {
      const BASE_URL = "/api/chat/message";

      const resp = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imagePreviewUrl ? {...popUpChat, receiver} : {...newMessage, receiver}),
      });
      console.log("response", resp?.payload);
      const result = await resp.json();
      const { message, status } = result;

      if (resp.ok) {
        Success(message);
        setShowMedia(false);
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
    <div className="fixed w-full md:w-[70%] py-5 mx-auto bottom-0">
      <form
        onSubmit={handleSendMessage}
        className="px-2  flex items-center gap-2"
      >
        {showMedia ? (
          <div className="absolute top-[-20rem] shadow border rounded py-7 px-3 max-w-[28rem] bg-white">
            <span
              className="flex justify-end cursor-pointer mb-2"
              onClick={() => {
                setShowMedia(false); setImagePreviewUrl("");
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
        <textarea
          value={newMessage.message}
          onChange={(e) => {
            setNewMessage({ ...newMessage, message: e.target.value }),
              setpopUpChat({ ...popUpChat, message: e.target.value });
          }}
          className="input flex-grow input-bordered input-md w-[90%] "
          type="text"
          placeholder="Type your message..."
          disabled={showMedia}
        />
        <button
          disabled={!newMessage.message}
          type="submit"
          className={`w-[10%] disabled:btn-accent btn btn-accent text-white`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

// import React, { useState } from "react";
// import { BiPlus, BiSend } from "react-icons/bi";
// import { SlClose } from "react-icons/sl";
// import { Error, Success } from "@/lib/entities";
// import { handleImageSaveToFireBase } from "@/lib/__hs"; // Import your handleImageSaveToFireBase function

// export const FormSubmit = () => {
//   const [popUpChat, setPopUpChat] = useState({
//     media: null,
//     message: "",
//   });
//   const [imagePreviewUrl, setImagePreviewUrl] = useState("");
//   const [showMedia, setShowMedia] = useState(false);

//   const handleUploadMedia = (e) => {
//     const file = e.target.files[0];

//     if (!file) {
//       return;
//     } else {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreviewUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//       setShowMedia(true);
//     }
//   };

//   const saveToCloud = async () => {
//     if (imagePreviewUrl) {
//       const saveImageToFirebaseResult = await handleImageSaveToFireBase(imagePreviewUrl); // Replace with your actual function
//       setPopUpChat((prevPopUpChat) => ({
//         ...prevPopUpChat,
//         media: saveImageToFirebaseResult,
//       }));
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     await saveToCloud();

//     console.log("Message", imagePreviewUrl ? popUpChat : newMessage);

//     // You can now send the message with the updated media URL in popUpChat.media
//     try {
//       const BASE_URL = "/api/chat/comments";
//       const resp = await fetch(BASE_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(imagePreviewUrl ? popUpChat : newMessage),
//       });

//       const result = await resp.json();
//       const { message, status } = result;

//       if (resp.ok) {
//         Success(message);
//         setShowMedia(false);
//       } else {
//         Error(message);
//       }
//     } catch (error) {
//       console.error(error);
//       Error(error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSendMessage}>
//         {showMedia ? (
//           <div>
//             <span
//               className="flex justify-end cursor-pointer mb-2"
//               onClick={() => {
//                 setShowMedia(false);
//                 setImagePreviewUrl("");
//               }}
//             >
//               <SlClose />
//             </span>
//             <label htmlFor="media">
//               <figure className="max-w-full mb-2">
//                 {imagePreviewUrl.includes("image") ? (
//                   <img
//                     className="max-h-[200px] max-w-full rounded-lg"
//                     src={imagePreviewUrl}
//                     alt="Image Preview"
//                   />
//                 ) : (
//                   <video
//                     className="max-h-[200px] max-w-full rounded-lg"
//                     src={imagePreviewUrl}
//                     controls
//                   />
//                 )}
//               </figure>
//               <div className="flex items-center gap-2">
//                 <textarea
//                   type="text"
//                   placeholder="(optional caption)"
//                   value={popUpChat.message}
//                   onChange={(e) =>
//                     setPopUpChat({ ...popUpChat, message: e.target.value })
//                   }
//                   className="w-[80%] input h-[2rem] resize-none leading-normal flex-grow input-bordered input-md"
//                   name=""
//                   id=""
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   className="btn h-[2rem] btn-accent text-white rounded-full px-4"
//                 >
//                   <BiSend />
//                 </button>
//               </div>
//             </label>
//           </div>
//         ) : null}

//         <label htmlFor="media">
//           <span className="btn h-[2rem] btn-accent text-white rounded-full px-4">
//             <BiPlus />
//           </span>
//           <input
//             type="file"
//             onChange={handleUploadMedia}
//             className="hidden"
//             name="media"
//             id="media"
//             multiple
//           />
//         </label>
//         <textarea
//           value={popUpChat.message}
//           onChange={(e) =>
//             setPopUpChat({ ...popUpChat, message: e.target.value })
//           }
//           className="input flex-grow input-bordered input-md w-[90%] "
//           type="text"
//           placeholder="Type your message..."
//           disabled={showMedia}
//         />
//         <button
//           disabled={!popUpChat.message}
//           type="submit"
//           className={`w-[10%] disabled:btn-accent btn btn-accent text-white`}
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };