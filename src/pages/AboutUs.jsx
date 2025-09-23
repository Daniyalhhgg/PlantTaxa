import styled, { keyframes } from "styled-components";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaRobot,
  FaMobileAlt,
  FaLeaf,
  FaStore,
  FaUsers,
} from "react-icons/fa";

// 🌿 Animations
const fadeIn = keyframes`
  from {opacity: 0; transform: translateY(30px);}
  to {opacity: 1; transform: translateY(0);}
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const Wrapper = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f1f8e9, #e8f5e9);
  padding-bottom: 100px;
`;

/* 🌱 Hero Section */
const HeroSection = styled.div`
  background: url("/img7.jpg") no-repeat center center/cover;
  min-height: 80vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 60, 30, 0.5);
    backdrop-filter: blur(2px);
    z-index: 0;
  }

  > * {
    z-index: 1;
    animation: ${fadeIn} 1.2s ease forwards;
  }

  h1 {
    font-size: 4rem;
    margin-bottom: 16px;
    font-weight: 800;
    letter-spacing: 2px;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0,0,0,0.7);
  }

  p {
    font-size: 1.4rem;
    max-width: 700px;
    margin: 0 auto 30px;
    line-height: 1.6;
    color: #f5f5f5;
    text-shadow: 0 2px 6px rgba(0,0,0,0.6);
  }
`;

/* 🌱 Floating Leaves */
const FloatingLeaf = styled.div`
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.8);
  animation: ${float} 6s ease-in-out infinite;
  pointer-events: none;

  &:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  &:nth-child(2) {
    top: 60%;
    left: 85%;
    animation-delay: 1s;
  }
  &:nth-child(3) {
    top: 75%;
    left: 40%;
    animation-delay: 2s;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #43a047, #2e7d32);
  color: white;
  border: none;
  padding: 14px 40px;
  font-size: 1.1rem;
  border-radius: 35px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;

  &:hover {
    background: linear-gradient(135deg, #388e3c, #1b5e20);
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  }
`;

/* 🌱 Generic Section */
const Section = styled.section`
  padding: 80px 30px;
  max-width: 1100px;
  margin: 0 auto;
  scroll-margin-top: 100px;
`;

const Title = styled.h2`
  font-size: 2.8rem;
  color: #2e7d32;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
  position: relative;

  &::after {
    content: "";
    display: block;
    margin: 12px auto 0;
    width: 70px;
    height: 4px;
    border-radius: 2px;
    background: #66bb6a;
  }
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  line-height: 1.9;
  color: #444;
  text-align: justify;
  margin-bottom: 60px;
  font-weight: 400;

  ul {
    margin-top: 20px;
    padding-left: 20px;
    list-style: none;

    li {
      margin-bottom: 12px;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
`;

const FeatureIcon = styled.span`
  font-size: 1.3rem;
  color: #2e7d32;
`;

/* 🌱 Team Section */
const TeamGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
`;

const TeamCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 28px 24px;
  width: 280px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
  text-align: center;
  transition: transform 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 18px 40px rgba(0,0,0,0.3);
  }

  img {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
    border: 4px solid #2e7d32;
  }

  h4 {
    color: #2e7d32;
    font-size: 1.3rem;
    margin-bottom: 8px;
    font-weight: 700;
  }

  p {
    font-size: 1rem;
    color: #555;
    margin-bottom: 14px;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  color: #2e7d32;

  a {
    color: inherit;
    font-size: 1.3rem;
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
      color: #1b5e20;
      transform: scale(1.2);
    }
  }
`;

/* 🌱 Testimonials */
const TestimonialSection = styled.section`
  background: #dcedc8;
  padding: 60px 30px;
  max-width: 850px;
  margin: 100px auto 0 auto;
  border-radius: 18px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
  text-align: center;
`;

const TestimonialText = styled.p`
  font-size: 1.4rem;
  font-style: italic;
  color: #33691e;
  margin-bottom: 20px;
`;

const TestimonialAuthor = styled.h5`
  font-weight: 700;
  font-size: 1.1rem;
  color: #2e7d32;
`;

const AboutUs = () => {
  const scrollToStory = () => {
    const element = document.getElementById("our-story");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Wrapper>
      <HeroSection>
        {/* Floating leaves 🌿 */}
        <FloatingLeaf>🍃</FloatingLeaf>
        <FloatingLeaf>🌱</FloatingLeaf>
        <FloatingLeaf>🍂</FloatingLeaf>

        <div>
          <h1>PlantTaxa</h1>
          <p>
            Empowering all people to be plant people — combining AI and nature 
            to support the next generation of plant lovers and professionals.
          </p>
          <Button onClick={scrollToStory}>Learn More</Button>
        </div>
      </HeroSection>

      <Section id="our-story">
        <Title>Our Story</Title>
        <Paragraph>
          At <strong>PlantTaxa</strong>, our journey began with a simple
          question: <strong>What if technology could help us reconnect with nature?</strong>
          <br /><br />
          What started as a university research project is now evolving into
          a smart ecosystem for everyone — from weekend gardeners to professional
          botanists. Whether you're identifying a plant, checking for diseases,
          or getting tips tailored to your climate, PlantTaxa is your green companion.
          <br /><br />
          With a deep respect for biodiversity and the power of AI, we're
          reimagining the future of plant care — making it intelligent,
          accessible, and inspiring.
        </Paragraph>

        <Title>Vision & Future</Title>
        <Paragraph>
          <ul>
            <li><FeatureIcon><FaRobot /></FeatureIcon> AI-powered chatbot trained on thousands of plant species</li>
            <li><FeatureIcon><FaMobileAlt /></FeatureIcon> Seamless Web + Native Mobile apps</li>
            <li><FeatureIcon><FaStore /></FeatureIcon> E-commerce platform for curated plant tools & care kits</li>
            <li><FeatureIcon><FaUsers /></FeatureIcon> “Mali-as-a-Service” — book plant care professionals</li>
            <li><FeatureIcon><FaLeaf /></FeatureIcon> Climate-specific suggestions and guidance</li>
          </ul>
        </Paragraph>

        <Title>Meet Our Team</Title>
        <TeamGrid>
          <TeamCard>
            <img src="/dani.jpg" alt="Daniyal Z." />
            <h4>Daniyal Sabir</h4>
            <p>Full Stack Web Developer</p>
            <SocialIcons>
              <a href="https://www.linkedin.com/in/daniyal-sabir-76a01a324" target="_blank" rel="noreferrer"><FaLinkedin /></a>
              <a href="https://twitter.com/Danirajpoot8074" target="_blank" rel="noreferrer"><FaTwitter /></a>
              <a href="https://github.com/Daniyalhhgg" target="_blank" rel="noreferrer"><FaGithub /></a>
            </SocialIcons>
          </TeamCard>

          <TeamCard>
            <img src="/usama.jpg" alt="Usama bin Khalid" />
            <h4>Usama bin Khalid</h4>
            <p>React.js Developer & Tester</p>
            <SocialIcons>
              <a href="https://linkedin.com/in/usama" target="_blank" rel="noreferrer"><FaLinkedin /></a>
              <a href="https://twitter.com/usama" target="_blank" rel="noreferrer"><FaTwitter /></a>
              <a href="https://github.com/usama" target="_blank" rel="noreferrer"><FaGithub /></a>
            </SocialIcons>
          </TeamCard>

          <TeamCard>
            <img src="/umair.jpg" alt="Ali Umair" />
            <h4>Ali Umair</h4>
            <p>AI Engineer & Dataset Handler</p>
            <SocialIcons>
              <a href="https://linkedin.com/in/ali" target="_blank" rel="noreferrer"><FaLinkedin /></a>
              <a href="https://twitter.com/ali" target="_blank" rel="noreferrer"><FaTwitter /></a>
              <a href="https://github.com/ali" target="_blank" rel="noreferrer"><FaGithub /></a>
            </SocialIcons>
          </TeamCard>
        </TeamGrid>
      </Section>

      <TestimonialSection>
        <TestimonialText>
          “PlantTaxa has revolutionized how I care for my garden.  
          The AI suggestions are accurate and timely!”
        </TestimonialText>
        <TestimonialAuthor>🌍 plant-taxa.vercel.app</TestimonialAuthor>
      </TestimonialSection>
    </Wrapper>
  );
};

export default AboutUs;
