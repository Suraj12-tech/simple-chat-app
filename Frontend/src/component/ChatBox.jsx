import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

function ChatBox({ messages, isLoading }) {

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    // flex-1 = bacha hua sara space le lo (header aur input ke beech)
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          role={msg.role}
          content={msg.content}
        />
      ))}

      {/* Typing animation — AI reply aa rahi hai tab dikhega */}
      {isLoading && (
        <div className="flex items-start gap-2 self-start">
          <span className="text-2xl mt-1">🤖</span>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
            <div className="flex gap-1 items-center h-4">
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Auto scroll ke liye invisible div */}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatBox;