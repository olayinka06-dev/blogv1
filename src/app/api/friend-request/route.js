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
          recipientId: recipientId,
          senderId,
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

  console.log("payload", payload);

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
      include: {
        sender: true, // Include the sender information
        recipient: true, // Include the recipient information
      },
    });

    if (!request) {
      return NextResponse.json(
        { message: "Friend request not found" },
        { status: 404 }
      );
    }

    // Check if the user is the recipient of the friend request
    if (request.recipientId !== session.user.id) {
      return NextResponse.json(
        {
          message:
            "Unauthorized! You can only respond to friend requests sent to you",
        },
        { status: 403 }
      );
    }

    //Mark the request as accepted or declined
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
          senderId: request.senderId,
          recipientId: request.recipientId,
        },
      });

      // Create a new friend request in the reverse direction to establish mutual friendship
      await db.friendRequest.create({
        data: {
          senderId: request.recipientId,
          recipientId: request.senderId,
          accepted: true,
        },
      });

      return NextResponse.json(
        { message: "Friend request Accepted successfully" },
        { status: 200 }
      );
    } else {
      await db.friendRequest.update({
        where: {
          id: requestId,
        },
        data: {
          accepted: false,
        },
      });

      return NextResponse.json(
        { message: "Friend request Declined successfully" },
        { status: 200 }
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

// Delete a Friend
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  // const payload = await request.json();
  // const { recipientId } = payload;
  const  recipientId  = "cloheocbz0001udkoweajwqlc";
  const senderId = session?.user?.id;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("t");

  // if (!session) {
  //   return NextResponse.json({
  //     message: "Unauthorized! Please log in to delete a friend",
  //   });
  // }

  if (type === "many") {
    try {
      // Check if the friend relationship exists
      const friendRelation = await db.friendRequest.findFirst({
        where: {
          OR: [
            {
              AND: [{ senderId }, { recipientId }],
            },
            {
              AND: [{ senderId }, { recipientId }],
            },
          ],
        },
      });

      if (!friendRelation) {
        return NextResponse.json(
          { message: "Friend relationship not found" },
          { status: 404 }
        );
      }

      // Delete the friend relationship from both sides
      await db.friendRequest.delete({
        where: {
          id: friendRelation.id,
        },
      });

      return NextResponse.json(
        { message: "Friend deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  } else if (type === "single") {
    try {
      // Check if the friend relationship exists
      const friendRelation = await db.friendRequest.findFirst({
        where: {
          AND: [{ senderId }, { recipientId }],
        },
      });

      if (!friendRelation) {
        return NextResponse.json(
          { message: "Friend relationship not found" },
          { status: 404 }
        );
      }

      // Delete the friend relationship
      await db.friendRequest.delete({
        where: {
          id: friendRelation.id,
        },
      });

      return NextResponse.json(
        { message: "Friend deleted successfully" },
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
}
