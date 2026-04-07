import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, Loader2 } from "lucide-react";

// The Chatbot Component
const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your AI Assistant. How can I help you with your bike rentals today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
         setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { sender: "bot", text: "Please set your VITE_GEMINI_API_KEY in the client/.env file to chat with me!" }
            ]);
            setLoading(false);
         }, 800);
         return;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             system_instruction: {
                parts: {
                   text: "You are a highly professional, helpful customer support assistant for a bike rental platform called 'RideRent' operating in Pakistan. Keep responses relatively concise. Provide helpful answers about prices, bookings, and bikes."
                }
             },
             contents: [
               { parts: [{ text: userMessage.text }] }
             ]
          }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
         throw new Error(data.error.message);
      }

      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not exactly sure how to answer that.";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botText },
      ]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I am having trouble connecting to my AI brain. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div
        onClick={() => setOpen(!open)}
        className="shadow-lg transition-all hover-translate-y"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: open ? "#dc3545" : "#198754",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 9999,
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </div>

      {/* Glassmorphic Chat Window */}
      {open && (
        <div
          className="shadow-lg d-flex flex-column"
          style={{
            position: "fixed",
            bottom: "100px",
            right: "30px",
            width: "350px",
            height: "500px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            overflow: "hidden",
            zIndex: 9998,
            animation: "fadeInUp 0.3s ease-out forwards",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header */}
          <div
            className="d-flex align-items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #198754, #146c43)",
              color: "#fff",
              padding: "16px",
            }}
          >
            <div
              className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              <Bot size={24} />
            </div>
            <div>
              <h6 className="mb-0 fw-bold">RideRent AI</h6>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                Online • Powered by Gemini
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              backgroundColor: "#f8f9fa",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`d-flex gap-2 ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${
                    msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-success bg-opacity-25 text-success"
                  }`}
                  style={{ width: "28px", height: "28px" }}
                >
                  {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div
                  className={`p-2 px-3 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-success text-white"
                      : "bg-white text-dark border"
                  }`}
                  style={{
                    borderRadius: "16px",
                    borderTopRightRadius: msg.sender === "user" ? "4px" : "16px",
                    borderTopLeftRadius: msg.sender === "bot" ? "4px" : "16px",
                    maxWidth: "80%",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br/>") }}
                />
              </div>
            ))}
            
            {loading && (
              <div className="d-flex gap-2">
                 <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-success bg-opacity-25 text-success"
                  style={{ width: "28px", height: "28px" }}
                >
                  <Bot size={14} />
                </div>
                <div className="bg-white border rounded-pill p-2 px-3 shadow-sm d-flex align-items-center text-muted">
                   <Loader2 size={16} className="text-success" style={{ animation: "spin 1s linear infinite" }} />
                   <span className="ms-2 small">Typing...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className="p-3 bg-white border-top border-light d-flex gap-2 align-items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="form-control border-0 bg-light rounded-pill px-3 py-2 shadow-none"
              style={{ fontSize: "0.9rem" }}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={`btn rounded-circle d-flex align-items-center justify-content-center p-0 flex-shrink-0 ${
                 input.trim() ? "btn-success" : "btn-secondary opacity-50"
              }`}
              style={{ width: "40px", height: "40px" }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .hover-translate-y:hover {
           transform: translateY(-5px);
        }
        /* Custom scrollbar for chat */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </>
  );
};

export default Chatbot;