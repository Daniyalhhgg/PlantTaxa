// ==== pages/Dashboard.js ====
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

// ====== Keyframe for horizontal scroll animation =====
const scrollLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

// ====== Styled Components ======
const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
`;

const Hero = styled.div`
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6") center/cover no-repeat;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  color: white;

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

const Header = styled.div`
  text-align: center;
  padding: 80px 20px 40px;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  color: #c8ffc8;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #e0f7e9;
`;

const CardTickerWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  overflow: hidden;
  padding: 40px 0;
  border-radius: 12px;
  box-sizing: border-box;
`;

const CardTicker = styled.div`
  display: flex;
  gap: 30px;
  animation: ${scrollLeft} 40s linear infinite;
  width: max-content;
`;

const Card = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 20px;
  width: 280px;
  height: 220px;
  border-radius: 18px;
  overflow: hidden;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
  color: #fff;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;
  flex-shrink: 0;

  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    z-index: 0;
    pointer-events: none;
    transition: background 0.3s ease;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);

    &::before {
      background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
    }
  }

  h3 {
    font-size: 1.4rem;
    margin-bottom: 5px;
    line-height: 1.2;
  }

  p {
    font-size: 0.9rem;
    line-height: 1.2;
    margin: 0;
  }
`;

// ====== Component ======
const Dashboard = () => {
  const cards = [
    {
      to: "/identify",
      bg: "/img2.jpg",
      title: "🌿 Identify Plants",
      desc: "Upload a plant image and get accurate species info using AI."
    },
    {
      to: "/disease-detect",
      bg: "/img3.jpg",
      title: "🦠 Disease Detection",
      desc: "Diagnose plant diseases from symptoms and get treatment tips."
    },
    {
      to: "/ChatBot",
      bg: "/img4.jpg",
      title: "🤖 AI Chat Bot",
      desc: "Ask plant care questions. Get AI-powered suggestions."
    },
    {
      to: "/forum",
      bg: "/img1.jpg",
      title: "💬 Community Forum",
      desc: "Chat with other users and experts."
    },
    {
      to: "/ClimateAdvice",
      bg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      title: "🌡️ Climate Info",
      desc: "Get climate-specific plant care advice."
    },
    {
      to: "/about",
      bg: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=800&q=80",
      title: "ℹ️ About Us",
      desc: "Learn more about our mission and team."
    },
    {
      to: "/contact",
      bg: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      title: "📞 Contact Us",
      desc: "Get in touch for support and inquiries."
    }
  ];

  // Duplicate cards for smooth infinite scroll
  const duplicatedCards = [...cards, ...cards];

  return (
    <Container>
      <Hero>
        <Header>
          <Title>Welcome to Your Dashboard</Title>
          <Subtitle>Manage your plant care with AI-powered tools</Subtitle>
        </Header>

        <CardTickerWrapper>
          <CardTicker>
            {duplicatedCards.map((card, i) => (
              <Card key={i} to={card.to} bg={card.bg}>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </Card>
            ))}
          </CardTicker>
        </CardTickerWrapper>
      </Hero>
    </Container>
  );
};

export default Dashboard;
