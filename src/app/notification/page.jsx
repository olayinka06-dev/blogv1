import React from 'react'
import { db } from '../../lib/db';
import { authOptions } from "../../lib/auth";
import { getServerSession } from "next-auth";

async function getNotifications() {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    // Fetching and Marking Notifications as Read
    try {
      const notifications = await db.notification.findMany({
        where: {
          userId,
          isRead: false, // Fetch only unread notifications
        },
      });
  
      // Mark the fetched notifications as read
      await db.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
  
      return notifications;
    } catch (error) {
      console.error(error);
      return "Error loading Notifications";
    }
}

const NotificationPage = async () => {
    const notifications = await getNotifications();
    console.log(notifications);
  return (
    <div>NotificationPage</div>
  )
}

export default NotificationPage