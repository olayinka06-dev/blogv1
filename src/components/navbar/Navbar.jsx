import React from "react";
import Link from "next/link";
import SignOut from "@/components/formgroup/Buttons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function getProfile(session) {
  try {
    const response = await db.user.findFirst({
      where: {id: session?.user.id},
      include: {
        profile: true
      }
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const user = await getProfile(session);
  const profilePicture = user?.profile?.profilePicture;

  return (
    <header className="w-full p-4 z-[1000] sticky top-0 bg-white">
      <nav className="flex container items-center justify-between">
        <div className="">
          <Link href="/">LOGO</Link>
        </div>

        {session?.user.username ? (
          <div className="flex items-center gap-2">
            <img src={profilePicture || "/next.svg"} className="w-8 h-8 rounded-full" alt={profilePicture}/>
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


