import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { db } from "../../lib/db";
import React from "react";
import Navbar from "./Navbar";

async function getProfile(session) {
  try {
    const response = await db.user.findFirst({
      where: { id: session?.user.id },
      include: {
        profile: true,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

const NavWrapper = async () => {
  const session = await getServerSession(authOptions);

  const user = await getProfile(session);
  const profilePicture = user?.profile?.profilePicture;
  return <Navbar session={session} profilePicture={profilePicture} />;
};

export default NavWrapper;
