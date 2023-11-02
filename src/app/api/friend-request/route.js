import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

// Sending a Friend Request
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const payload = await request.json();
  const { recipientId } = payload;
  const senderId = session?.user?.id;

  if (!session) {
    return NextResponse.json({
      message: "Unauthorized!, please login to Send a friend request",
    });
  }

  try {
    // Check if the friend request already exists
    const existingRequest = await db.friendRequest.findFirst({
      where: {
        senderId,
        recipientId,
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: "Friend request already sent" },
        { status: 400 }
      );
    }

    const createFriendRequest = await db.friendRequest.create({
      data: {
        senderId,
        recipientId,
      },
    });

    if (createFriendRequest) {
      // Create a notification for the recipient
      await db.notification.create({
        data: {
          type: "friend_request",
          userId: recipientId,
        },
      });

      return NextResponse.json(
        { message: "Friend request sent successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Unable to send friend request" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fetching Friend Requests
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "User id is missing" },
      { status: 400 }
    );
  }

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
      return NextResponse.json(
        { formattedFriendRequests, message: "sucess" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Error loading friend request" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Accepting/Declining a Friend Request
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  const payload = await request.json();
  const { requestId, accepted } = payload;

  if (!session) {
    return NextResponse.json({
      message: "Unauthorized!, please login to Accept/Decline a Friend Request",
    });
  }

  try {
    const request = await db.friendRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 }
      );
    }

    // Mark the request as accepted or declined
    if (accepted) {
      await db.friendRequest.update({
        where: {
          id: requestId,
        },
        data: {
          accepted: true,
        },
      });

      // Create a notification for the sender
      await db.notification.create({
        data: {
          type: "friend_request_accepted",
          userId: request.senderId,
        },
      });
    } else {
      await db.friendRequest.delete({
        where: {
          id: requestId,
        },
      });
    }

    return NextResponse.json(
      { message: "Friend request handled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
