import React, { useState } from 'react';

function ChatInput({ onSendMessage, isLoading }) {

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() === '' || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-slate-800 border-t border-slate-700 p-4 flex gap-3 items-end">

      <textarea
        className="
          flex-1 bg-slate-950 border border-slate-600
          rounded-xl px-4 py-3
          text-slate-100 text-sm placeholder-slate-500
          resize-none outline-none
          focus:border-blue-500 transition-colors
          disabled:opacity-50
          max-h-32 leading-relaxed
        "
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message... (Enter to send)"
        rows={1}
        disabled={isLoading}
      />

      <button
        className="
          px-5 py-3 rounded-xl text-lg flex-shrink-0
          transition-all duration-200
          bg-blue-600 text-white
          hover:bg-blue-500 hover:scale-105
          disabled:bg-slate-700 disabled:text-slate-500
          disabled:cursor-not-allowed disabled:scale-100
        "
        onClick={handleSend}
        disabled={isLoading || inputText.trim() === ''}
      >
        {isLoading ? '⏳' : '➤'}
      </button>

    </div>
  );
}

export default ChatInput;