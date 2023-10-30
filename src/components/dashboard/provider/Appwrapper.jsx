import React from 'react';
import {Navbar} from "@/components/dashboard/navbar/Navbar"
import { db } from '@/lib/db';

async function getUserProfile(userId) {
  try {
    const response = await db.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            profilePicture: true,
          },
        },
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const Appwrapper = ({children}) => {
  return (
    <section>
      <div className="md:pl-[350px]">
        <div className="">
          {/* <Navbar receiver={getUserProfile}/> */}
        {children}
        </div>
      </div>
    </section>

  )
}
