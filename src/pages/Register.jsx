// src/pages/Register.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  height: 100vh;
  background: url("https://images.unsplash.com/photo-1524593057779-586aff5ca88d") center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
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
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  color: #f0fff0;
  animation: ${fadeIn} 0.6s ease;
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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return toast.error("All fields are required!");
    }

    if (!validateEmail(email)) {
      return toast.warning("Only Gmail addresses ending in .com are allowed!");
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Registration failed");

      toast.success("Account created! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Wrapper>
      <Card>
        <h2>Create Your Account 🌿</h2>
        <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Gmail Address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleRegister}>Register</Button>
        <p style={{ marginTop: "10px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
      <ToastContainer position="top-center" autoClose={3000} />
    </Wrapper>
  );
};

export default Register;
