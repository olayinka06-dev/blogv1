"use client";
import Image from "next/image";
import React from "react";

const SideBar = ({ userList }) => {

  return (
    <div className="flex flex-col">
      <div className="">
        {userList.map((user) => (
          <div  key={user} className="flex flex-row items-center border-b gap-2">
            <div className="">
              <Image
                alt={user?.profile?.profilePicture || "/next.svg"}
                className="rounded-full w-auto h-auto"
                src={user?.profile?.profilePicture || "/next.svg"}
                height={40}
                width={40}
              />
            </div>
            <div className="flex flex-col">
              <span>{user?.username}</span>
              <span className="mt-[1px]">Hello when will come home</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
