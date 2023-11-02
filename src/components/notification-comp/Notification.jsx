"use client";
import { Error, Success } from "@/lib/entities";
import Image from "next/image";
import React, { useState } from "react";
import { NetworkError } from "../NetworkError";

function NotificationComp({ notifications }) {
  const [loading, setLoading] = useState(null);

  return (
    <div>
      <div className="flex flex-col gap-3 mt-3">
        {notifications?.length === 0 ? (
          <p>No Notification found</p>
        ) : notifications?.includes("Error") ? (
          <NetworkError text={notifications} />
        ) : (
          notifications?.map((notification) => (
            <div className="">
              <div className="">
                {notification?.type === "friend_request" && (
                  <div className="p-5 flex flex-col gap-2 border rounded-xl">
                    <div className="flex flex-row gap-1 items-center">
                      <div className="">
                        <Image
                          src={
                            notification?.user?.profilePicture || "/next.svg"
                          }
                          alt={notification?.user?.profilePicture}
                          height={50}
                          width={50}
                          priority
                          className="w-auto h-auto object-contain rounded-full"
                        />
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <span>{notification?.user?.username}</span>
                        {/* <div>
                        {user?.profile?.userRole?.map((role) => (
                          <span key={role}>{role}</span>
                        ))}
                      </div> */}
                      </div>
                    </div>
                    <div className="">
                      <p>
                        @{notification?.user?.username} sent you a friend
                        request
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationComp;
