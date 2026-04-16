import "./App.css";
import { useState, useRef, useEffect } from "react";
import { URL, API_KEY } from "./constants";
import Answers from "./Components/Answers";
import {
  FaBars,
  FaTimes,
  FaTrash,
  FaPlus,
  FaMoon,
  FaSun,
  FaEllipsisV,
} from "react-icons/fa";

const App = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [result]);

  const loadChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setResult(chat.messages);
      setCurrentChatId(chatId);
      setSidebarOpen(false);
    }
  };

  const saveCurrentChat = () => {
    if (result.length === 0) return;

    const firstQuestion = result.find((msg) => msg.sender === "user")?.text;
    const title =
      typeof firstQuestion === "string"
        ? firstQuestion.substring(0, 40)
        : "Untitled Chat";

    if (currentChatId) {
      setChatHistory(
        chatHistory.map((chat) =>
          chat.id === currentChatId ? { ...chat, messages: result } : chat
        )
      );
    } else {
      const newChat = {
        id: Date.now(),
        title,
        messages: result,
        timestamp: new Date().toLocaleString(),
      };
      setChatHistory([newChat, ...chatHistory]);
      setCurrentChatId(newChat.id);
    }
  };

  const startNewChat = () => {
    saveCurrentChat();
    setResult([]);
    setQuestion("");
    setCurrentChatId(null);
    setSidebarOpen(false);
  };

  const deleteChat = (chatId) => {
    setChatHistory(chatHistory.filter((c) => c.id !== chatId));
    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  const clearAllChats = () => {
    if (window.confirm("Are you sure? This will delete all chats.")) {
      setChatHistory([]);
      startNewChat();
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = question;
    setQuestion("");
    setResult((prev) => [...prev, { sender: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const ResponseData = await response.json();
      const FinalData =
        ResponseData.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received";

      const FinalAns = FinalData.split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      setResult((prev) => [...prev, { sender: "ai", text: FinalAns }]);
      saveCurrentChat();
    } catch (error) {
      console.error(error);
      setResult((prev) => [
        ...prev,
        {
          sender: "ai",
          text: ["Unable to process your request. Please try again."],
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* Header Bar */}
      <header className="header-bar">
        <div className="header-left">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <div className="logo">
            <div className="logo-icon">✨</div>
            <span className="logo-text">Gemini Chat</span>
          </div>
        </div>

        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle theme"
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Chat History</h2>
          <button className="new-chat-btn" onClick={startNewChat}>
            <FaPlus size={14} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="chat-history-container">
          {chatHistory.length > 0 ? (
            <div className="chat-list">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item ${currentChatId === chat.id ? "active" : ""
                    }`}
                  onClick={() => loadChat(chat.id)}
                >
                  <div className="chat-item-content">
                    <p className="chat-item-title">{chat.title}</p>
                    <p className="chat-item-time">
                      {new Date(chat.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="chat-item-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No conversations yet</p>
              <p className="empty-text">Start a new chat to begin</p>
            </div>
          )}
        </div>

        {chatHistory.length > 0 && (
          <button className="clear-all-btn" onClick={clearAllChats}>
            Clear All Chats
          </button>
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="main-content">
        {/* Messages Container */}
        <div className="messages-container">
          {result.length === 0 ? (
            <div className="welcome-section">
              <div className="welcome-icon">💬</div>
              <h1 className="welcome-title">Welcome to Gemini Chat</h1>
              <p className="welcome-subtitle">
                Ask anything and get instant AI-powered responses
              </p>
              <div className="quick-examples">
                <button className="example-btn" onClick={() => setQuestion("Write a professional email")}>
                  Write an email
                </button>
                <button className="example-btn" onClick={() => setQuestion("Explain quantum computing")}>
                  Quantum computing
                </button>
                <button className="example-btn" onClick={() => setQuestion("Code a React component")}>
                  React component
                </button>
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              <Answers data={result} darkMode={darkMode} />
              {isLoading && (
                <div className="loading-indicator">
                  <div className="ai-avatar">🤖</div>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && askQuestion()}
              disabled={isLoading}
              className="chat-input"
              placeholder="Ask me anything..."
            />
            <button
              onClick={askQuestion}
              disabled={isLoading || !question.trim()}
              className="send-button"
            >
              <span className="send-icon">→</span>
            </button>
          </div>
          <p className="input-hint">Press Enter to send • Powered by Gemini AI</p>
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;