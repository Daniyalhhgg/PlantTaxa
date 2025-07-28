import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false); // Task 1: Loading state
  const [errors, setErrors] = useState({}); // Task 2: Form validation

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
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/contact`,
        { name, email, message },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Form submission response:", response.data); // Use response to avoid linting
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Form submission error:", error.response?.data || error.message);
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
      <ContentWrapper>
        <Title>Contact Us</Title>
        <Paragraph>
          Have a question or feedback? We'd love to hear from you! <br />
          📧 Email: <strong>F2021065221@umt.edu.pk</strong>
        </Paragraph>

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={errors.name}
          />
          {errors.name && <Error>{errors.name}</Error>}
          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={errors.email}
          />
          {errors.email && <Error>{errors.email}</Error>}
          <TextArea
            placeholder="Your Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            required
            error={errors.message}
          />
          {errors.message && <Error>{errors.message}</Error>}
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </Form>

        {success === true && <Success>✅ Message sent successfully!</Success>}
        {success === false && (
          <Error>❌ Failed to send message. Please try again later.</Error>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default ContactUs;

// Styled Components
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 60px 30px;
  font-family: 'Segoe UI', sans-serif;
  color: #2e7d32;
  overflow: hidden;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6") center/cover no-repeat;
    background-size: cover;
    z-index: -2;
  }

  &::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 100, 30, 0.6); /* dark green overlay */
    z-index: -1;
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.85); /* white translucent background */
  padding: 40px;
  max-width: 650px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #2e7d32;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  color: #444;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid ${({ error }) => (error ? "red" : "#ccc")};
  border-radius: 8px;
  &:focus {
    outline: none;
    border-color: ${({ error }) => (error ? "red" : "#2e7d32")};
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid ${({ error }) => (error ? "red" : "#ccc")};
  border-radius: 8px;
  resize: none;
  &:focus {
    outline: none;
    border-color: ${({ error }) => (error ? "red" : "#2e7d32")};
  }
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: 0.3s;

  &:hover:not(:disabled) {
    background-color: #2e7d32;
  }
`;

const Success = styled.div`
  margin-top: 1.5rem;
  color: #2e7d32;
  font-weight: 600;
  text-align: center;
`;

const Error = styled.div`
  margin-top: 0.5rem;
  color: red;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: left;
`;