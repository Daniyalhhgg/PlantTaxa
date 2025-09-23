import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getPlants } from "../utils/api";

const styles = {
  heroSection: {
    background: "linear-gradient(135deg, #2ecc71, #27ae60)",
    color: "white",
    padding: "12px 5px",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  heroText: {
    fontSize: "18px",
    marginBottom: "25px",
  },
  heroButton: {
    padding: "12px 28px",
    background: "white",
    color: "#27ae60",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  containerFont: {
    fontFamily: "Poppins, sans-serif",
  },
  searchInput: {
    padding: "12px 16px",
    width: "90%",
    maxWidth: "400px",
    fontSize: "16px",
    borderRadius: "25px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    outline: "none",
  },
  filterButton: (active) => ({
    margin: "5px",
    padding: "8px 16px",
    borderRadius: "20px",
    border: active ? "2px solid #27ae60" : "1px solid #ccc",
    background: active ? "#eafaf1" : "white",
    cursor: "pointer",
    fontWeight: "600",
  }),
  plantGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1300px",
    margin: "0 auto 60px",
    padding: "0 20px",
  },
  plantCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "18px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },
  priceText: {
    margin: "8px 0",
    fontSize: "17px",
    color: "#27ae60",
    fontWeight: "bold",
  },
  actionButton: {
    padding: "8px 16px",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
    transition: "opacity 0.3s ease",
  },
  buyButton: {
    background: "linear-gradient(135deg, #2ecc71, #27ae60)",
    color: "white",
  },
  viewButton: {
    background: "#f4f6f7",
    border: "1px solid #ddd",
  },
  favoriteStar: (isFav) => ({
    cursor: "pointer",
    fontSize: "26px",
    color: isFav ? "gold" : "#ccc",
    transition: "color 0.3s ease, transform 0.2s",
  }),
};

const PlantShop = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage initially
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();
  const plantSectionRef = useRef(null);

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPlants();
      if (!data || data.error) {
        setError(data?.error || "Could not load plant list. Please try again later.");
        setPlants([]);
      } else {
        setPlants(data);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setPlants([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  useEffect(() => {
    // Save favorites to localStorage whenever it changes
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleBuy = (plantId) => {
    navigate(`/checkout/${plantId}`);
  };

  const toggleFavorite = useCallback(
    (plant) => {
      setFavorites((prev) =>
        prev.find((fav) => fav._id === plant._id)
          ? prev.filter((fav) => fav._id !== plant._id)
          : [...prev, plant]
      );
    },
    []
  );

  const filteredPlants = useMemo(() => {
    return plants.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "All" ||
        (filter === "Favorites"
          ? favorites.some((fav) => fav._id === p._id)
          : p.category && p.category.toLowerCase() === filter.toLowerCase());
      return matchesSearch && matchesFilter;
    });
  }, [plants, searchTerm, filter, favorites]);

  const scrollToPlants = () => {
    if (plantSectionRef.current) {
      plantSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>🌿 Loading plants...</p>;
  if (error)
    return (
      <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
        ❌ Error: {error}
        <br />
        <button onClick={fetchPlants} style={{ marginTop: 12, cursor: "pointer" }}>
          🔄 Retry
        </button>
      </div>
    );

  return (
    <div style={styles.containerFont}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>🌱 Bring Nature Home</h1>
        <p style={styles.heroText}>
          Discover beautiful plants to brighten your space & purify the air.
        </p>
        <button onClick={scrollToPlants} style={styles.heroButton}>
          Shop Now
        </button>
      </div>

      {/* Search & Filters */}
      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <input
          type="text"
          placeholder="🔍 Search plants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
          aria-label="Search plants"
        />
        <div style={{ marginTop: "10px" }}>
          {["All", "Indoor", "Outdoor", "Succulent", "Flowering", "Favorites"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={styles.filterButton(filter === cat)}
              aria-pressed={filter === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plant Cards Section */}
      <div ref={plantSectionRef} style={styles.plantGrid}>
        {(filter === "Favorites" ? favorites : filteredPlants).length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>No plants found.</p>
        ) : (
          (filter === "Favorites" ? favorites : filteredPlants).map((plant) => {
            const isFav = favorites.some((fav) => fav._id === plant._id);
            return (
              <div
                key={plant._id}
                style={styles.plantCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                }}
              >
                {plant.imageUrl && (
                  <img
                    src={`http://localhost:5000${plant.imageUrl}`}
                    alt={plant.name}
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "14px",
                      marginBottom: "14px",
                    }}
                    onClick={() => setSelectedPlant(plant)}
                    onError={(e) => (e.target.src = "/fallback.png")}
                  />
                )}
                <h3 style={{ margin: "10px 0", fontSize: "20px", fontWeight: "600", color: "#2c3e50" }}>
                  {plant.name}
                </h3>
                {plant.category && (
                  <p
                    style={{
                      margin: "4px 0",
                      fontSize: "14px",
                      color: "#7f8c8d",
                      fontStyle: "italic",
                    }}
                  >
                    {plant.category}
                  </p>
                )}
                <p style={styles.priceText}>Rs. {plant.price}</p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <button
                    onClick={() => handleBuy(plant._id)}
                    style={{ ...styles.actionButton, ...styles.buyButton }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    aria-label={`Buy ${plant.name}`}
                  >
                    🛒 Buy
                  </button>
                  <button
                    onClick={() => setSelectedPlant(plant)}
                    style={{ ...styles.actionButton, ...styles.viewButton }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#ecf0f1")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#f4f6f7")}
                    aria-label={`View details of ${plant.name}`}
                  >
                    👁 View
                  </button>

                  <span
                    onClick={() => toggleFavorite(plant)}
                    style={styles.favoriteStar(isFav)}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") toggleFavorite(plant);
                    }}
                    aria-pressed={isFav}
                    aria-label={isFav ? `Remove ${plant.name} from favorites` : `Add ${plant.name} to favorites`}
                  >
                    {isFav ? "★" : "☆"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {selectedPlant && (
        <div
          onClick={() => setSelectedPlant(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "10px",
            overflowY: "auto",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "15px",
              maxWidth: "700px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            <img
              src={`http://localhost:5000${selectedPlant.imageUrl}`}
              alt={selectedPlant.name}
              style={{
                width: "100%",
                maxHeight: "350px",
                objectFit: "contain",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
              onError={(e) => (e.target.src = "/fallback.png")}
            />
            <h2
              id="modal-title"
              style={{ fontSize: "22px", marginBottom: "8px", color: "#2c3e50" }}
            >
              {selectedPlant.name}
            </h2>
            {selectedPlant.category && (
              <p
                style={{
                  fontSize: "14px",
                  color: "#888",
                  marginBottom: "8px",
                  fontStyle: "italic",
                }}
              >
                {selectedPlant.category}
              </p>
            )}
            <p style={{ fontSize: "18px", color: "#27ae60", marginBottom: "12px" }}>
              <strong>Rs. {selectedPlant.price}</strong>
            </p>
            <p
              style={{ fontSize: "15px", color: "#444", marginBottom: "20px", lineHeight: "1.6" }}
            >
              {selectedPlant.description || "No description available."}
            </p>
            <button
              onClick={() => setSelectedPlant(null)}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "25px",
                background: "#e74c3c",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              aria-label="Close plant details"
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantShop;
