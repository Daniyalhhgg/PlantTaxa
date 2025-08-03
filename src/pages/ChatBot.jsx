import { useState } from "react";
import styled from "styled-components";
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
  'Tomato___Spider_mites Two-spotted_spider_mite',

  
];


const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(to bottom right, #e8f5e9, #f1f8e9);
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2e7d32;
  margin-bottom: 25px;
  font-weight: bold;
`;

const DiseaseList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 30px;
`;

const DiseaseTag = styled.span`
  background-color: #66bb6a;
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.95rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #388e3c;
    transform: scale(1.05);
  }
`;

const ChatBox = styled.div`
  background-color: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  padding: 25px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
`;

const Message = styled.div`
  align-self: ${props => props.user ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.user ? '#c8e6c9' : '#b2ebf2'};
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 70%;
  font-size: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
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
    border-color: #43a047;
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
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText }),
      });

      const data = await res.json();
      const botMsg = {
        sender: "bot",
        text: data.answer || "🤖 No response from DeepSeek model."
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
