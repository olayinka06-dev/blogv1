import React from "react";
import ChatWrapper from "@/components/dashboard/chat/ChatWrapper";
import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

async function getConversation(recipientId, senderId) {

  // console.log("recepent", recipientId);
  // console.log("sender", senderId)

  
    try {
      const messages = await db.message.findMany({
        where: {
          OR: [
            {
              senderId,
              recipientId,
            },
            {
              senderId: recipientId,
              recipientId: senderId,
            },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          sender: {
            select: {
              id: true,
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
    
      return messages;
    } catch (error) {
      console.log(error);
    }
}

async function getMyFriends(userId) {
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

async function getUserProfile(friendId) {
  try {
    const response = await db.user.findFirst({
      where: { id: friendId },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            profilePicture: true,
          },
        },
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function getMyProfile(userId) {
  try {
    const profile = await db.user.findUnique({
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

const Chat = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const friendId = params?.id;
  const allChat = await getConversation(friendId, userId);
  const friendList = await getMyFriends(userId);
  const profile = await getUserProfile(friendId);
  const userProfile = await getMyProfile(userId);
  const unread = await getNotifications();

  return (
    <section>
      <ChatWrapper
        chatComments={allChat}
        friendId={friendId}
        friendList={friendList}
        profilePicture={userProfile?.profile?.profilePicture}
        unread={unread}
        receipant_info={profile}
        session={session}
      />
    </section>
  );
};

export default Chat;
