"use client";
import Image from "next/image";
import React from "react";
import { useChatContext } from "../provider/ChatProvider";
import Link from "next/link";
import { NetworkError } from "../../NetworkError";
import { FaPeopleArrows, FaUserFriends } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { MdFeedback } from "react-icons/md";
import { TbLogout } from "react-icons/tb";

export const Sidebar = ({ picture, unread }) => {
  const { chatData } = useChatContext();
  const { friendList} = chatData;

  console.log("client", picture);

  const sideBarData = [
    {
      menu: "friend requests",
      icon: <FaPeopleArrows />,
      link: "/friend-request",
    },
    {
      menu: "Notifications",
      icon: <IoIosNotifications />,
      link: "/notification",
    },
    {
      menu: "Suggestions",
      icon: <FaUserFriends />,
      link: "/users",
    },
    {
      menu: "Blog",
      icon: <MdFeedback />,
      link: "/blog",
    },
    // {
    //   menu: "",
    //   icon: </>
    // },
  ];

  return (
    <aside className="fixed  left-0 bg-white shadow hidden md:block bottom-0 w-[350px] px-3 border-l h-[90vh]">
      <div className="mt-10 flex  overflow-y-scroll">
        <div className="border-r shadow px-2 h-screen">
          <div className="flex flex-col gap-6 h-[80vh]">
            {sideBarData.map((data, index) => (
              <Link href={data.link} key={index} className="">
                <div className="tooltip tooltip-right" data-tip={data.menu}>
                  {data.menu === "Notifications" ? (
                    <div className="relative">
                      <span className="">{data.icon}</span>
                      <span className="absolute top-[-10px] badge left-[10px] z-[1000] bg-error">
                        {unread}
                      </span>
                    </div>
                  ) : (
                    <span className="">{data.icon}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="h-[20vh]">
            <div className="">
              <button>
                <span>
                  <TbLogout />
                </span>
              </button>
            </div>
            <div className="">
              <Image
                src={picture}
                className="w-auto h-auto bg-[red]"
                alt="profile"
                height={50}
                width={50}
                priority
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {friendList?.length === 0 ? (
            <div>
              <p>No friends yet please add up friend</p>
              <Link href={"/users"} className="btn btn-accent">
                Search
              </Link>
            </div>
          ) : friendList?.includes("Error") ? (
            <div>
              <NetworkError text={friendList} />
            </div>
          ) : (
            friendList?.map((friend) => (
              <Link
                href={`/dashboard/${friend?.recipientId}`}
                className="flex flex-row items-center border-b gap-2"
                key={friend?.requestId}
              >
                <div className="">
                  <Image
                    alt={friend?.senderProfilePicture}
                    className="rounded-full"
                    src={friend?.senderProfilePicture || "/next.svg"}
                    height={40}
                    width={40}
                  />
                </div>
                <div className="flex flex-col">
                  <span>{friend?.senderUsername}</span>
                  <span className="mt-[1px]">Hello when will come home</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
