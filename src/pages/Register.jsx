// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://192.168.100.146:5000"; // <-- mobile-ready

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(to right, #004d40, #1b5e20);
  color: #fff;
  flex-direction: row;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: url("https://images.unsplash.com/photo-1524593057779-586aff5ca88d") center/cover no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 60px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(0, 60, 0, 0.6);
  }

  @media (max-width: 900px) {
    height: 35vh;
    padding: 20px;
  }
`;

const FeaturesBox = styled.div`
  position: relative;
  z-index: 2;
  max-width: 500px;
  color: #e8f5e9;
  animation: ${fadeIn} 0.8s ease;

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin: 12px 0;
      font-size: 1rem;
      display: flex;
      align-items: center;
    }

    li::before {
      content: "🌿";
      margin-right: 8px;
    }
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  @media (max-width: 900px) {
    padding: 20px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  padding: 35px;
  color: #f0fff0;
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.25);
  animation: ${fadeIn} 0.6s ease;

  @media (max-width: 600px) {
    padding: 25px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid rgba(200, 255, 200, 0.2);
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
  font-size: 15px;

  &::placeholder {
    color: #cfcfcf;
  }

  &:focus {
    outline: 2px solid #81c784;
    background: rgba(255, 255, 255, 0.12);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;

  svg {
    position: absolute;
    top: 35%;
    right: 14px;
    cursor: pointer;
    color: #cfcfcf;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 18px;
  background: linear-gradient(45deg, #66bb6a, #43a047);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: linear-gradient(45deg, #57a05d, #2e7d32);
  }
`;

const CheckboxWrapper = styled.div`
  margin-top: 12px;
  text-align: left;
  font-size: 14px;
  color: #d0ffd0;

  input {
    margin-right: 8px;
    transform: scale(1.2);
    cursor: pointer;
  }

  button {
    background: none;
    border: none;
    color: #81c784;
    cursor: pointer;
    text-decoration: underline;
    font-size: 14px;
    padding: 0;
    margin: 0 4px;
  }
`;

const ParagraphBox = styled.div`
  margin-top: 10px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #e0f2f1;
  font-size: 14px;
  line-height: 1.5;
`;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeDoc, setActiveDoc] = useState(null);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const handleRegister = async () => {
    if (!name || !email || !password)
      return toast.error("All fields are required!");
    if (!validateEmail(email))
      return toast.warning("Only Gmail addresses ending in .com are allowed!");
    if (!acceptedTerms)
      return toast.error("You must accept Terms & Privacy!");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
    <PageWrapper>
      <LeftPanel>
        <FeaturesBox>
          <h1>Welcome to PlantTaxa 🌱</h1>
          <ul>
            <li>AI-powered plant disease detection</li>
            <li>Smart climate adaptation tips</li>
            <li>Community forum with experts</li>
            <li>Plant marketplace coming soon!</li>
          </ul>
        </FeaturesBox>
      </LeftPanel>

      <RightPanel>
        <Card>
          <h2>Create Your Account</h2>
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Gmail Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <EyeOff size={20} onClick={() => setShowPassword(false)} />
            ) : (
              <Eye size={20} onClick={() => setShowPassword(true)} />
            )}
          </PasswordWrapper>

          <CheckboxWrapper>
            <label>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              I accept the{" "}
              <button type="button" onClick={() => setActiveDoc("terms")}>
                Terms & Conditions
              </button>{" "}
              and{" "}
              <button type="button" onClick={() => setActiveDoc("privacy")}>
                Privacy Policy
              </button>
            </label>
          </CheckboxWrapper>

          {activeDoc === "terms" && (
            <ParagraphBox>
              Our Terms & Conditions ensure fair usage of PlantTaxa services.
              Users agree not to misuse the platform and respect community rules.
            </ParagraphBox>
          )}
          {activeDoc === "privacy" && (
            <ParagraphBox>
              Your privacy matters to us. We only collect necessary data for
              account creation and security. Your email is safe.
            </ParagraphBox>
          )}

          <Button onClick={handleRegister}>Register</Button>
          <p style={{ marginTop: "14px" }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Card>
      </RightPanel>

      <ToastContainer position="top-center" autoClose={3000} />
    </PageWrapper>
  );
};

export default Register;
