import { useState } from "react";
import axios from "axios";

import ChatBox from "./component/ChatBox";
import ChatInput from "./component/ChatInput";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello. Ask me anything.",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userText) => {
    const userMessage = {
      role: "user",
      content: userText,
    };

    const updatedMessages = [...messages];
    updatedMessages.push(userMessage);

    setMessages(updatedMessages);

    setIsLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        messages: updatedMessages,
      });

      let reply = response.data.reply;

      if (reply == null || reply === "") {
        reply = "Backend se empty response aaya.";
      }

      const aiMessage = {
        role: "assistant",
        content: reply,
      };

      updatedMessages.push(aiMessage);

      setMessages([...updatedMessages]);
    } catch (error) {
      console.log(error);

      let errorMessage = "";

      if (error.response != null) {
        if (error.response.data.reply != null) {
          errorMessage = error.response.data.reply;
        } else if (error.response.data.message != null) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request != null) {
        errorMessage = "Backend se connection nahi ho pa raha.";
      } else {
        errorMessage = "Message send nahi ho paya.";
      }

      const aiErrorMessage = {
        role: "assistant",
        content: "Error: " + errorMessage,
      };

      updatedMessages.push(aiErrorMessage);

      setMessages([...updatedMessages]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="chat-panel">
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
