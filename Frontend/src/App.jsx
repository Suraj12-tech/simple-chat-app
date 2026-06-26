import React, { useState } from 'react';
import ChatBox from './component/ChatBox';
import ChatInput from './component/ChatInput';
import axios from 'axios';

// App.css ka import nahi chahiye ab

function App() {

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 👋 I am your AI assistant. Ask me anything!'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userText) => {
    const userMessage = { role: 'user', content: userText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/chat', {
        messages: updatedMessages
      });
      const aiMessage = { role: 'assistant', content: response.data.reply };
      setMessages([...updatedMessages, aiMessage]);

    } catch (error) {
      console.error('Error:', error);
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: '❌ Kuch gadbad ho gayi. Backend chal raha hai? Try again!'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Full screen dark background — flex center mein chat container
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">

      {/* Main chat box */}
      <div className="w-full max-w-2xl h-[90vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
          <h1 className="text-white font-semibold text-lg tracking-wide">
            🤖 AI Chatbot
          </h1>
          <span className="text-green-400 text-sm font-medium">
            ● Online
          </span>
        </div>

        {/* Messages area */}
        <ChatBox messages={messages} isLoading={isLoading} />

        {/* Input area */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />

      </div>
    </div>
  );
}

export default App;