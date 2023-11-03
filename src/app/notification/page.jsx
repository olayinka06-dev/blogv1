import React from "react";
import { db } from "../../lib/db";
import { authOptions } from "../../lib/auth";
import { getServerSession } from "next-auth";
import NotificationComp from "../../components/notification-comp/Notification";

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
        recipient: {
          select: {
            username: true,
            profile: {
              select: {
                profilePicture: true,
              },
            },
          },
        },
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

    // Map the notifications to include sender details
    const notificationsWithSenderDetails = notifications.map(
      (notification) => ({
        id: notification.id,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        recipient: {
          username: notification.recipient.username,
          profilePicture: notification.recipient.profile.profilePicture,
        },
        sender: {
          username: notification.sender.username,
          profilePicture: notification.sender.profile.profilePicture,
        },
      })
    );

    // Mark the fetched notifications as read
    const unreadNotifications = notifications.filter(
      (notification) => !notification.isRead
    );
    if (unreadNotifications.length > 0) {
      const notificationIds = unreadNotifications.map(
        (notification) => notification.id
      );

      await db.notification.updateMany({
        where: {
          id: { in: notificationIds },
        },
        data: {
          isRead: true,
        },
      });
    }

    return notificationsWithSenderDetails;
  } catch (error) {
    console.error(error);
    return "Error loading Notifications";
  }
}

const NotificationPage = async () => {
  const notifications = await getNotifications();
  console.log("notifications", notifications);
  return (
    <section className="container">
      <div className="container md:w-[70%] mx-auto p-4">
        <NotificationComp notifications={notifications} />
      </div>
    </section>
  );
};

export default NotificationPage;
