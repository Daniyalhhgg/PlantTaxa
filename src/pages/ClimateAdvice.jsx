import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FiSearch, FiInfo } from "react-icons/fi";
import axios from "axios";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
`;

const Container = styled.main`
  min-height: 100vh;
  padding: 48px 16px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: white;

  background: url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6") center/cover no-repeat;
  background-size: cover;

  &::before {
    content: "";
    background: rgba(0, 60, 30, 0.8);
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
`;

const Card = styled.section`
  position: relative;
  z-index: 1;
  background: #fff;
  border-radius: 24px;
  padding: 48px 40px;
  max-width: 720px;
  width: 100%;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);
  animation: ${fadeIn} 0.6s ease forwards;
  color: #2e7d32;
`;

// ... rest of your styled components (Title, FormRow, Input, Select, Button, ErrorMsg, Result, Label, Advice, PlantInfoBox, InfoIcon)

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 40px;
  user-select: none;
  color: #2e7d32;
`;

const FormRow = styled.form`
  display: flex;
  gap: 20px;
  margin-bottom: 28px;
  flex-wrap: wrap;
  align-items: center;
`;

const Input = styled.input`
  flex: 1 1 180px;
  padding: 16px 22px;
  font-size: 1.15rem;
  border: 2px solid #81c784;
  border-radius: 16px;
  outline-offset: 2px;
  outline-color: transparent;
  transition: border-color 0.3s ease, outline-color 0.3s ease;
  &:focus {
    border-color: #388e3c;
    outline-color: #81c784;
  }
`;

const Select = styled.select`
  flex: 1 1 220px;
  padding: 16px 22px;
  font-size: 1.15rem;
  border: 2px solid #81c784;
  border-radius: 16px;
  outline-offset: 2px;
  outline-color: transparent;
  transition: border-color 0.3s ease, outline-color 0.3s ease;
  &:focus {
    border-color: #388e3c;
    outline-color: #81c784;
  }
`;

const Button = styled.button`
  flex-shrink: 0;
  background-color: #4caf50;
  border: none;
  color: white;
  font-size: 1.3rem;
  padding: 16px 28px;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  box-shadow: 0 6px 14px rgba(76, 175, 80, 0.4);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover,
  &:focus-visible {
    background-color: #357a38;
    box-shadow: 0 8px 20px rgba(53, 122, 56, 0.7);
    outline: none;
  }

  svg {
    margin-left: 10px;
    font-size: 1.6rem;
  }
`;

const ErrorMsg = styled.p`
  color: #d32f2f;
  font-weight: 700;
  margin: -20px 0 24px 0;
  font-size: 1.1rem;
  user-select: none;
`;

const Result = styled.article`
  margin-top: 36px;
  background-color: #e8f5e9;
  border-left: 6px solid #4caf50;
  padding: 30px 36px;
  border-radius: 20px;
  box-shadow: 0 8px 22px rgba(76, 175, 80, 0.18);
  user-select: none;
  color: #2e7d32;

  p {
    margin: 8px 0 16px 0;
    font-size: 1.15rem;
  }
`;

const Label = styled.h3`
  font-weight: 700;
  margin-bottom: 6px;
  font-size: 1.3rem;
`;

const Advice = styled.div`
  margin-top: 24px;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
`;

const PlantInfoBox = styled.section`
  margin-top: 28px;
  background: #c8e6c9;
  border-radius: 20px;
  padding: 28px 36px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  font-weight: 500;
  font-size: 1.1rem;
  user-select: none;
  color: #2e7d32;

  ul {
    list-style: inside disc;
    margin-top: 8px;
  }

  li {
    margin-bottom: 6px;
  }
`;

const InfoIcon = styled(FiInfo)`
  margin-left: 6px;
  vertical-align: middle;
  color: #4caf50;
  cursor: help;
`;

const plantCategoryMap = {
  Apple: [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
  ],
  Blueberry: ["Blueberry___healthy"],
  Cherry: [
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
  ],
  Corn: [
    "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
  ],
  Grape: [
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
  ],
  Orange: ["Orange___Haunglongbing_(Citrus_greening)"],
  Peach: ["Peach___Bacterial_spot", "Peach___healthy"],
  "Bell Pepper": ["Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy"],
  Potato: ["Potato___Early_blight", "Potato___Late_blight", "Potato___healthy"],
  Raspberry: ["Raspberry___healthy"],
  Soybean: ["Soybean___healthy"],
  Squash: ["Squash___Powdery_mildew"],
  Strawberry: ["Strawberry___Leaf_scorch", "Strawberry___healthy"],
  Tomato: [
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites_Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
  ],
};

const plantDetails = {
  Apple:
    "Apple is a widely cultivated fruit, prone to diseases like Apple Scab, Black Rot, and Cedar Apple Rust. Requires moderate watering and prefers temperate climates.",
  Blueberry:
    "Blueberry plants thrive in acidic soils and cooler climates. Generally healthy with few disease issues in this dataset.",
  Cherry:
    "Cherry (including sour) can get Powdery Mildew but otherwise prefers well-drained soils and moderate watering.",
  Corn:
    "Corn (maize) is susceptible to leaf spot diseases and rusts. Prefers warm weather with consistent watering.",
  Grape:
    "Grapes are vulnerable to Black Rot and Leaf Blight. Require good airflow and moderate watering.",
  Orange:
    "Orange trees face Huanglongbing (Citrus greening) disease. They thrive in warm climates and need lots of sun.",
  Peach:
    "Peach trees may get bacterial spots. They like warm climates and regular watering.",
  "Bell Pepper":
    "Bell Peppers can get bacterial spots. They prefer warm weather and consistent moisture.",
  Potato:
    "Potatoes are prone to early and late blight diseases. Require cool, moist conditions.",
  Raspberry:
    "Raspberries are generally healthy and require moist soil and partial sun.",
  Soybean:
    "Soybeans are healthy in this dataset and require warm climates with moderate watering.",
  Squash:
    "Squash plants can be affected by Powdery Mildew. They prefer sunny spots and moderate watering.",
  Strawberry:
    "Strawberries can have leaf scorch but are generally healthy. Require well-drained soil and moderate sun.",
  Tomato:
    "Tomatoes face many diseases including blights, molds, and viral infections. Require warm temperatures and balanced watering.",
};

const ClimateAdvice = () => {
  const [city, setCity] = useState("");
  const [plantType, setPlantType] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city.");
      setWeather(null);
      return;
    }
    if (!plantType) {
      setError("Please select a plant type.");
      setWeather(null);
      return;
    }

    setError("");
    setLoading(true);
    setWeather(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/climate?city=${encodeURIComponent(
          city
        )}&plant=${encodeURIComponent(plantType)}`
      );
      setWeather(res.data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      setWeather(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAdvice = () => {
    if (!weather) return "";

    const { temperature, humidity, weather: condition } = weather;

    if (temperature > 35) {
      return `High temperature detected. For ${plantType}, water your plants early morning or late evening and provide shade.`;
    } else if (humidity > 80) {
      return `High humidity detected. Ensure proper drainage for ${plantType} to prevent fungal infections.`;
    } else if (condition.toLowerCase().includes("rain")) {
      return `Rainy weather expected. Reduce watering and protect delicate ${plantType} plants.`;
    } else if (temperature < 10) {
      return `Cold conditions detected. Move sensitive ${plantType} plants indoors or cover them overnight.`;
    } else {
      return `Conditions are optimal for ${plantType}. Maintain regular watering and sun exposure.`;
    }
  };

  return (
    <Container>
      <Card aria-label="Climate adaptation tool">
        <Title tabIndex="0">☀️ Climate Adaptation for Plants</Title>

        <FormRow onSubmit={fetchWeather} aria-describedby="error-message">
          <Input
            type="text"
            aria-label="City name"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <Select
            aria-label="Select plant type"
            value={plantType}
            onChange={(e) => setPlantType(e.target.value)}
            required
          >
            <option value="">Select Plant Type</option>
            {Object.keys(plantCategoryMap).map((plant) => (
              <option key={plant} value={plant}>
                {plant}
              </option>
            ))}
          </Select>
          <Button type="submit" aria-label="Search climate data" disabled={loading}>
            {loading ? "Loading..." : "Search"}
            {!loading && <FiSearch aria-hidden="true" />}
          </Button>
        </FormRow>

        {error && <ErrorMsg id="error-message">{error}</ErrorMsg>}

        {plantType && (
          <PlantInfoBox aria-live="polite" aria-atomic="true">
            <Label>
              {plantType} Info <InfoIcon title="More info" aria-hidden="true" />
            </Label>
            <p>{plantDetails[plantType]}</p>
            <Label>Related Dataset Categories:</Label>
            <ul>
              {plantCategoryMap[plantType].map((cat) => (
                <li key={cat}>{cat.replace(/___/g, " - ").replace(/_/g, " ")}</li>
              ))}
            </ul>
          </PlantInfoBox>
        )}

        {weather && (
          <Result aria-live="polite" aria-atomic="true" tabIndex="0">
            <Label>Weather Details for {weather.city}:</Label>
            <p>
              <strong>Temperature:</strong> {weather.temperature}°C (Feels like{" "}
              {weather.feels_like}°C)
            </p>
            <p>
              <strong>Humidity:</strong> {weather.humidity}%
            </p>
            <p>
              <strong>Conditions:</strong> {weather.description}
            </p>
            <p>
              <strong>Wind Speed:</strong> {weather.wind_speed} m/s
            </p>

            <Advice>{getAdvice()}</Advice>
          </Result>
        )}
      </Card>
    </Container>
  );
};

export default ClimateAdvice;
