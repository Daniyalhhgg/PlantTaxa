import React, { useEffect, useState } from "react";
import API from "../utils/api";

const PlantShop = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      const data = await API.getPlants();
      if (!data || data.error) {
        setError(data?.error || "Could not load plant list. Please try again later.");
        setPlants([]);
      } else {
        setPlants(data);
        setError("");
      }
      setLoading(false);
    };
    fetchPlants();
  }, []);

  const handleBuy = async (plantId) => {
    const result = await API.buyPlant(plantId);
    if (result.error) {
      alert("Error: " + result.error);
    } else {
      alert("Order placed successfully!");
    }
  };

  // Filter plants by search term, then push non-matches to bottom
  const filteredPlants = plants
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .concat(plants.filter(p => !p.name.toLowerCase().includes(searchTerm.toLowerCase())));

  if (loading) return <p style={{ padding: "20px" }}>Loading plants...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>🌱 Plant Shop</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search plants by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "30px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      {plants.length === 0 ? (
        <p>No plants available right now.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {filteredPlants.map((plant) => (
            <div
              key={plant._id}
              style={{
                borderRadius: "12px",
                padding: "16px",
                textAlign: "center",
                background: "white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
              }}
            >
              {plant.imageUrl && (
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                />
              )}
              <h3 style={{ margin: "10px 0", fontSize: "18px" }}>{plant.name}</h3>
              <p style={{ margin: "6px 0", fontSize: "15px" }}>
                <strong>${plant.priceUSD || plant.price}</strong>{" "}
                {plant.pricePKR && (
                  <span style={{ color: "#555" }}>({plant.pricePKR} PKR)</span>
                )}
              </p>
              {plant.description && (
                <p style={{
                  fontSize: "14px",
                  color: "#666",
                  margin: "8px 0",
                  minHeight: "40px",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {plant.description}
                </p>
              )}
              <button
                onClick={() => handleBuy(plant._id)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginTop: "10px",
                  fontSize: "15px",
                }}
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantShop;
