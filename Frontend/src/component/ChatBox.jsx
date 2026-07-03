import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

function ChatBox({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-box">
      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          role={msg.role}
          content={msg.content}
        />
      ))}

      {isLoading && (
        <div className="message-row assistant">
          <span className="message-label">AI</span>
          <div className="message-bubble typing-bubble" aria-label="AI is replying">
            <div className="typing-dots">
              <span style={{ animationDelay: '0ms' }} />
              <span style={{ animationDelay: '150ms' }} />
              <span style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatBox;
