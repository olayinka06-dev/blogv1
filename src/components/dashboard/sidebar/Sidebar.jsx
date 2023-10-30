import Image from "next/image";
import React from "react";
import { useChatContext } from "../provider/ChatProvider";

export const Sidebar = ({handleSelect}) => {
  const { chatData } = useChatContext();
  const { friendList } = chatData;
  return (
    <aside className="fixed  left-0 bg-white shadow hidden md:block bottom-0 w-[350px] px-3 border-l h-[90vh]">
      <div className="mt-10 overflow-y-scroll">
        <div className="flex flex-col gap-5">
          {friendList.map((friend) => (
            <div onClick={()=>handleSelect(friend?.id)} className="flex flex-row items-center border-b gap-2">
              <div className="">
                <Image
                  alt={friend?.profile?.profilePicture || "/next.svg"}
                  className="rounded-full"
                  src={friend?.profile?.profilePicture || "/next.svg"}
                  height={40}
                  width={40}
                />
              </div>
              <div className="flex flex-col">
                <span>{friend?.username}</span>
                <span className="mt-[1px]">Hello when will come home</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
