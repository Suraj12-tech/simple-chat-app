function ChatMessage({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      <span className="message-label">
        {isUser ? 'You' : 'AI'}
      </span>

      <div className="message-bubble">
        <p>{content}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
