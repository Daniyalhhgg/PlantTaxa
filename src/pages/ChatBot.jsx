import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
  background: url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6") center/cover no-repeat;
  min-height: 100vh;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &::before {
    content: "";
    background: rgba(0, 60, 30, 0.8);
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.6rem;
  color: #c8ffc8;
  margin-bottom: 30px;
`;

const ChatBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 25px;
  backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 400px;
`;

const Message = styled.div`
  align-self: ${props => props.user ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.user ? 'rgba(165, 214, 167, 0.9)' : 'rgba(178, 235, 242, 0.9)'};
  padding: 12px 18px;
  border-radius: 20px;
  max-width: 70%;
  color: #1b1b1b;
  font-size: 1rem;
`;

const InputArea = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
  width: 100%;
`;

const Input = styled.input`
  padding: 12px 20px;
  border-radius: 25px;
  border: 1px solid #ccc;
  width: 65%;
  font-size: 1rem;
  outline: none;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #43a047;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #2e7d32;
  }

  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "🌿 Hello! Ask me anything about plants, care, or diseases." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg = {
        sender: "bot",
        text: data.answer || "Sorry, I didn't get that."
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: Could not connect to server." }
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>🌱 PlantTaxa Chatbot</Title>
      <ChatBox>
        {messages.map((msg, idx) => (
          <Message key={idx} user={msg.sender === "user"}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </Message>
        ))}
      </ChatBox>
      <InputArea>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a plant-related question..."
        />
        <Button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </InputArea>
    </Container>
  );
};

export default Chatbot;
