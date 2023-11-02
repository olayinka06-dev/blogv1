import { db } from "../../../lib/db";

// Fetching and Marking Notifications as Read
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

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

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
