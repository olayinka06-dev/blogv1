"use client";
import Image from "next/image";
import React, { useState } from "react";
import { NetworkError } from "../NetworkError";
import { Error, Success } from "@/lib/entities";

const FriendRequests = ({ users }) => {
  const [loading, setLoading] = useState(null);

  // Send a request to your server to accept the friend request
  const acceptFriendRequest = async (requestId) => {
    setLoading(requestId);
    try {
      const BASE_URL = "/api/friend-request";
      const resp = await fetch(BASE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, accepted: true }),
      });

      const result = await resp.json();

      const { message } = result;

      if (resp.ok) {
        setLoading(null);
        Success(message);
      } else {
        setLoading(null);
        Error(message);
      }
    } catch (error) {
      setLoading(null);
      console.error(error);
      Error(error);
    }
  };

  // Send a request to your server to decline the friend request
  const declineFriendRequest = async (requestId) => {
    setLoading(requestId);
    try {
      const BASE_URL = "/api/friend-request";
      const resp = await fetch(BASE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, accepted: false }),
      });

      const result = await resp.json();

      const { message } = result;

      if (resp.ok) {
        setLoading(null);
        Success(message);
      } else {
        setLoading(null);
        Error(message);
      }
    } catch (error) {
      setLoading(null);
      console.error(error);
      Error(error);
    }
  };

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
                  onClick={() => acceptFriendRequest(user.requestId)}
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
                <button
                  onClick={() => declineFriendRequest(user.requestId)}
                  className="btn w-1/2 btn-error text-white"
                >
                  <div>
                    {loading === user?.id && (
                      <span className="loading absolute ml-6 bottom-[12px] loading-spinner loading-md">
                        Decling...
                      </span>
                    )}
                    <span className="">
                      {loading === user?.id ? "Decling..." : "Decline"}
                    </span>
                  </div>
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
