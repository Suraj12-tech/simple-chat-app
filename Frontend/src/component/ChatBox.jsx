import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

function ChatBox({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current != null) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-box">
      {messages.map(function (msg, index) {
        return (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        );
      })}

      {isLoading === true && (
        <div className="message-row assistant">
          <span className="message-label">AI</span>

          <div
            className="message-bubble typing-bubble"
            aria-label="AI is replying"
          >
            <div className="typing-dots">
              <span style={{ animationDelay: "0ms" }}></span>

              <span style={{ animationDelay: "150ms" }}></span>

              <span style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatBox;
