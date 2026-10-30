import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send, User, Headset, Loader2 } from "lucide-react";
import { askSupportAssistant } from "../../services/supportService";

const WELCOME = {
  sender: "bot",
  text: "Hello! I'm RideRent Support. Ask me about bikes, prices, bookings or becoming a provider.",
};

const QUICK_QUESTIONS = [
  "How do I book a bike?",
  "Cheapest bike available?",
  "What is my booking status?",
  "How do I become a provider?",
];

// AI customer support widget shown on every public page
const CustomerSupport = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const question = text.trim();
    if (!question || loading) return;

    // Earlier turns (without the welcome text) give the assistant conversation context
    const history = messages.slice(1);
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await askSupportAssistant(question, history);
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (error) {
      console.error("Support chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I can't connect right now. Please try again or use the Contact page." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage(input);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        aria-label={open ? "Close support chat" : "Open support chat"}
        onClick={() => setOpen(!open)}
        className="shadow-lg border-0"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: open ? "#dc3545" : "#198754",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1050,
          transition: "all 0.3s ease-in-out",
        }}
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {open && (
        <div
          className="shadow-lg d-flex flex-column bg-white"
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            width: "min(360px, calc(100vw - 32px))",
            height: "min(520px, calc(100vh - 140px))",
            borderRadius: "16px",
            overflow: "hidden",
            zIndex: 1050,
            animation: "fadeInUp 0.3s ease-out forwards",
          }}
        >
          {/* Header */}
          <div
            className="d-flex align-items-center gap-3"
            style={{ background: "linear-gradient(135deg, #198754, #146c43)", color: "#fff", padding: "14px 16px" }}
          >
            <div
              className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              <Headset size={22} />
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-0 fw-bold">RideRent Support</h6>
              <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>AI assistant · replies in seconds</div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="d-flex flex-column gap-2"
            style={{ flex: 1, padding: "16px", overflowY: "auto", backgroundColor: "#f8f9fa" }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`d-flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${
                    msg.sender === "user" ? "bg-primary text-white" : "bg-success bg-opacity-25 text-success"
                  }`}
                  style={{ width: "28px", height: "28px" }}
                >
                  {msg.sender === "user" ? <User size={14} /> : <Headset size={14} />}
                </div>
                <div
                  className={`p-2 px-3 shadow-sm ${
                    msg.sender === "user" ? "bg-success text-white" : "bg-white text-dark border"
                  }`}
                  style={{
                    borderRadius: "16px",
                    maxWidth: "80%",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text.replace(/\*\*/g, "")}
                </div>
              </div>
            ))}

            {/* Suggested questions before the user types anything */}
            {messages.length === 1 && (
              <div className="d-flex flex-wrap gap-2 mt-1">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="btn btn-sm btn-outline-success rounded-pill"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="d-flex align-items-center gap-2 text-muted small">
                <Loader2 size={16} className="text-success" style={{ animation: "spin 1s linear infinite" }} />
                Support is typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-top">
            <div className="d-flex gap-2 align-items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="form-control bg-light rounded-pill px-3 py-2 shadow-none"
                style={{ fontSize: "0.9rem" }}
                disabled={loading}
              />
              <button
                type="button"
                aria-label="Send"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="btn btn-success rounded-circle d-flex align-items-center justify-content-center p-0 flex-shrink-0"
                style={{ width: "40px", height: "40px" }}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center small mt-2 text-muted">
              Need a person?{" "}
              <Link to="/contact" onClick={() => setOpen(false)} className="text-success">
                Contact our team
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default CustomerSupport;
