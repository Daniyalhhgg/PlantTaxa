import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const cities = ["Lahore", "Karachi", "Islamabad", "Multan", "Quetta", "Peshawar"];
const apiKey = "da43a500755e687710d089ea3b65877f";

const Wrapper = styled.div`
  font-family: 'Segoe UI', sans-serif;
  padding: 40px 20px;
  background: #f1f8e9;
  border-radius: 24px;
  max-width: 1280px;
  margin: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  text-align: center;
  color: #2e7d32;
  font-size: 2.4rem;
  margin-bottom: 35px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: linear-gradient(160deg, #ffffff, #e0f2f1);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;

  &:hover {
    background: #c8e6c9;
    transform: scale(1.03);
  }
`;

const City = styled.h3`
  font-size: 1.4rem;
  color: #1b5e20;
  margin-bottom: 10px;
`;

const Info = styled.p`
  font-size: 1rem;
  margin: 4px 0;
  color: #333;
`;

const Advice = styled.div`
  margin-top: 12px;
  background: #a5d6a7;
  padding: 10px;
  border-radius: 10px;
  font-weight: bold;
  color: #1b5e20;
  font-size: 0.9rem;
`;

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      const results = await Promise.all(
        cities.map(async (city) => {
          try {
            const res = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );
            return { city, data: res.data };
          } catch (error) {
            console.error(`Error for ${city}:`, error);
            return { city, data: null };
          }
        })
      );
      setWeatherData(results);
    };

    fetchWeather();
  }, []);

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
    <Wrapper>
      <Heading>🌍 Live Weather & Smart Plant Care</Heading>
      <Grid>
        {weatherData.map(({ city, data }) => (
          <Card key={city}>
            <City>{city}</City>
            {data ? (
              <>
                <Info>🌡️ Temp: {data.main.temp}°C</Info>
                <Info>💧 Humidity: {data.main.humidity}%</Info>
                <Info>☁️ Condition: {data.weather[0].description}</Info>
                <Info>🌬️ Wind: {data.wind.speed} m/s</Info>
                <Advice>🌱 {getAdvice(data)}</Advice>
              </>
            ) : (
              <Info>⚠️ Weather data unavailable</Info>
            )}
          </Card>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default WeatherWidget;
