// UserList.js
import Image from "next/image";
import React from "react";

function UserList({ users }) {
  return (
    <div>
      <div>
        {users?.map((user) => (
          <div key={user.id}>
            <div className="flex flex-row items-center">
              <div className="">
                <Image
                  src={user?.profile?.profilePicture}
                  alt={user?.profile?.profilePicture}
                  height={50}
                  width={50}
                  priority
                />
              </div>
              <div className="flex flex-col gap-2">
                <span>{user?.username}</span>
                <div>
                  {user?.profile?.userRole?.map((role) => (
                    <span key={role}>{role}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="">
              <button className="btn w-full">ADD</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
