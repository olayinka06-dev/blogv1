"use client";
import Image from "next/image";
import React, { useState } from "react";
import { NetworkError } from "../NetworkError";

const FriendRequests = ({ users }) => {
  const [loading, setLoading] = useState(null);
  return (
    <div>
      <div className="flex flex-col gap-3 mt-3">
        {users?.length === 0 ? (
          <p>No friend Request found</p>
        ) : users.includes("Error") ? (
          <NetworkError text={users} />
        ) : (
          users?.map((user) => (
            <div
              key={user.requestId}
              className="p-5 flex flex-col gap-2 border rounded-xl"
            >
              <div className="flex flex-row gap-1 items-center">
                <div className="">
                  <Image
                    src={user?.senderProfilePicture}
                    alt={user?.senderProfilePicture}
                    height={50}
                    width={50}
                    priority
                    className="w-auto h-auto object-contain rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span>{user?.senderUsername}</span>
                  <div>
                    {user?.senderRole?.map((role) => (
                      <span key={role}>{role}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className=" flex items-center gap-2 w-2/3">
                <button
                  onClick={() => handleSendFriendRequest(user.requestId)}
                  className="btn w-1/2 btn-accent text-white"
                >
                  <div>
                    {loading === user?.id && (
                      <span className="loading absolute ml-6 bottom-[12px] loading-spinner loading-md">
                        Accepting...
                      </span>
                    )}
                    <span className="">
                      {loading === user?.id ? "Accepting..." : "Accept"}
                    </span>
                  </div>
                </button>
                <button className="btn w-1/2 btn-error text-white">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
