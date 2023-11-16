"use client";
import Image from "next/image";
import React from "react";
import { useChatContext } from "../provider/ChatProvider";
import Link from "next/link";
import { LuForward } from "react-icons/lu";
import { BsArrowLeft } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdCall } from "react-icons/md";
import { Error, Success } from "../../../lib/entities";

export const Navbar = () => {
  const { chatData } = useChatContext();
  const {
    receipant_info,
    showCheckBox,
    setShowCheckBox,
    selectedMessages,
    chatComments: messages,
    setSelectedMessages,
  } = chatData;

  const handleCopySelected = () => {
    const selectedMessageContent = messages
      ?.filter((message) => selectedMessages.includes(message.id))
      ?.map((message) => message.content)
      ?.join("\n");

    // Copy selected message content to clipboard
    navigator.clipboard
      .writeText(selectedMessageContent)
      .then(() => {
        Success("Successfully copied to clipboard!"),
          console.log("Text copied to clipboard:", selectedMessageContent),
          setShowCheckBox(false),
          setSelectedMessages([""]);
      })
      .catch((error) => {
        console.error("Clipboard Copy Error:", error),
          Error("Error copying to clipboard");
      });
  };

  return (
    <nav className="shadow py-4 flex bg-[rgba(255,255,255,0.9)] backdrop:blur-sm z-[500] sticky top-0  justify-between items-center px-3">
      <div className="flex items-center  gap-1">
        <div className="">
          <Link href={"/dashboard"}>
            <BsArrowLeft />
          </Link>
        </div>
        <div className="">
          <Image
            src={receipant_info?.profile?.profilePicture || "/placeholder.jpg"}
            className="w-10 h-10 rounded-full"
            alt="profile"
            height={20}
            width={20}
            priority
          />
        </div>
        <div className="flex flex-col gap-[1px]">
          <span>{receipant_info?.username}</span>
          <span></span>
        </div>
      </div>
      <div className="">
        {showCheckBox ? (
          <div className="flex items-center gap-2">
            <span onClick={handleCopySelected} className="cursor-pointer p-2">
              <MdOutlineContentCopy />
            </span>
            <span className="cursor-pointer p-2">
              <LuForward />
            </span>
            <span className="cursor-pointer p-2">
              <RiDeleteBin6Line />
            </span>
            <button onClick={() => {setShowCheckBox(false),setSelectedMessages([""]);}} className="btn">
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>
              <BiSearch />
            </span>
            <span>
              <MdCall />
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};
