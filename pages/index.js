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
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      {!loggedIn ? (
        <div className="flex flex-col items-center">
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
        <div className="w-full max-w-md mx-auto">
          <div className="border border-gray-300 p-4 mb-4 h-64 overflow-y-auto bg-white">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.username}:</strong> {msg.message}
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
