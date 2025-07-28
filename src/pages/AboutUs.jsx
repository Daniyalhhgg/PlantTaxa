import styled, { keyframes } from "styled-components";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

const fadeIn = keyframes`
  from {opacity: 0; transform: translateY(20px);}
  to {opacity: 1; transform: translateY(0);}
`;

const Wrapper = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  padding-bottom: 100px;
`;

const HeroSection = styled.div`
  background: url("/img7.jpg") no-repeat center center/cover;
  min-height: 70vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  padding: 0 20px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 60, 30, 0.25);
    z-index: 0;
  }

  > * {
    z-index: 1;
    animation: ${fadeIn} 1.2s ease forwards;
  }

  h1 {
    font-size: 4rem;
    margin-bottom: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-shadow: 0 2px 6px rgba(0,0,0,0.5);
  }

  p {
    font-size: 1.5rem;
    max-width: 700px;
    margin: 0 auto 30px;
    line-height: 1.4;
    text-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }
`;

const Button = styled.button`
  background: #2e7d32;
  color: white;
  border: none;
  padding: 14px 36px;
  font-size: 1.1rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;

  &:hover {
    background: #276628;
    box-shadow: 0 4px 12px rgba(39,102,40,0.6);
  }
`;

const Section = styled.section`
  padding: 70px 30px;
  max-width: 1000px;
  margin: 0 auto;
  scroll-margin-top: 100px;
`;

const Title = styled.h2`
  font-size: 2.8rem;
  color: #2e7d32;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  line-height: 1.9;
  color: #444;
  text-align: justify;
  margin-bottom: 60px;
  font-weight: 400;
`;

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
  width: 270px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;

  &:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 15px 35px rgba(0,0,0,0.25);
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
    border: 4px solid #2e7d32;
  }

  h4 {
    color: #2e7d32;
    font-size: 1.3rem;
    margin-bottom: 10px;
    font-weight: 700;
  }

  p {
    font-size: 1rem;
    color: #666;
    margin-bottom: 12px;
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
    transition: color 0.3s ease;

    &:hover {
      color: #145214;
    }
  }
`;

const TestimonialSection = styled.section`
  background: #dcedc8;
  padding: 60px 20px;
  max-width: 800px;
  margin: 80px auto 0 auto;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  text-align: center;
`;

const TestimonialText = styled.p`
  font-size: 1.3rem;
  font-style: italic;
  color: #33691e;
  margin-bottom: 20px;
`;

const TestimonialAuthor = styled.h5`
  font-weight: 700;
  color: #2e7d32;
`;

const AboutUs = () => {
  const scrollToStory = () => {
    const element = document.getElementById("our-story");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Wrapper>
      <HeroSection>
        <div>
          <h1>PlantTaxa</h1>
          <p>
            Empowering all people to be plant people — combining AI and nature to support the next generation of plant lovers and professionals.
          </p>
          <Button onClick={scrollToStory}>Learn More</Button>
        </div>
      </HeroSection>

      <Section id="our-story">
        <Title>Our Story</Title>
        <Paragraph>
          “We’re going to make the experience of discovering, growing, and caring for plants as intelligent and enjoyable as the plants themselves.”
          <br /><br />
          PlantTaxa is a final-year research project driven by passion and purpose. Using advanced AI, we help users identify plants, detect diseases, and get climate-specific advice. Our mission is to make plant care easy, accurate, and community-powered.
        </Paragraph>

        <Title>Meet Our Team</Title>
        <TeamGrid>
          <TeamCard>
            <img src="/img2.jpg" alt="Daniyal Z." />
            <h4>Daniyal Z.</h4>
            <p>Full Stack web Developer</p>
            <SocialIcons>
              <a href="https://linkedin.com/in/daniyal" target="_blank" rel="noreferrer"><FaLinkedin /></a>
              <a href="https://twitter.com/daniyal" target="_blank" rel="noreferrer"><FaTwitter /></a>
              <a href="https://github.com/daniyal" target="_blank" rel="noreferrer"><FaGithub /></a>
            </SocialIcons>
          </TeamCard>

          <TeamCard>
            <img src="/img3.jpg" alt="Usama bin Khalid" />
            <h4>Usama bin Khalid</h4>
            <p>React.js Developer & Tester</p>
            <SocialIcons>
              <a href="https://linkedin.com/in/usama" target="_blank" rel="noreferrer"><FaLinkedin /></a>
              <a href="https://twitter.com/usama" target="_blank" rel="noreferrer"><FaTwitter /></a>
              <a href="https://github.com/usama" target="_blank" rel="noreferrer"><FaGithub /></a>
            </SocialIcons>
          </TeamCard>

          <TeamCard>
            <img src="/img4.jpg" alt="Ali Umair" />
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
          “PlantTaxa has revolutionized how I care for my garden. The AI suggestions are accurate and timely!”
        </TestimonialText>
        <TestimonialAuthor>— Sarah Green, Plant Enthusiast</TestimonialAuthor>
      </TestimonialSection>
    </Wrapper>
  );
};

export default AboutUs;
