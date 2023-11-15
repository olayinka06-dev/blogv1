"use client";
import Image from "next/image";
import React from "react";
import { useChatContext } from "../provider/ChatProvider";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { MdCall } from "react-icons/md";

export const Navbar = () => {
  const { chatData } = useChatContext();
  const { receipant_info } = chatData;

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
      <div className="flex items-center gap-2">
        <span><BiSearch/></span>
        <span><MdCall/></span>
      </div>
    </nav>
  );
};
