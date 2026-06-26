import React from 'react';

function ChatMessage({ role, content }) {

  const isUser = role === 'user';

  return (
    /*
      isUser true  → self-end + flex-row-reverse = right side
      isUser false → self-start               = left side
      max-w-[75%]  → message bahut wide nahi hoga
    */
    <div className={`flex items-start gap-2 max-w-[75%] ${
      isUser ? 'self-end flex-row-reverse' : 'self-start'
    }`}>

      {/* Avatar */}
      <span className="text-2xl flex-shrink-0 mt-1">
        {isUser ? '👤' : '🤖'}
      </span>

      {/* Bubble */}
      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-blue-600 text-white rounded-br-sm'
          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
      }`}>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>

    </div>
  );
}

export default ChatMessage;