import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust to your firebase.js path

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch chats data
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatsCollection = collection(db, "chats");
        const chatSnapshot = await getDocs(chatsCollection);
        const chatData = chatSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setChats(chatData);

        // Fetch user data to resolve userIds
        const userIds = chatData.flatMap((chat) => chat.userIds);
        const uniqueUserIds = [...new Set(userIds)];

        // Fetch user details
        const usersData = {};
        for (const userId of uniqueUserIds) {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            usersData[userId] = userDoc.data();
          }
        }

        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  // Function to render a value or "null" if undefined or null
  const renderValue = (value) => {
    return value === null || value === undefined ? "null" : value;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Chats List</h1>
      <table>
        <thead>
          <tr>
            <th>Chat ID</th>
            <th>Product ID</th>
            <th>User IDs</th>
            <th>Created At</th>
            <th>Last Message At</th>
            <th>Messages</th>
          </tr>
        </thead>
        <tbody>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <tr key={chat.id}>
                <td>{renderValue(chat.id)}</td>
                <td>{renderValue(chat.productId)}</td>
                <td>
                  {chat.userIds.map((userId) => (
                    <span key={userId}>{users[userId]?.fullName || userId}, </span>
                  ))}
                </td>
                <td>
                  {chat.createdAt
                    ? new Date(chat.createdAt.seconds * 1000).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {chat.lastMessageAt
                    ? new Date(chat.lastMessageAt.seconds * 1000).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {chat.messages ? (
                    chat.messages.map((message) => (
                      <div key={message.id}>
                        <strong>{users[message.senderId]?.fullName || message.senderId}: </strong>
                        {message.message}
                      </div>
                    ))
                  ) : (
                    "No messages"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No chats found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Chats;
