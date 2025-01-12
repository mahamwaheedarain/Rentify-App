import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firebase setup
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

const Messages = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages and listen for real-time updates
  useEffect(() => {
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCollection, orderBy('timestamp'));
    
    // Listen for new messages in real-time
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();  // Cleanup listener when component unmounts
  }, [chatId]);

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const messageData = {
          senderId: 'admin', // Replace with actual user ID
          message: newMessage,
          timestamp: new Date(),
          messageType: 'text', // You can extend this for 'image' or 'file'
          status: 'sent',  // Default message status is 'sent'
        };

        const messagesCollection = collection(db, 'chats', chatId, 'messages');
        await addDoc(messagesCollection, messageData);  // Send message to Firestore

        // Clear the input field after sending
        setNewMessage('');
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-list">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.senderId === 'admin' ? 'sent' : 'received'}`}>
            <p><strong>{message.senderId}</strong>: {message.message}</p>
            <p><small>{new Date(message.timestamp.seconds * 1000).toLocaleString()}</small></p>
          </div>
        ))}
      </div>
      
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Messages;
