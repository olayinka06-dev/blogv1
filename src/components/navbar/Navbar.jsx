"use client";
import React from "react";
import Link from "next/link";
import SignOut from "@/components/formgroup/Buttons";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BiPlus } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { BsFillChatDotsFill, BsPeopleFill } from "react-icons/bs";
import { IoMdNotifications } from "react-icons/io";
import { MdFeedback } from "react-icons/md";

const Navbar = ({ session, profilePicture }) => {
  const pathname = usePathname();

  const navBarData = [
    {
      menu: "Home",
      icon: <AiFillHome />,
      link: "/",
    },
    {
      menu: "Notifications",
      icon: <IoMdNotifications />,
      link: "/notification",
    },
    {
      menu: "Messaging",
      icon: <BsFillChatDotsFill />,
      link: "/dashboard",
    },
    {
      menu: "Suggestions",
      icon: <BsPeopleFill />,
      link: "/users",
    },
    {
      menu: "Blog",
      icon: <MdFeedback />,
      link: "/friend-request",
    },
    // {
    //   menu: "",
    //   icon: </>
    // },
  ];

  return pathname.includes("dashboard") ? null : (
    <header className="w-full p-4 z-[1000] shadow sticky top-0 bg-white">
      <nav className="flex  container items-center justify-between">
        <div className="w-1/2 flex justify-between">
          <div className="">
            <a className="btn btn-ghost normal-case text-xl">LOGO</a>
          </div>
          <div className="flex ml-24 w-full items-center gap-2 justify-between">
            {navBarData.map((data, index) => (
              <Link
                href={data.link}
                key={index}
                className={`capitalize transition-all badge h-[2.1rem] badge-ghost p-2 rounded-full text-[20px] hover:text-black ${
                  pathname === data.link
                    ? "relative after:absolute after:top-[180%] md:after:bottom-[-100%] after:bg-accent duration-300 after:transition-transform after:h-1 md:after:w-[160%] after:w-[90px] after:left-[-10px] after:scale-x-[1]"
                    : "text-opacity-50 text-black"
                }`}
              >
                <div
                  className="tooltip tooltip-accent tooltip-top"
                  data-tip={data.menu}
                >
                  {data.menu === "Notifications" ? (
                    <div className="relative indicator">
                      <span className="">{data.icon}</span>
                      <span className="badge badge-xs py-2 badge-error text-white indicator-item">
                        1
                      </span>
                    </div>
                  ) : (
                    <span className="">{data.icon}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {session?.user.username ? (
            <div className="flex items-center gap-2">
              <Link
                className="btn btn-accent h-[2.5rem] min-h-[2.5rem] text-white"
                href={"/create-post"}
              >
                <span>
                  <BiPlus />
                </span>
                Create Post
              </Link>
              <div className="form-control">
                <input
                  type="search"
                  placeholder="Search"
                  className="input h-[2.5rem] min-h-[2.5rem] input-bordered w-24 md:w-auto"
                />
              </div>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={profilePicture || "/placeholder.jpg"}
                      alt={profilePicture}
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li>
                  <li
                    onClick={() =>
                      signOut({
                        redirect: true,
                        callbackUrl: `${window.location.origin}/sign-in`,
                      })
                    }
                  >
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                className="btn h-[2.5rem] min-h-[2.5rem] btn-accent text-white"
                href={"/register"}
              >
                Register
              </Link>
              <Link
                className="btn h-[2.5rem] min-h-[2.5rem] btn-accent text-white"
                href={"/sign-in"}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
