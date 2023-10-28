import React from 'react';
import {Sidebar} from "@/components/dashboard/sidebar/Sidebar";
import {Navbar} from "@/components/dashboard/navbar/Navbar"

export const Appwrapper = ({children}) => {
  return (
    <section>
      <div className="md:pl-[350px]">
        <Sidebar/>
        <div className="">
          <Navbar/>
        {children}
        </div>
      </div>
    </section>

  )
}
