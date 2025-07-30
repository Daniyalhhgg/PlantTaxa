import React, { useState } from "react";
import { FiSearch, FiInfo } from "react-icons/fi";
import axios from "axios";

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
    <>
      <main className="main-container">
        <section className="card">
          <h1 className="title">
            <span role="img" aria-label="sun">☀️</span> Climate Adaptation for Plants
          </h1>

          <form className="form" onSubmit={fetchWeather}>
            <input
              type="text"
              className="input"
              aria-label="City name"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <select
              className="select"
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
            </select>
            <button
              type="submit"
              className="button"
              aria-label="Search climate data"
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
              {!loading && <FiSearch className="search-icon" aria-hidden="true" />}
            </button>
          </form>

          {error && (
            <p className="error" id="error-message">
              {error}
            </p>
          )}

          {plantType && (
            <section className="plant-info" aria-live="polite" aria-atomic="true">
              <h3 className="plant-info-title">
                {plantType} Info <FiInfo className="info-icon" title="More info" aria-hidden="true" />
              </h3>
              <p className="plant-info-text">{plantDetails[plantType]}</p>
              <h3 className="plant-info-subtitle">Related Dataset Categories:</h3>
              <ul className="plant-info-list">
                {plantCategoryMap[plantType].map((cat) => (
                  <li key={cat}>{cat.replace(/___/g, " - ").replace(/_/g, " ")}</li>
                ))}
              </ul>
            </section>
          )}

          {weather && (
            <article className="weather-result" aria-live="polite" aria-atomic="true" tabIndex="0">
              <h3 className="weather-title">Weather Details for {weather.city}:</h3>
              <p className="weather-text">
                <strong>Temperature:</strong> {weather.temperature}°C (Feels like {weather.feels_like}°C)
              </p>
              <p className="weather-text">
                <strong>Humidity:</strong> {weather.humidity}%
              </p>
              <p className="weather-text">
                <strong>Conditions:</strong> {weather.description}
              </p>
              <p className="weather-text">
                <strong>Wind Speed:</strong> {weather.wind_speed} m/s
              </p>
              <div className="advice">{getAdvice()}</div>
            </article>
          )}
        </section>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .main-container {
          min-height: 100vh;
          background: linear-gradient(to bottom right, #1a3c34, #2e7d32, #2dd4bf);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        @media (min-width: 640px) {
          .main-container {
            padding: 2rem;
          }
        }

        .card {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          padding: 1.5rem;
          max-width: 48rem;
          width: 100%;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.5s ease;
          animation: fadeIn 0.6s ease;
        }

        @media (min-width: 640px) {
          .card {
            padding: 2.5rem;
          }
        }

        .card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1a3c34;
          margin-bottom: 2rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        @media (min-width: 640px) {
          .title {
            font-size: 2.25rem;
          }
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 640px) {
          .form {
            flex-direction: row;
          }
        }

        .input,
        .select {
          flex: 1;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 2px solid #86efac;
          outline: none;
          background: #f9fafb;
          color: #1f2937;
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .input:focus,
        .select:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(134, 239, 172, 0.5);
        }

        .input::placeholder {
          color: #9ca3af;
        }

        .button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #16a34a;
          color: white;
          font-weight: 600;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        .button:hover,
        .button:focus-visible {
          background: #15803d;
          box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.2);
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .search-icon {
          margin-left: 0.5rem;
        }

        .error {
          color: #dc2626;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .plant-info {
          background: #f0fdf4;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.6s ease;
        }

        .plant-info-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a3c34;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .plant-info-text {
          color: #4b5563;
          margin-bottom: 1rem;
        }

        .plant-info-subtitle {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a3c34;
          margin-bottom: 0.5rem;
        }

        .plant-info-list {
          list-style: disc;
          list-style-position: inside;
          color: #4b5563;
        }

        .info-icon {
          color: #16a34a;
        }

        .weather-result {
          background: #e5f6fd;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.6s ease;
        }

        .weather-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0e7490;
          margin-bottom: 1rem;
        }

        .weather-text {
          color: #4b5563;
          margin-bottom: 0.5rem;
        }

        .advice {
          font-size: 1.125rem;
          font-weight: 600;
          color: #0e7490;
          background: #cffafe;
          padding: 1rem;
          border-radius: 0.75rem;
        }
      `}</style>
    </>
  );
};

export default ClimateAdvice;