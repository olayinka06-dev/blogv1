import React from 'react';
import {Navbar} from "@/components/dashboard/navbar/Navbar"
import { db } from '@/lib/db';
import Sidebar from '../sidebar/Sidebar';



export const Appwrapper = ({children}) => {
  return (
    <section>
      {/* <Sidebar/> */}
      <div className="md:pl-[350px]">
        <div className="">
          {/* <Navbar receiver={getUserProfile}/> */}
        {children}
        </div>
      </div>
    </section>

  )
}
