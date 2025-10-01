import React, { useState, useContext } from "react";
import api from "../../api";
import { Bot, User } from "lucide-react";
import { AppContext } from "../../context/AppContext";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your Career Comeback Coach. How can I help?",
    },
  ]);
  const { username, darkMode } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    const typingMsg = { role: "bot", text: "Typing..." };

    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/chat/ask", {
        message: input,
        context: "", // add context if needed
      });

      // Replace the "Typing..." message with actual response
      setMessages((prev) => [
        ...prev.slice(0, -1), // remove last (typing)
        { role: "bot", text: response.data.response },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", text: "Oops, something went wrong!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const botBubbleClasses = darkMode
    ? "bg-gray-700 text-gray-100" // Dark Bot Bubble
    : "bg-gray-100 text-gray-800"; // Light Bot Bubble

  const userBubbleClasses = darkMode
    ? "bg-blue-600 text-white" // Dark User Bubble (primary color)
    : "bg-blue-100 text-gray-900"; // Light User Bubble

  const botAvatarBg = darkMode ? "bg-gray-600" : "bg-gray-300";

  const ChatMessage = ({ role, text }) => {
    const isUser = role === "user";
    const userInitial = username ? username.charAt(0).toUpperCase() : "U";
    return (
      <div
        className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
      >
        <div className={`flex items-start gap-2 max-w-[75%]`}>
          {!isUser && (
            <div
              className={`pt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              <div
                className={`w-8 h-8 ${botAvatarBg} rounded-full flex items-center justify-center text-sm font-bold`}
              >
                🤖
              </div>
            </div>
          )}
          <div
            className={`rounded-lg px-4 py-2 shadow-md ${
              isUser
                ? userBubbleClasses // Applied user bubble styles
                : botBubbleClasses // Applied bot bubble styles
            }`}
          >
            {text}
          </div>
          {isUser && (
            <div className="text-white pt-1">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                {userInitial}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  const containerClasses = darkMode
    ? "bg-gray-800 text-gray-100"
    : "bg-gradient-to-r from-blue-300 to-gray-200";

  // 🚨 Dynamic styling for chat area wrapper
  const chatAreaClasses = darkMode
    ? "ring-gray-700 bg-gray-900"
    : "ring-gray-200";

  // 🚨 Dynamic styling for suggested topics buttons
  const topicButtonClasses = darkMode
    ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
    : "bg-gray-200 hover:bg-gray-300 text-gray-900";

  // 🚨 Dynamic styling for the input field
  const inputClasses = darkMode
    ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400"
    : "border-gray-300";

  return (
    <div
      className={`w-full max-w-7xl mx-auto shadow rounded p-6 flex flex-col min-h-[80vh] transition-colors duration-500 ${containerClasses}`}
    >
      <h2 className="text-xl font-bold mb-4">Career Comeback Chatbot</h2>
      <div
        className={`flex-1 overflow-y-auto space-y-2 mb-4 p-2 rounded ring-1 ${chatAreaClasses}`}
      >
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} text={msg.text} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {["Resume Help", "Interview Tips", "Confidence", "Networking"].map(
          (t) => (
            <button
              key={t}
              onClick={() => setInput(`I need help with ${t.toLowerCase()}`)}
              className={`text-sm px-3 py-1 rounded ${topicButtonClasses}`}
            >
              {t}
            </button>
          )
        )}
      </div>

      <div className="flex gap-2">
        <input
          className={`flex-1 border rounded p-2 ${inputClasses}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Typing" : "Send"}
        </button>
      </div>
    </div>
  );
}
