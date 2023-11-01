"use client";
import { useEffect, useState } from "react";


export function FriendRequestForm({ onSendFriendRequest }) {
  const [friendEmail, setFriendEmail] = useState("");

  const handleSendFriendRequest = () => {
    onSendFriendRequest(friendEmail);
    setFriendEmail("");
  };

  return (
    <div>
      <h2>Send Friend Request</h2>
      <input
        type="text"
        placeholder="Friend's Email"
        value={friendEmail}
        onChange={(e) => setFriendEmail(e.target.value)}
      />
      <button onClick={handleSendFriendRequest}>Send Friend Request</button>
    </div>
  );
}

// FriendRequestList.js
export function FriendRequestList({ friendRequests, onAcceptFriendRequest, onDeclineFriendRequest }) {
  return (
    <div>
      <h2>Friend Requests</h2>
      {friendRequests.map((request) => (
        <div key={request.id}>
          {request.sender.name} wants to be your friend.
          <button onClick={() => onAcceptFriendRequest(request.id)}>Accept</button>
          <button onClick={() => onDeclineFriendRequest(request.id)}>Decline</button>
        </div>
      ))}
    </div>
  );
}


export function ChatRoomForm({
  users, // List of available users
  onCreateChatRoom,
  onJoinChatRoom,
}) {
  const [roomName, setRoomName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [roomIdToJoin, setRoomIdToJoin] = useState("");

  const handleCreateChatRoom = () => {
    onCreateChatRoom(roomName, selectedMembers);
    setRoomName("");
    setSelectedMembers([]);
  };

  const handleJoinChatRoom = () => {
    onJoinChatRoom(roomIdToJoin);
    setRoomIdToJoin("");
  };

  return (
    <div>
      <h2>Create a Chat Room</h2>
      <input
        type="text"
        placeholder="Room Name"
        className="input input-bordered input-sm"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <select
        multiple
        value={selectedMembers}
        className="select select-bordered w-full max-w-xs"
        onChange={(e) => {
          const selectedOptions = Array.from(e.target.options).filter(
            (option) => option.selected
          );
          setSelectedMembers(
            selectedOptions.map((option) => parseInt(option.value))
          );
        }}
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button onClick={handleCreateChatRoom} className="btn btn-sm">Create Chat Room</button>

      <div className=" flex flex-col gap-2 p-6 border rounded">
        <h2>Join an Existing Chat Room</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Room ID"
            className="input input-bordered input-sm"
            value={roomIdToJoin}
            onChange={(e) => setRoomIdToJoin(e.target.value)}
          />
          <button onClick={handleJoinChatRoom} className="btn btn-sm">
            Join Chat Room
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChatRoom({ chatRoom, onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    onSendMessage(chatRoom.id, message);
    setMessage("");
  };

  return (
    <div>
      <h2>{chatRoom.name}</h2>
      <div>
        {chatRoom.messages.map((message) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default function ChatApp() {
  const [users, setUsers] = useState([]); // List of available users
  const [friendRequests, setFriendRequests] = useState([]); // List of friend requests
  const [friends, setFriends] = useState([]); // List of user's friends
  const [chatRooms, setChatRooms] = useState([]); // List of chat rooms
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  // Load users and chat rooms when the component mounts
  useEffect(() => {
    // Fetch users and chat rooms from your API
    // This should be done using useEffect or another lifecycle method
    // The implementation depends on your API and data fetching strategy
    // For simplicity, we'll use static data here

    const sampleUsers = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
      { id: 3, name: "User 3" },
    ];

    const sampleChatRooms = [
      { id: 1, name: "Room 1", messages: [] },
      { id: 2, name: "Room 2", messages: [] },
    ];

    setUsers(sampleUsers);
    setChatRooms(sampleChatRooms);
  }, []);

  const createChatRoom = (name, members) => {
    setChatRooms([...chatRooms, {id: new Date().getMilliseconds(), name,}])
    console.log(members.name);
    // Call your API to create a chat room
    // Update the chatRooms state with the newly created chat room
  };

  const joinChatRoom = (roomId) => {
    // Call your API to join an existing chat room
    // Update the chatRooms state to include the joined chat room
  };

  const sendMessage = (roomId, content) => {
    // Call your API to send a message
    // Update the chat room's messages with the sent message
  };

  const sendFriendRequest = (friendEmail) => {
    // Call your API to send a friend request
    // Update the friendRequests state with the newly sent request
  };

  const acceptFriendRequest = (requestId) => {
    // Call your API to accept the friend request
    // Update the friends state and remove the request from friendRequests
  };

  const declineFriendRequest = (requestId) => {
    // Call your API to decline the friend request
    // Remove the request from friendRequests
  };

  return (
    <div>
      <FriendRequestForm onSendFriendRequest={sendFriendRequest} />
      <FriendRequestList
        friendRequests={friendRequests}
        onAcceptFriendRequest={acceptFriendRequest}
        onDeclineFriendRequest={declineFriendRequest}
      />
      <ChatRoomForm
        users={users}
        onCreateChatRoom={createChatRoom}
        onJoinChatRoom={joinChatRoom}
      />
      <div>
        {chatRooms.map((room) => (
          <div key={room.id}>
            <button onClick={() => setSelectedChatRoom(room)}>
              Open {room.name}
            </button>
          </div>
        ))}
      </div>
      {selectedChatRoom && (
        <ChatRoom chatRoom={selectedChatRoom} onSendMessage={sendMessage} />
      )}
    </div>
  );
}
