
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
// import React, {useEffect, useState} from "react";
import React from 'react'

async function getMyProfile() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  try {
    const profile = await db.user.findFirst({
      where: {id: userId},
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            profilePicture: true
          }
        }
      }
    });

    return profile
  } catch (error) {
    console.error(error);
  }
}

async function getNotifications() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  // Fetching and Marking Notifications as Read
  try {
    const notifications = await db.notification.findMany({
      where: {
        OR: [
          { recipientId: userId }, // Notifications received by the user
          { senderId: userId }, // Notifications sent by the user
        ],
      },
      include: {
        recipient: true,
        sender: true,
      },
    });

    const unreadNotifications = notifications.filter(
      (notification) => !notification.isRead
    );

    return unreadNotifications.length
  } catch (error) {
    console.error(error);
  }
}

async function getMyFriends() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  try {
    const acceptedFriendRequests = await db.friendRequest.findMany({
      where: {
        recipientId: userId,
        accepted: true, // Fetch only accepted friend requests
      },
      include: {
        sender: {
          select: {
            username: true,
            profile: {
              select: {
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    const friendRequestsData  = acceptedFriendRequests.map((request) => ({
      requestId: request.id,
      senderId: request.senderId,
      accepted: request.accepted,
      recipientId: request.recipientId,
      senderUsername: request.sender.username,
      senderProfilePicture: request.sender.profile.profilePicture,
      createdAt: request.createdAt,
    }));

    if (friendRequestsData) {
      return friendRequestsData;
    } else {
      return "Error loading friends";
    }

  } catch (error) {
    console.error("Error getting friends:", error);
    return "Error loading friends please check your connection";
  }
}

const Chat = async ()=> {
  const profile = await getMyProfile();
  const notification = await getNotifications();
  const friends = await getMyFriends();

  // const [friendList, setFriendList] = useState("");
  // useEffect(() => {
  //   const getListOfFriends = async () => {
  //     try {
  //       const resp = await fetch("/api/friend-list?t=friend_list", {
  //         method: "GET"
  //       });

  //       const data = await resp.json();
  //       const friends = data?.friendRequestsData;

  //       if (resp.ok) {
  //         console.log("data", friends);
  //       }
  //       else{
  //         console.log("something went wrong")
  //       }
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   }
  //   const getUserProfile = async () => {
  //     try {
  //       const resp = await fetch("/api/friend-list?t=my_profile", {
  //         method: "GET"
  //       });

  //       const data = await resp.json();
  //       const profile = data?.profile;

  //       if (resp.ok) {
  //         console.log("data", profile);
  //       }
  //       else{
  //         console.log("something went wrong")
  //       }
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   }
  //   const getNotification = async () => {
  //     try {
  //       const resp = await fetch("/api/friend-list?t=notification", {
  //         method: "GET"
  //       });

  //       const data = await resp.json();
  //       const unread = data?.unread;

  //       if (resp.ok) {
  //         console.log("data", unread);
  //       }
  //       else{
  //         console.log("something went wrong")
  //       }
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   }
  //   getUserProfile()
  //   getListOfFriends()
  //   getNotification()
  // }, []);
  // const handleClick = (i)=> {
  //   console.log(i)
  // }
  return (
    <section>
      <Sidebar friends={friends} notification={notification} photo={profile?.profile?.profilePicture}/>
    </section>
  );
};

export default Chat;
