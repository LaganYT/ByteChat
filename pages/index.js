import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://byte-chat-ochre.vercel.app:3001'); // Connect to Socket.io server

export default function Home() {
  const [username, setUsername] = useState('');
  const [userList, setUserList] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Receive user list updates
    socket.on('userList', (users) => {
      setUserList(users);
    });

    // Receive incoming messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogin = () => {
    if (username.trim() !== '') {
      socket.emit('addUser', username);
      setLoggedIn(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {!loggedIn ? (
        <div className="login flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-2 p-2 border border-gray-300"
          />
          <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white">
            Join Chat
          </button>
        </div>
      ) : (
        <div className="chat-container w-full max-w-md mx-auto">
          <div className="users-list mb-4">
            <h3>Active Users</h3>
            <ul className="list-disc pl-4">
              {userList.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
          <div className="chat-box border border-gray-300 p-4 mb-4 h-64 overflow-y-auto bg-white">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 border border-gray-300 w-full mb-2"
          />
          <button onClick={sendMessage} className="w-full px-4 py-2 bg-green-500 text-white">
            Send
          </button>
        </div>
      )}
    </div>
  );
}
