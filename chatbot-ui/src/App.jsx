import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import './index.css';

function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your simple chatbot. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();

      setMessages(prev => [...prev, { role: 'bot', text: data.reply || 'Sorry, I could not process that.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Error connecting to the agent.' }]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="chat-window glass">
        <header className="chat-header">
          <div className="header-icon glass-icon">
            <Sparkles size={24} className="text-accent" />
          </div>
          <div className="header-info">
            <h1>OpenClaw Chatbot</h1>
            <span className="status">
              <span className="status-dot"></span> Online
            </span>
          </div>
        </header>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.role}`}>
              <div className="avatar glass-icon">
                {msg.role === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`message-bubble ${msg.role}-bubble`}>
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-wrapper bot typing-indicator">
              <div className="avatar glass-icon">
                <Bot size={20} />
              </div>
              <div className="message-bubble bot-bubble dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="input-area glass-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={!input.trim() || isLoading}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
