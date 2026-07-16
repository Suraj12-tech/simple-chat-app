import { useState } from "react";

function ChatInput({ onSendMessage, isLoading }) {
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    const message = inputText.trim();

    if (message === "" || isLoading) {
      return;
    }

    onSendMessage(message);

    setInputText("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    sendMessage();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      sendMessage();
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message AI Chatbot"
        rows={1}
        disabled={isLoading}
      />

      <button type="submit" disabled={isLoading || inputText.trim() === ""}>
        Send
      </button>
    </form>
  );
}

export default ChatInput;
