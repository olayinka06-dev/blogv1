import React from "react";
import ChatComp from "./ChatComp";
import SideBar from "./SideBar";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// const handleGetReceiverId = (receiverId) => {
//   return receiverId
// }

async function getAllUsers() {
  try {
    const response = await db.user.findMany({
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

async function getChatMessages() {
  const session = await getServerSession(authOptions);
  const senderId = session?.user?.id;
  // const { receiverId } = req.query;
  const receiverId = "clo78mo220000ud3k2fvypqnp";
  try {
    const messages = await db.chatMessage.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
        replies: {
          include: {
            sender: true,
            receiver: true,
          },
        },
      },
    });
    return messages;
  } catch (error) {
    console.error(error);
  }

}

const Message = async () => {
  const userList = await getAllUsers();
  const data = await getChatMessages();

  const session = await getServerSession(authOptions);
  const senderId = session?.user?.id;
  const receiverId = "clo78mo220000ud3k2fvypqnp";

  return (
    <div className="flex flex-row">
      <SideBar userList={userList} />
      <ChatComp senderId={senderId} receiverId={receiverId} data={data} />
    </div>
  );
};

export default Message;
