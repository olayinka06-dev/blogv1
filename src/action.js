"use server";

import { getServerSession } from "next-auth";
import { db } from "./lib/db";
import { authOptions } from "./lib/auth";

export async function postData(formData) {
  "use server";

  const Pusher = require("pusher");

  const session = await getServerSession(authOptions);
  const senderId = session?.user?.id;
  const content = formData.get("content");
  const media = formData.get("media");
  const recipientId = formData.get("receiver");
  const messageId = formData.get("messageId");

  console.log({ content, media, recipientId });

  try {
    if (messageId) {
      // Handle message editing
      
      await db.message.update({
        where: { id: messageId },
        data: { content: content },
      });
    } else if (formData.has("deleteMessageId")) {
      // Handle message deletion
      const deleteMessageId = formData.get("deleteMessageId");
      await db.message.update({
        where: { id: deleteMessageId },
        data: { deleted: true },
      });
    } else {
      const chatMessages = await db.message.create({
        data: {
          senderId,
          recipientId,
          content,
          media,
        },
      });

      const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.NEXT_PUBLIC_PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: "mt1",
        useTLS: true,
      });

      await pusher.trigger("chat", "hello", {
        message: `${JSON.stringify(chatMessages)}\n\n`,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
