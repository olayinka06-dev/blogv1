import Image from "next/image";
import React from "react";
import { useChatContext } from "../provider/ChatProvider";
import Link from "next/link";
import { NetworkError } from "../../NetworkError";

export const Sidebar = () => {
  const { chatData } = useChatContext();
  const { friendList } = chatData;
  return (
    <aside className="fixed  left-0 bg-white shadow hidden md:block bottom-0 w-[350px] px-3 border-l h-[90vh]">
      <div className="mt-10 overflow-y-scroll">
        <div className="flex flex-col gap-5">
          {friendList?.length === 0 ? (
            <div>
              <p>No friends yet please add up friend</p>
              <Link href={"/users"} className="btn btn-accent">
                Search
              </Link>
            </div>
          ) : friendList.includes("Error") ? (
            <div>
              <NetworkError text={friendList}/>
              </div>
          ) : (
            friendList?.map((friend) => (
              <Link
                href={`/dashboard/${friend?.recipientId}`}
                className="flex flex-row items-center border-b gap-2"
                key={friend?.requestId}
              >
                <div className="">
                  <Image
                    alt={friend?.senderProfilePicture}
                    className="rounded-full"
                    src={friend?.senderProfilePicture || "/next.svg"}
                    height={40}
                    width={40}
                  />
                </div>
                <div className="flex flex-col">
                  <span>{friend?.senderUsername}</span>
                  <span className="mt-[1px]">Hello when will come home</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
