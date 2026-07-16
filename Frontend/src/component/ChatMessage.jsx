function ChatMessage({ role, content }) {
  const isUser = role === "user";

  const rowClass = isUser ? "message-row user" : "message-row assistant";

  const label = isUser ? "You" : "AI";

  return (
    <div className={rowClass}>
      <span className="message-label">{label}</span>

      <div className="message-bubble">
        <p>{content}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
