import React from 'react';
import ChatComp from "./ChatComp";
import SideBar from "./SideBar";
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// const handleGetReceiverId = (receiverId) => {
//   return receiverId
// }

async function getAllUsers(){
  const response = await db.user.findMany({
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          profilePicture: true,
        }
      }
    }
  });
   return response
}

async function getChatMessages() {
  const session = await getServerSession(authOptions);
  const senderId = session?.user?.id;
  // const { receiverId } = req.query;
  const receiverId = "clo78mo220000ud3k2fvypqnp";
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
  return messages
}



const Message = async () => {
  const userList = await getAllUsers();
  const data = await getChatMessages();

  const session = await getServerSession(authOptions);
  const senderId = session?.user?.id;
  const receiverId = "clo78mo220000ud3k2fvypqnp";
  
  return (
    <div className="flex flex-row">
      <SideBar  userList={userList}/>
      <ChatComp senderId={senderId} receiverId={receiverId} data={data} />
    </div>
  )
}

export default Message