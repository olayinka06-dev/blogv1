// pages/api/chat.js
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function POST(request) {
  const payload = await request.json();
  // Handle sending a message or replying to a message
  const { senderId, receiverId, content, parentMessageId } = payload;

  // Validate that the sender and receiver exist (you should add more validation logic)
  const sender = await db.user.findUnique({ where: { id: senderId } });
  const receiver = await db.user.findUnique({ where: { id: receiverId } });

  if (!sender || !receiver) {
    return NextResponse.json(
      { message: "Invalid sender or receiver" },
      { status: 400 }
    );
  }

  // Create the sender object with the necessary data
  const senderObj = { connect: { id: senderId } };

  try {
    const message = await db.chatMessage.create({
      //   data: {
      //     senderId: senderObj,
      //     receiverId,
      //     content,
      //     parentMessageId, // Set the parent message ID if replying
      //   },
      data: {
        content,
        parentMessage: { connect: { id: parentMessageId } }, // Set the parent message ID if replying
        sender: {
          connect: {
            id: senderId,
          },
        },
        receiver: {
          connect: {
            id: receiverId,
          },
        },
        user: {
          connect: {
            id: senderId,
          },
        },
      },
    });

    if (message) {
      return NextResponse.json({ message }, { status: 201 });
    } else {
      return NextResponse.json({ message: "error uploading" }, { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function GET(request) {
//   if (req.method === "GET") {
//     // Retrieve chat messages for a specific conversation
//     const { senderId, receiverId } = req.query;

//     const messages = await db.chatMessage.findMany({
//       where: {
//         OR: [
//           { senderId, receiverId },
//           { senderId: receiverId, receiverId: senderId },
//         ],
//       },
//       include: {
//         sender: true,
//         receiver: true,
//         replies: {
//           include: {
//             sender: true,
//             receiver: true,
//           },
//         },
//       },
//     });

//     res.status(200).json(messages);
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
