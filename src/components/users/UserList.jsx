// UserList.js
import { Error, Success } from "@/lib/entities";
import Image from "next/image";
import React, {useState} from "react";

function UserList({ users }) {
  const [loading, setLoading] = useState(null);
  const handleSendFriendRequest = async (recipientId) => {
    setLoading(recipientId)
    try {
      const BASE_URL = "/api/friend-request";

      const resp = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipientId }),
      });

      const result = await resp.json();
      const { message } = result;

      if (resp.ok) {
        setLoading(null)
        Success(message);
      } else {
        setLoading(null)
        Error(message);
      }
    } catch (error) {
      setLoading(null)
      console.log(error);
      Error(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 mt-3">
        {users?.map((user) => (
          <div
            key={user.id}
            className="p-5 flex flex-col gap-2 border rounded-xl"
          >
            <div className="flex flex-row gap-1 items-center">
              <div className="">
                <Image
                  src={user?.profile?.profilePicture}
                  alt={user?.profile?.profilePicture}
                  height={50}
                  width={50}
                  priority
                  className="w-auto h-auto object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col gap-[2px]">
                <span>{user?.username}</span>
                <div>
                  {user?.profile?.userRole?.map((role) => (
                    <span key={role}>{role}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className=" flex items-center gap-2 w-2/3">
              <button
                onClick={() => handleSendFriendRequest(user.id)}
                className="btn w-1/2 btn-accent text-white"
              >
                <div>
                  {loading === user?.id && (
                    <span className="loading absolute ml-6 bottom-[12px] loading-spinner loading-md">
                      Adding Up...
                    </span>
                  )}
                  <span className="">
                    {loading === user?.id ? "Adding Up..." : "Add"}
                  </span>
                </div>
              </button>
              <button className="btn w-1/2 btn-error text-white">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
