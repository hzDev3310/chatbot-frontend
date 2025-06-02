import React, { useState, useEffect } from "react";
import api from "../api/api";
import { MdContentCopy } from "react-icons/md";
import ChatHistory from "./ChatHistory";
import { FiStar } from 'react-icons/fi';
import { IoIosSend } from "react-icons/io";
import ReactMarkdown from 'react-markdown';
import useChatStore from '../store/chatStore';

const Chat = () => {
  const { chatMessages, setChatMessages, addMessage, currentChatId } = useChatStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId] = useState(localStorage.getItem("user_id") || "");
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
      messageId: Date.now().toString(),
      rating: 0
    };
    addMessage(userMessage);
    setInput("");

    try {
      setLoading(true);
      const response = await api.generateResponse({
        prompt: input,
        user_id: userId,
        chat_id: currentChatId // Use currentChatId from store
      });

      const botMessage = {
        text: response.response?.response,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString(),
        messageId: response.chat_id || response.id,
        rating: 0
      };
      addMessage(botMessage);
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
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-md-3 p-0 border-end">
          <ChatHistory
            userId={userId}
            onSelectChat={(chat) => {
              if (chat?.messages) {
                setChatMessages(chat.messages);
                setSelectedChat(chat);
              } else {
                setChatMessages([]);
                setSelectedChat(null);
              }
            }}
          />
        </div>
        <div className="col-md-9 d-flex flex-column h-100 p-4">
          <div className="flex-grow-1 overflow-auto mb-4">
            {error && <div className="alert alert-danger">{error}</div>}
            {Array.isArray(chatMessages) && chatMessages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === "user" && "bg-primary text-white"} mb-3 p-3 border rounded`}>
                <div className="message-header d-flex justify-content-between align-items-center mb-2">
                  <span className="sender fw-bold">
                    {msg.sender === "user" ? "You" : "AI Assistant"}
                  </span>
                  <span className="timestamp text-muted small">{msg.timestamp}</span>
                </div>
                <div className="message-content text-break fw-normal">
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
                {msg.sender === "assistant" && (
                  <div className="message-actions mt-2 d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                    >
                      <MdContentCopy className="me-1" /> Copy
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => handleRateMessage(msg.messageId, 1)}
                    >
                      <FiStar className="me-1" /> Rate
                    </button>
                  </div>

                )}
              </div>
            ))}
          </div>
          <div className="chat-input-container p-3 border-top">
            <div className="d-flex ">
              <input
                type="text"
                className="form-control bg-light border-2 border-light rounded-start-5 rounded-end-0 p-3"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                disabled={loading}
              />
              <button
                className="btn btn-primary rounded-end-5  px-3 d-flex align-items-center  rounded-start-0"
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <IoIosSend size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
