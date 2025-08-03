import { useState } from "react";
import styled from "styled-components";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const diseases = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Cherry_(including_sour)___Powdery_mildew',
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
  'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight',
  'Grape___Black_rot',
  'Grape___Esca_(Black_Measles)',
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
  'Grape___healthy',
  'Orange___Haunglongbing_(Citrus_greening)',
  'Peach___Bacterial_spot',
  'Peach___healthy',
  'Pepper,_bell___Bacterial_spot',
  'Squash___Powdery_mildew',
  'Strawberry___Leaf_scorch',
  'Tomato___Bacterial_spot',
  'Tomato___Septoria_leaf_spot',
  'Tomato___Spider_mites Two-spotted_spider_mite'
];

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

const Title = styled.h1`
  font-size: 2.5rem;
  color: #c8e6c9;
  margin-bottom: 25px;
  font-weight: bold;
  text-shadow: 1px 1px 3px #000;
`;

const DiseaseList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 30px;
`;

const DiseaseTag = styled.span`
  background-color: #66bb74ff;
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.95rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: all 0.3s ease;

  &:hover {
    background-color: #558b2f;
    transform: scale(1.05);
  }
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
  align-self: ${props => props.user ? 'flex-end' : 'flex-start'};
  background: ${props => props.user
    ? 'rgba(129, 199, 132, 0.3)'
    : 'linear-gradient(135deg, rgba(0,150,136,0.2), rgba(0,255,200,0.15))'};
  color: #000;
  padding: 14px 20px;
  border-radius: 18px;
  max-width: 75%;
  font-size: 1rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  border: ${props => props.user ? "1px solid #81c784" : "1px solid #4db6ac"};
  backdrop-filter: blur(4px);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.01);
  }
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

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "🌿 Hello! Ask me anything about plants, care, or diseases." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (msgText = input) => {
    if (!msgText.trim()) return;

    const userMsg = { sender: "user", text: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText }),
      });

      const data = await res.json();
      const botMsg = {
        sender: "bot",
        text: data.answer || "🤖 Daily sms request is full please wait after 24 hour Bot working fine ."
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

      <DiseaseList>
        {diseases.map((disease, idx) => (
          <DiseaseTag key={idx} onClick={() => sendMessage(`What is the solution for ${disease}?`)}>
            {disease.replaceAll("_", " ")}
          </DiseaseTag>
        ))}
      </DiseaseList>

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
        <Button onClick={() => sendMessage()} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </InputArea>
    </Container>
  );
};

export default Chatbot;
