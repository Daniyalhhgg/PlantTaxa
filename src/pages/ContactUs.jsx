import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const API_BASE_URL =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    try {
      await axios.post(
        `${API_BASE_URL}/api/contact`,
        { name, email, message },
        { headers: { "Content-Type": "application/json" } }
      );
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Overlay />
      <Wrapper>
        {/* Left Side */}
        <InfoSection
          as={motion.div}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h1>Let’s Connect 🌱</h1>
          <p>
            Have questions, feedback, or ideas?  
            Our team at <strong>PlantTaxa</strong> would love to hear from you.  
            Drop us a message and we’ll get back shortly.
          </p>
          <ContactDetails>
            <span>📧 dd275507@gmail.com</span>
            <span>🌍 plant-taxaa.vercel.app</span>
          </ContactDetails>
        </InfoSection>

        {/* Right Side */}
        <FormCard
          as={motion.form}
          onSubmit={handleSubmit}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h2>Contact Us</h2>
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          {errors.name && <Error>{errors.name}</Error>}

          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          {errors.email && <Error>{errors.email}</Error>}

          <TextArea
            placeholder="Your Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            error={errors.message}
          />
          {errors.message && <Error>{errors.message}</Error>}

          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>

          {success === true && (
            <Success>✅ Message sent successfully!</Success>
          )}
          {success === false && (
            <Error>❌ Failed to send message. Try again later.</Error>
          )}
        </FormCard>
      </Wrapper>
    </Container>
  );
};

export default ContactUs;

/* 🎨 Styled Components */
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6")
    center/cover no-repeat;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 100, 30, 0.8),
    rgba(0, 50, 20, 0.9)
  );
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  max-width: 1000px;
  width: 100%;
  padding: 30px;
  z-index: 2;
`;

const InfoSection = styled.div`
  flex: 1;
  color: #fff;
  padding: 20px;
  h1 {
    font-size: 2.2rem;
    margin-bottom: 15px;
  }
  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const ContactDetails = styled.div`
  margin-top: 20px;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormCard = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 30px;
  color: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  h2 {
    margin-bottom: 20px;
    font-size: 1.8rem;
    color: #e8f5e9;
  }
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid ${({ error }) => (error ? "red" : "transparent")};
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.85);
  &:focus {
    outline: none;
    border-color: #2e7d32;
  }
`;

const TextArea = styled.textarea`
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid ${({ error }) => (error ? "red" : "transparent")};
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.85);
  resize: none;
  &:focus {
    outline: none;
    border-color: #2e7d32;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #66bb6a, #2e7d32);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 12px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 10px;
  transition: 0.3s;
  &:hover:not(:disabled) {
    transform: scale(1.05);
    background: linear-gradient(135deg, #43a047, #1b5e20);
  }
`;

const Success = styled.div`
  margin-top: 1rem;
  color: #c8e6c9;
  font-weight: 600;
  text-align: center;
`;

const Error = styled.div`
  margin-top: 0.3rem;
  color: #ff5252;
  font-weight: 500;
  font-size: 0.9rem;
`;

