
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
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

  return (
    <section>
      <Sidebar friends={friends} notification={notification} photo={profile?.profile?.profilePicture}/>
      <div className="">
        <h2>Welcome to your dashboard {profile?.username}</h2>
      </div>
    </section>
  );
};

export default Chat;
