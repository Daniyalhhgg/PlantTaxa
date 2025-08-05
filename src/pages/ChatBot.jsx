import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6") center/cover no-repeat;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  color: #ffffff;

  &::before {
    content: "";
    background: rgba(0, 60, 30, 0.85);
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
    animation: fadeIn 0.7s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h2`
  font-size: 2.2rem;
  color: #c8e6c9;
  margin-bottom: 25px;
  font-weight: bold;
  text-shadow: 1px 1px 3px #000;
`;

const ChatBox = styled.div`
  background-color: rgba(255,255,255,0.95);
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  padding: 25px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
`;

const Message = styled.div`
  align-self: ${props => props.sender === 'user' ? 'flex-end' : 'flex-start'};
  background: ${props => props.sender === 'user'
    ? 'rgba(129, 199, 132, 0.3)'
    : 'linear-gradient(135deg, rgba(0,150,136,0.2), rgba(0,255,200,0.15))'};
  color: #000;
  padding: 14px 20px;
  border-radius: 18px;
  max-width: 75%;
  font-size: 1rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  border: ${props => props.sender === 'user' ? "1px solid #81c784" : "1px solid #4db6ac"};
  backdrop-filter: blur(4px);
`;

const InputArea = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
  width: 100%;
  max-width: 800px;
`;

const Input = styled.input`
  flex: 1;
  padding: 14px 20px;
  border-radius: 30px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  margin-right: 12px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #7ca043ff;
  }
`;

const Button = styled.button`
  padding: 14px 24px;
  background-color: #43a047;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #2e7d32;
  }

  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
`;

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Show initial welcome message when chat loads
  useEffect(() => {
    const welcomeMessage = {
      sender: 'bot',
      text: "🌿 Hello! How can I assist you today? Do you need help identifying a plant disease or caring for a specific plant?",
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (res.ok) {
        const botMessage = { sender: 'bot', text: data.response };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMsg = data.error || '🤖 Bot is overloaded. Please try again later.';
        setMessages((prev) => [...prev, { sender: 'bot', text: errorMsg }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: 'bot', text: '❌ Network error.' }]);
    }

    setLoading(false);
  };

  return (
    <Container>
      <Title>🌿 PlantBot Assistant</Title>

      <ChatBox>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>
            <strong>{msg.sender === 'bot' ? '🤖 Bot' : '🧑 You'}:</strong> {msg.text}
          </Message>
        ))}
      </ChatBox>

      <InputArea>
        <Input
          value={input}
          placeholder="Type a plant-related question..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </InputArea>
    </Container>
  );
};

export default ChatBot;
