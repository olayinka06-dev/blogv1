import { NextResponse } from "next/server";
import { Server } from "socket.io";

export async function POST(req) {
  if (req.socket.server.io) {
    console.log("Already set up");
    return NextResponse.json({ message: "Socket already set up" }, {status: 200});
  }

  const io = new Server(req.socket.server);
  req.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("send-message", (obj) => {
      io.emit("receive-message", obj);
    });
  });

  console.log("Setting up socket");
  
  return NextResponse.json({ message: "Socket set up" }, {status: 200});
}


// import { Server } from 'socket.io';

// export async function POST(req) {
//   const io = req.socket.server;

//   if (io) {
//     console.log('Already set up');
//     return {
//       status: 200,
//       json: { message: 'Socket already set up' },
//     };
//   }

//   // Create the Socket.IO server using the existing HTTP server
//   const socketIo = new Server(req.socket.server);
//   req.socket.server.io = socketIo;

//   socketIo.on('connection', (socket) => {
//     socket.on('send-message', (obj) => {
//       socketIo.emit('receive-message', obj);
//     });
//   });

//   console.log('Setting up socket');

//   return {
//     status: 200,
//     json: { message: 'Socket set up' },
//   };
// }
