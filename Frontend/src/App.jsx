import { useState } from 'react';
import ChatBox from './component/ChatBox';
import ChatInput from './component/ChatInput';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello. Ask me anything.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userText) => {
    const userMessage = { role: 'user', content: userText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        messages: updatedMessages,
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data?.reply || 'Backend se empty response aaya.',
      };
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error('Error:', error);

      const errorMessage = error.response?.data?.reply
        || error.response?.data?.message
        || (error.request
          ? 'Backend se connection nahi ho pa raha. Spring Boot app localhost:8080 par run karo.'
          : 'Message send nahi ho paya.');

      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: `Error: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="chat-panel" aria-label="AI chat">
        <header className="chat-header">
          <div>
            <p className="chat-kicker">Google Gemini</p>
            <h1>AI Chatbot</h1>
          </div>
          <span className="status-pill">
            <span aria-hidden="true" />
            Ready
          </span>
        </header>

        <ChatBox messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </section>
    </main>
  );
}

export default App;
