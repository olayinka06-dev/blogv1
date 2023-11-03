// my-profile-picture message-unread friend-list

import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("t");

  //   if (!session) {
  //     return NextResponse.json(
  //       { message: "Unauthorized, you must be login to access the dashboard" },
  //       { status: 401 }
  //     );
  //   }

  if (type === "friend_list") {
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

      const friendRequestsData = acceptedFriendRequests.map((request) => ({
        requestId: request.id,
        senderId: request.senderId,
        accepted: request.accepted,
        recipientId: request.recipientId,
        senderUsername: request.sender.username,
        senderProfilePicture: request.sender.profile.profilePicture,
        createdAt: request.createdAt,
      }));

      if (friendRequestsData) {
        return NextResponse.json({ friendRequestsData }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Error loading friends" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error getting friends:", error);
      return NextResponse.json(
        { message: "Error loading friends please check your connection" },
        { status: 500 }
      );
    }
  } else if (type === "my_profile") {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    try {
      const profile = await db.user.findFirst({
        where: { id: userId },
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

      if (profile) {
        return NextResponse.json({ profile }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Error loading profile" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error getting profile:", error);
      return NextResponse.json(
        { message: "Error loading profile please check your connection" },
        { status: 500 }
      );
    }
  } else if (type === "notification") {
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

      if (unreadNotifications) {
        const unread = unreadNotifications.length;
        return NextResponse.json({ unread }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Error loading unread notification" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error getting unread notification:", error);
      return NextResponse.json(
        {
          message:
            "Error loading unread notification please check your connection",
        },
        { status: 500 }
      );
    }
  }
}
