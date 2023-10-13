"use client"
import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="w-full p-4">
      <nav className="flex container items-center justify-between">
        <div className="">
          <Link href="/">LOGO</Link>
        </div>
        <div className="">
          <Link className="btn btn-accent text-white" href={"/create-post"}>
            Create Post
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
