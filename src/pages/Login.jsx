// src/pages/Login.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setToken } from "../utils/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wrapper = styled.div`
  background: url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6") center/cover no-repeat;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(0, 30, 0, 0.6);
    z-index: 1;
  }
`;

const Card = styled.div`
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 40px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin: 10px 0;
  border-radius: 8px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;

  &::placeholder {
    color: #ccc;
  }

  &:focus {
    outline: 2px solid #81c784;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background-color: #66bb6a;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #43a047;
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("All fields are required!");
    }

    if (!validateEmail(email)) {
      return toast.warning("Invalid email format.");
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");

      setToken(data.token);
      toast.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Wrapper>
      <Card>
        <h2>Login to PlantTaxa 🌿</h2>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleLogin}>Login</Button>
        <p style={{ marginTop: "12px" }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </Card>
      <ToastContainer position="top-center" autoClose={3000} />
    </Wrapper>
  );
};

export default Login;
