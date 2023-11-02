import React from "react";
import ChatWrapper from "@/components/dashboard/chat/ChatWrapper";
import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

async function getAllChatComment(friendId, userId) {
  try {
    // const messages = await db.chatMessage.findMany({
    //   where: {
    //     OR: [
    //       { userId, chatRoom: { members: { some: { id: friendId } } } },
    //       { userId: friendId, chatRoom: { members: { some: { id: userId } } }},
    //     ],
    //   },
    // });

    const chatRoom = await db.chatRoom.findFirst({
      where: {
        AND: [
          { members: { some: { id: userId } } },
          { members: { some: { id: friendId } } },
        ],
      },
    });

    if (!chatRoom) {
      // Handle the case where a chat room between the user and the selected friend doesn't exist.
      return "Chat room not found.";
    }

    const messages = await db.chatMessage.findMany({
      where: {
        chatRoomId: chatRoom.id, // Use the chat room ID to filter messages
      },
    });
    return messages;
  } catch (error) {
    console.error(error);
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

const Chat = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const friendId = params?.id;
  const allChat = await getAllChatComment(friendId, userId);
  const friendList = await getMyFriends(userId);
  const profile = await getUserProfile(friendId);
  const userProfile = await getMyProfile(userId);

  console.log("profilePicture", userProfile);
  console.log(params.id);
  return (
    <section>
      <ChatWrapper
        chatComments={allChat}
        friendId={friendId}
        friendList={friendList}
        profilePicture={userProfile}
      />
    </section>
  );
};

export default Chat;
