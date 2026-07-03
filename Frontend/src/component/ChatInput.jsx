import { useState } from 'react';

function ChatInput({ onSendMessage, isLoading }) {
  const [inputText, setInputText] = useState('');

  const handleSend = (event) => {
    event?.preventDefault();
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
    <form className="chat-input" onSubmit={handleSend}>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message AI Chatbot"
        rows={1}
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading || inputText.trim() === ''}
      >
        Send
      </button>
    </form>
  );
}

export default ChatInput;
