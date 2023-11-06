"use client";
import React from "react";
import Link from "next/link";
import SignOut from "@/components/formgroup/Buttons";
import { usePathname } from "next/navigation";

const Navbar = ({ session, profilePicture }) => {
  const pathname = usePathname();

  return pathname.includes("dashboard") ? null : (
    <header className="w-full p-4 z-[1000] shadow sticky top-0 bg-white">
      <nav className="flex container items-center justify-between">
        <div className="">
          <Link href="/">LOGO</Link>
        </div>

        {session?.user.username ? (
          <div className="flex items-center gap-2">
            <img
              src={profilePicture || "/placeholder.jpg"}
              className="w-8 h-8 rounded-full"
              alt={profilePicture}
            />
            <Link className="btn btn-accent text-white" href={"/create-post"}>
              Create Post
            </Link>
            <SignOut />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link className="btn btn-accent text-white" href={"/register"}>
              Register
            </Link>
            <Link className="btn btn-accent text-white" href={"/sign-in"}>
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
