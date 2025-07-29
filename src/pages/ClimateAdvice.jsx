import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FiSearch, FiInfo } from "react-icons/fi";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

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

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 40px;
  user-select: none;
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
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #357a38;
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
`;

const Result = styled.article`
  margin-top: 36px;
  background-color: #e8f5e9;
  border-left: 6px solid #4caf50;
  padding: 30px 36px;
  border-radius: 20px;
  color: #2e7d32;

  p {
    margin: 8px 0;
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
  font-size: 1.1rem;

  ul {
    list-style: inside disc;
    margin-top: 8px;
  }
`;

const InfoIcon = styled(FiInfo)`
  margin-left: 6px;
  color: #4caf50;
`;

const plantCategoryMap = {
  Apple: ["Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy"],
  Blueberry: ["Blueberry___healthy"],
  Cherry: ["Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy"],
  Corn: [
    "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
  ],
  Grape: ["Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy"],
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
  Apple: "Apple is a widely cultivated fruit...",
  Blueberry: "Blueberry plants thrive in acidic soils...",
  Cherry: "Cherry trees can get Powdery Mildew...",
  Corn: "Corn is susceptible to leaf spot diseases...",
  Grape: "Grapes are vulnerable to Black Rot and Blight...",
  Orange: "Orange trees face Huanglongbing (Citrus greening)...",
  Peach: "Peach trees may get bacterial spots...",
  "Bell Pepper": "Bell Peppers can get bacterial spots...",
  Potato: "Potatoes are prone to early and late blight...",
  Raspberry: "Raspberries are generally healthy...",
  Soybean: "Soybeans are healthy in this dataset...",
  Squash: "Squash can be affected by Powdery Mildew...",
  Strawberry: "Strawberries can have leaf scorch...",
  Tomato: "Tomatoes face many diseases including blights...",
};

const ClimateAdvice = () => {
  const [city, setCity] = useState("");
  const [plantType, setPlantType] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (e) => {
    e.preventDefault();

    if (!city.trim() || !plantType) {
      setError("Please fill in both city and plant type.");
      setWeather(null);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/climate`, {
        params: { city, plant: plantType },
      });
      setWeather(res.data);
    } catch {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const getAdvice = () => {
    if (!weather) return "";

    const { temperature, humidity, weather: condition } = weather;
    if (temperature > 35) return `🔥 High temp. Water ${plantType} early or late + provide shade.`;
    if (humidity > 80) return `💧 High humidity. Ensure drainage for ${plantType} to avoid fungus.`;
    if (condition.toLowerCase().includes("rain")) return `🌧 Rainy. Reduce watering & protect ${plantType}.`;
    if (temperature < 10) return `❄️ Cold. Cover or move ${plantType} indoors.`;
    return `✅ Conditions ideal for ${plantType}. Continue regular care.`;
  };

  return (
    <Container>
      <Card>
        <Title>☀️ Climate Adaptation for Plants</Title>

        <FormRow onSubmit={fetchWeather}>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city..." />
          <Select value={plantType} onChange={(e) => setPlantType(e.target.value)}>
            <option value="">Select Plant</option>
            {Object.keys(plantCategoryMap).map((plant) => (
              <option key={plant} value={plant}>
                {plant}
              </option>
            ))}
          </Select>
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"} {!loading && <FiSearch />}
          </Button>
        </FormRow>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        {plantType && (
          <PlantInfoBox>
            <Label>{plantType} Info <InfoIcon /></Label>
            <p>{plantDetails[plantType]}</p>
            <Label>Dataset Categories:</Label>
            <ul>
              {plantCategoryMap[plantType].map((cat) => (
                <li key={cat}>{cat.replace(/___/g, " - ").replace(/_/g, " ")}</li>
              ))}
            </ul>
          </PlantInfoBox>
        )}

        {weather && (
          <Result>
            <Label>Weather for {weather.city}</Label>
            <p><strong>Temperature:</strong> {weather.temperature}°C (Feels like {weather.feels_like}°C)</p>
            <p><strong>Humidity:</strong> {weather.humidity}%</p>
            <p><strong>Conditions:</strong> {weather.description}</p>
            <p><strong>Wind Speed:</strong> {weather.wind_speed} m/s</p>
            <Advice>{getAdvice()}</Advice>
          </Result>
        )}
      </Card>
    </Container>
  );
};

export default ClimateAdvice;
