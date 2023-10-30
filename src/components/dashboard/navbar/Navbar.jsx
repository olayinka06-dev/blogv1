"use client";
import Image from "next/image";
import React from "react";
import { useChatContext } from "../provider/ChatProvider";

// async function getUserProfile(userId) {
//   try {
//     const response = await db.user.findFirst({
//       where: { id: userId },
//       select: {
//         id: true,
//         username: true,
//         profile: {
//           select: {
//             profilePicture: true,
//           },
//         },
//       },
//     });
//     return response;
//   } catch (error) {
//     console.error(error);
//   }
// }

export const Navbar =  ({receiver}) => {

  const {chatData} = useChatContext();
  const { receiver: userId } = chatData

  const profile =  receiver(userId);
  return (
    <nav className="shadow py-4 px-3">
      <div className="">
        <Image
          alt={profile?.profile?.profilePicture}
          src={profile?.profile?.profilePicture || "/next.svg"}
          height={40}
          width={40}
          priority
          className="w-auto h-auto"
        />
        <span>{profile?.username}</span>
      </div>
      {/* <div className=" overflow-x-scroll">
        <span>frequently chat</span>
        <div className="flex gap-2">
          {images.map((image, i) => (
            <div key={i} className="">
              <Image
                alt="logo"
                className="rounded-full"
                src={image}
                height={40}
                width={40}
              />
            </div>
          ))}
        </div>
      </div> */}
    </nav>
  );
};
