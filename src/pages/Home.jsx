import React, { useEffect, useState } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

// --- API & Defaults ---
const apiKey = "da43a500755e687710d089ea3b65877f";
const defaultCities = ["Lahore", "Karachi", "Islamabad"];

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components ---
const Container = styled.div`
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
  margin-bottom: 40px;
  animation: ${fadeIn} 1s ease;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  color: #c8ffc8;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #e0f7e9;
`;

const GetStartedButton = styled(Link)`
  display: inline-block;
  background: #4caf50;
  color: white;
  padding: 12px 30px;
  border-radius: 30px;
  margin-top: 20px;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  transition: 0.3s ease;

  &:hover {
    background: #2e7d32;
  }
`;

const SearchBar = styled.input`
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 30px;
  border: none;
  outline: none;
  margin: 20px auto 40px auto;
  width: 80%;
  max-width: 400px;
  display: block;
  background: rgba(255, 255, 255, 0.95);
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 22px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(14px);
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 18px;
  padding: 24px;
  width: 280px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  text-align: center;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-6px);
    background: rgba(255, 255, 255, 0.25);
  }
`;

const City = styled.h3`
  font-size: 1.5rem;
  color: #c8ffc8;
`;

const Info = styled.p`
  font-size: 1rem;
  margin: 4px 0;
  color: #e0f7e9;
`;

const Advice = styled.div`
  margin-top: 10px;
  background: rgba(60, 120, 60, 0.6);
  padding: 10px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 0.9rem;
  color: #d0ffd0;
`;

// --- Main Component ---
const Home = () => {
  const [searchCity, setSearchCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);

  const fetchWeather = async (citiesToFetch) => {
    const results = await Promise.all(
      citiesToFetch.map(async (city) => {
        try {
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
          );
          return { city, data: res.data };
        } catch (error) {
          return { city, data: null };
        }
      })
    );
    setWeatherData(results);
  };

  useEffect(() => {
    fetchWeather(defaultCities);
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchCity(value);
    if (!value.trim()) {
      fetchWeather(defaultCities);
    } else {
      fetchWeather([value.trim()]);
    }
  };

  const getAdvice = (data) => {
    if (!data) return "⚠️ Data unavailable";
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const condition = data.weather[0].main.toLowerCase();

    if (condition.includes("rain")) return "🌧️ Skip watering today";
    if (temp > 35) return "☀️ Provide shade & water";
    if (temp < 10) return "❄️ Move plants indoors";
    if (humidity < 40) return "🌫️ Increase misting";
    return "✅ Normal care needed";
  };

  return (
    <Container>
      <Header>
        <Title>🌿 Welcome to PlantTaxa</Title>
        <Description>
          AI-Powered Plant Identification, Disease Detection & Smart Climate Adaptation.
        </Description>
        <GetStartedButton to="/login">Get Started</GetStartedButton>
      </Header>

      <SearchBar
        type="text"
        placeholder="Search any Pakistani city (e.g., Faisalabad)..."
        value={searchCity}
        onChange={handleSearch}
      />

      <CardsWrapper>
        {weatherData.map(({ city, data }) => (
          <Card key={city}>
            <City>{city}</City>
            {data ? (
              <>
                <Info>🌡️ Temp: {data.main.temp}°C</Info>
                <Info>💧 Humidity: {data.main.humidity}%</Info>
                <Info>☁️ {data.weather[0].description}</Info>
                <Info>🌬️ Wind: {data.wind.speed} m/s</Info>
                <Advice>🌱 {getAdvice(data)}</Advice>
              </>
            ) : (
              <Info>⚠️ Weather not found</Info>
            )}
          </Card>
        ))}
      </CardsWrapper>
    </Container>
  );
};

export default Home;
