// pages/api/chat.js
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { authOptions } from "../../../lib/auth";
import { getServerSession } from "next-auth";

// POST /api/send-message
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const senderId = session?.user?.id;
  const payload = await request.json();

  const { receiver: recipientId, message: content, media } = payload;
  console.log(payload);

  if (!session) {
    return NextResponse.json({
      message: "Unauthorized!, please login to engage in a conversation",
    }, { status: 401 });
  }

  try {
    const chatMessages = await db.message.create({
      data: {
        senderId,
        recipientId,
        content,
        media,
      },
    });

    console.log("message", chatMessages);

    if (chatMessages) {
      return NextResponse.json(
        {
          message: "sent successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "unable to send message",
        },
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
// GET /api/messages/:senderId/:recipientId
// app.get("/api/messages/:senderId/:recipientId", async (req, res) => {
//   const senderId = parseInt(req.params.senderId);
//   const recipientId = parseInt(req.params.recipientId);

//   const messages = await prisma.message.findMany({
//     where: {
//       OR: [
//         {
//           senderId,
//           recipientId,
//         },
//         {
//           senderId: recipientId,
//           recipientId: senderId,
//         },
//       ],
//     },
//     orderBy: {
//       createdAt: "asc",
//     },
//   });

//   res.status(200).json(messages);
// });

// // PUT /api/mark-messages-as-read
// app.put("/api/mark-messages-as-read", async (req, res) => {
//   const { senderId, recipientId } = req.body;

//   await prisma.message.updateMany({
//     where: {
//       senderId: recipientId,
//       recipientId: senderId,
//       isRead: false,
//     },
//     data: {
//       isRead: true,
//     },
//   });

//   res.status(200).json({ success: "Messages marked as read" });
// });

// Start your Express app
