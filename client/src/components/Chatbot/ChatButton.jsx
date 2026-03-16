import { useState } from "react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {/* Floating Chat Button */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#198754",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          zIndex: 999,
        }}
        title="Chat with us"
      >
        🤖
      </div>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            width: "320px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#198754",
              color: "#fff",
              padding: "12px 16px",
              fontWeight: "600",
            }}
          >
            RideRent Assistant
            <div style={{ fontSize: "12px", fontWeight: "400" }}>
              Online • Ask anything
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              padding: "12px",
              height: "220px",
              overflowY: "auto",
              fontSize: "14px",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <strong>Bot:</strong> Hi! I’m here to help you with bike rentals.
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>Bot:</strong> You can browse bikes, check prices, and view
              details easily.
            </div>
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: "1px solid #eee",
              padding: "10px",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question..."
              className="form-control"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;