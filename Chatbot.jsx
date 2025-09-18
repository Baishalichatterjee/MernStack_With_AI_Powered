import React, { useState, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Load initial messages or welcome message
  useEffect(() => {
    setMessages([{ text: "Hello! I'm here to help with your club-related queries. Ask me anything!", sender: 'bot' }]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput(""); // Clear input field
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/chat",
        { prompt: input },
        { 
          headers: { 
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const botMessage = { text: response.data.text, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      let errorMessage = "Sorry, I couldn't connect to the AI service right now.";
      
      // Handle different error response formats
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      const errorMsg = { text: `Error: ${errorMessage}`, sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
      console.error("Chatbot API error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <h1>Club Chatbot</h1>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message-bubble bot">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          placeholder="Ask about a club..."
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;