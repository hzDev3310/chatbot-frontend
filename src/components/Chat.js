import React, { useState, useEffect } from "react";
import api from "../api/api";

import ChatHistory from "./ChatHistory";

const Chat = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId] = useState(localStorage.getItem("user_id") || "");

  useEffect(() => {
    if (userId) {
      fetchChatHistory();
    }
  }, [userId]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await api.getChatHistory(userId);
      const formattedHistory = Object.values(response.history || {})
        .flat()
        .map((msg) => ({
          text: msg.content,
          sender: msg.role,
          timestamp: new Date(msg.timestamp).toLocaleTimeString(),
          messageId: msg._id,
        }));
      setMessages(formattedHistory);
    } catch (error) {
      setError("Failed to load chat history");
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");

    try {
      setLoading(true);
      const response = await api.generateResponse({
        prompt: input,
        user_id: userId,
      });

      const botMessage = {
        text: response.response.response,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString(),
        messageId: response.message_id,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setError("Failed to generate response");
      console.error("Error generating response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateMessage = async (messageId, rating) => {
    try {
      await api.rateMessage({ message_id: messageId, rating });
    } catch (error) {
      console.error("Error rating message:", error);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-3">
        <ChatHistory />
      </div>
      <div className="col-md-6">
        {error && <div className="error-message">{error}</div>}

        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-header">
                <span className="sender">
                  {msg.sender === "user" ? "You" : "AI"}
                </span>
                <span className="timestamp">{msg.timestamp}</span>
              </div>
              <div className="message-content">{msg.text}</div>
              {msg.messageId && msg.sender === "assistant" && (
                <div className="rating-buttons">
                  <button onClick={() => handleRateMessage(msg.messageId, 1)}>
                    👍
                  </button>
                  <button onClick={() => handleRateMessage(msg.messageId, -1)}>
                    👎
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
      <div className="col-md-3">
      
      </div>
    </div>
  );
};

export default Chat;
