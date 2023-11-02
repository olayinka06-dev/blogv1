import React from "react";
import FriendRequests from "../../components/friend-request/FriendRequest";
import { db } from "../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getFriendsRequests(userId) {
  try {
    const friendRequests = await db.friendRequest.findMany({
      where: {
        recipientId: userId,
        accepted: false, // Fetch only pending friend requests
      },
      include: {
        sender: {
          select: {
            username: true,
            profile: {
              select: {
                profilePicture: true,
                userRole: true,
              },
            },
          },
        },
      },
    });

    const formattedFriendRequests = friendRequests.map((request) => ({
      requestId: request.id,
      senderId: request.senderId,
      accepted: request.accepted,
      recipientId: request.recipientId,
      senderUsername: request.sender.username,
      senderProfilePicture: request.sender.profile.profilePicture,
      senderRole: request.sender.profile.userRole,
      createdAt: request.createdAt,
    }));


    if (formattedFriendRequests) {
      return formattedFriendRequests;
    } else {
      return "Error loading friend request";
    }
  } catch (error) {
    console.error(error);
    return "Internal server Error";
  }
}

const FriendRequest = async () => {
  const session = await getServerSession(authOptions);
  const friendRequests = await getFriendsRequests(session?.user?.id);
  return (
    <section className='container'>
      <div className="container md:w-[70%] mx-auto p-4">
      <FriendRequests users={friendRequests}/>
      </div>
    </section>
  );
};

export default FriendRequest;
