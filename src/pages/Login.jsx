// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { setToken } from "../utils/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.trim() || "http://localhost:5000";

// 🌿 Background gradient animation
const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #2e7d32, #66bb6a, #1b5e20, #81c784);
  background-size: 400% 400%;
  animation: ${gradient} 12s ease infinite;
  position: relative;
  overflow: hidden;
`;

// 🍃 Floating leaves
const Leaf = styled.div`
  position: absolute;
  width: 28px;
  height: 28px;
  background: url("https://cdn-icons-png.flaticon.com/512/766/766378.png")
    center/contain no-repeat;
  animation: float 14s linear infinite;
  opacity: 0.2;

  @keyframes float {
    0% {
      transform: translateY(110vh) rotate(0deg);
      left: ${(props) => props.left}%;
    }
    100% {
      transform: translateY(-20vh) rotate(360deg);
      left: ${(props) => props.left}%;
    }
  }
`;

const Card = styled.div`
  z-index: 2;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px);
  border-radius: 18px;
  padding: 45px 38px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  color: #fff;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  animation: fadeIn 1.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 700;
  color: #e8f5e9;
`;

const SubText = styled.p`
  font-size: 14px;
  margin-bottom: 28px;
  color: #c8e6c9;
`;

const InputWrapper = styled.div`
  position: relative;
  margin: 12px 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 10px;
  border: none;
  background-color: rgba(255, 255, 255, 0.18);
  color: white;
  font-size: 15px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #ddd;
  }

  &:focus {
    outline: 2px solid #a5d6a7;
    background-color: rgba(255, 255, 255, 0.28);
    box-shadow: 0 0 8px rgba(165, 214, 167, 0.6);
  }
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #c8e6c9;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 22px;
  background: linear-gradient(135deg, #43a047, #2e7d32);
  color: white;
  font-weight: bold;
  font-size: 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: linear-gradient(135deg, #2e7d32, #1b5e20);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
  }
`;

const Footer = styled.div`
  margin-top: 20px;
  font-size: 13px;
  color: #e8f5e9;
  text-align: center;

  a {
    color: #8fd581;
    text-decoration: none;
    font-weight: 600;
    transition: 0.3s;

    &:hover {
      color: #c5e1a5;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("⚠️ All fields are required!");
    }

    if (!validateEmail(email)) {
      return toast.warning("📧 Invalid email format.");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let errorMsg = "❌ Login failed";
        try {
          const errData = await res.json();
          errorMsg = errData.msg || errData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await res.json();
      if (!data.token) {
        throw new Error("⚠️ No token received from server");
      }

      setToken(data.token);
      toast.success("✅ Login successful!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error("❌ Login error:", err);
      toast.error(err.message || "Network error, please try again.");
    }
  };

  return (
    <Wrapper>
      {/* Floating leaves for aesthetics */}
      {[10, 30, 50, 70, 90].map((pos, i) => (
        <Leaf key={i} left={pos} />
      ))}

      <Card>
        <Title>PlantTaxa 🌿</Title>
        <SubText>Smart AI solutions for plant identification</SubText>

        <InputWrapper>
          <Input
            type="email"
            placeholder="Enter your Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputWrapper>

        <InputWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <EyeIcon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </EyeIcon>
        </InputWrapper>

        <Button onClick={handleLogin}>Login</Button>

        <Footer>
          Don’t have an account? <Link to="/register">Register here</Link>
        </Footer>
      </Card>

      <ToastContainer position="top-center" autoClose={3000} />
    </Wrapper>
  );
};

export default Login;
