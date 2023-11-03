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
import { usePathname } from "next/navigation";

export const Sidebar = ({ picture, unread, friends, photo, notification }) => {
  const pathname = usePathname();
  const { chatData } = useChatContext();
  const { friendList} = chatData;

  // console.log("client", picture);

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
    <aside className="fixed border-r left-0 bg-white shadow hidden md:block bottom-0 w-full max-w-[330px] px-3 border-l h-[100vh]">
      <div className=" flex w-full overflow-y-scroll">
        <div className=" shadow px-2 ">
          <div className="flex flex-col gap-6 h-[80vh]">
            {sideBarData.map((data, index) => (
              <Link href={data.link} key={index} className="">
                <div className="tooltip tooltip-right" data-tip={data.menu}>
                  {data.menu === "Notifications" ? (
                    <div className="relative">
                      <span className="">{data.icon}</span>
                      <span className="absolute top-[-10px] badge text-white text-sm left-[10px] z-[1000] bg-error">
                        {(pathname === "/dashboard" ? notification : unread)}
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
                src={(pathname === "/dashboard" ? photo : picture)}
                className="w-8 h-8 rounded-full"
                alt="profile"
                height={20}
                width={20}
                priority
              />
            </div>
          </div>
        </div>
        <div className="flex px-3 flex-col gap-5">
          <div className="py-3 flex flex-col gap-1">
            <div className="">
              <h2>Chats</h2>
            </div>
            <div className="">
              <input type="search" className="w-full input input-bordered input-sm" placeholder="Search or Start a new Chat" name="" id="" />
            </div>
          </div>
          {(pathname === "/dashboard" ? friends : friendList)?.length === 0 ? (
            <div>
              <p>No friends yet please add up friend</p>
              <Link href={"/users"} className="btn btn-accent">
                Search
              </Link>
            </div>
          ) : (pathname === "/dashboard" ? friends : friendList)?.includes("Error") ? (
            <div>
              <NetworkError text={(pathname === "/dashboard" ? friends : friendList)} />
            </div>
          ) : (
            (pathname === "/dashboard" ? friends : friendList)?.map((friend) => (
              <Link
                href={`/dashboard/${friend?.senderId}`}
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
                  <span className="mt-[1px] text-sm">Hello when will come home</span>
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
