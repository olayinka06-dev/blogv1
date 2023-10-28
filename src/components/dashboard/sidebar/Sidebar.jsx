import Image from "next/image";
import React from "react";

export const Sidebar = () => {
  return (
    <aside className="fixed  left-0 bg-white shadow hidden md:block bottom-0 w-[350px] px-3 border-l h-[90vh]">
      <div className="mt-10 overflow-y-scroll">
        <div className="flex flex-col gap-5">
          <div className="flex flex-row items-center border-b gap-2">
            <div className="">
              <Image
                alt="logo"
                className="rounded-full"
                src={"/my-profile.jpeg"}
                height={40}
                width={40}
              />
            </div>
            <div className="flex flex-col">
              <span>Olayinka</span>
              <span className="mt-[1px]">Hello when will come home</span>
            </div>
          </div>
          <div className="flex flex-row border-b items-center gap-2">
            <div className="">
              <Image
                alt="logo"
                className="rounded-full"
                src={"/my-profile.jpeg"}
                height={40}
                width={40}
              />
            </div>
            <div className="flex flex-col">
              <span>Olayinka</span>
              <span className="mt-[1px]">Hello when will come home</span>
            </div>
          </div>
          <div className="flex flex-row border-b items-center gap-2">
            <div className="">
              <Image
                alt="logo"
                className="rounded-full"
                src={"/my-profile.jpeg"}
                height={40}
                width={40}
              />
            </div>
            <div className="flex flex-col">
              <span>Olayinka</span>
              <span className="mt-[1px]">Hello when will come home</span>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
};
