import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function Home() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("chat-channel");
    channel.bind("new-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch("/api/message", { method: "GET" });
      const data = await response.json();
      setMessages(data);
    };
  
    fetchMessages();
  }, []);
  

  const handleLogin = () => {
    if (username.trim()) setLoggedIn(true);
  };

  const sendMessage = async () => {
    if (message.trim()) {
      await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, message }),
      });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      {!loggedIn ? (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-4">Welcome to ChatApp</h1>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 p-2 border rounded w-full"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Chat Room</h2>
          <div className="mb-4 p-4 h-72 overflow-y-auto border rounded-lg bg-gray-50">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">No messages yet</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 mb-2 rounded ${
                    msg.username === username
                      ? "bg-blue-100 text-right"
                      : "bg-gray-100 text-left"
                  }`}
                >
                  <span className="block text-gray-700 font-semibold">{msg.username}</span>
                  <span className="text-gray-800">{msg.message}</span>
                </div>
              ))
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow p-2 border rounded-l-lg"
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
