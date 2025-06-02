import React, { useState, useEffect } from "react";
import { LuMessageCirclePlus } from "react-icons/lu";
import { FaIndustry } from "react-icons/fa";
import api from "../api/api";

const ChatHistory = ({ userId, onSelectChat }) => {
  const [chatHistory, setChatHistory] = useState({
    today: [],
    yesterday: [],
    older: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChatHistory();
  }, [userId]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await api.getChatHistory(userId);
      setChatHistory(response.history || {
        today: [],
        yesterday: [],
        older: []
      });
    } catch (err) {
      setError("Failed to load chat history");
      console.error("Error fetching chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    onSelectChat(null);
  };

  const renderChatList = (chats, title) => {
    if (!chats || Object.keys(chats).length === 0) return null;

    return (
      <div className="mb-4">
        <h6 className="text-muted mb-3">{title}</h6>
        <div className="chat-list">
          {Object.entries(chats).map(([chatId, chat]) => (
            <button
              key={chatId}
              className="btn btn-light w-100 text-start mb-2 p-3 rounded-3"
              onClick={() => {
                console.log("Selected chat:", chat.messages);
                const formattedMessages = chat.messages.map(msg => ({
                  text: msg.prompt || msg.response?.response || msg.response,
                  sender: msg.sender_type === "user" ? 'user' : 'assistant',
                  timestamp: new Date(msg.created_at).toLocaleTimeString(),
                  messageId: msg._id || msg.id
                }));
                onSelectChat({
                  chat_id: chatId,
                  messages: formattedMessages,
                  created_at: chat.created_at
                });
              }}
            >
              <div className="d-flex flex-column">
                <span className="text-truncate">
                  {chat.messages[0]?.prompt || "New Conversation"}
                </span>
                <small className="text-muted">
                  {new Date(chat.created_at).toLocaleTimeString()}
                </small>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="chat-history h-100 d-flex flex-column p-4 bg-light">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="m-0 d-flex align-items-center">
          <FaIndustry className="me-2" /> Industry 4.0
        </h4>
      </div>

      <button
        className="btn btn-primary mb-4 d-flex align-items-center justify-content-center gap-2"
        onClick={handleNewChat}
      >
        <LuMessageCirclePlus />
        <span>New Chat</span>
      </button>

      <div className="overflow-auto flex-grow-1">
        {renderChatList(chatHistory.today, "Today")}
        {renderChatList(chatHistory.yesterday, "Yesterday")}
        {renderChatList(chatHistory.older, "Older")}
      </div>
    </div>
  );
};

export default ChatHistory;