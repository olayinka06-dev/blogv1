"use client"
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const {data: session} = useSession();
  return (
    <header className="w-full p-4">
      <nav className="flex container items-center justify-between">
        <div className="">
          <Link href="/">LOGO</Link>
        </div>
        <div className="">
          <h2>client session</h2>
          <pre>{JSON.stringify(session)}</pre>
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
