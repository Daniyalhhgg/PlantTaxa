import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getPlants } from "../utils/api";

const styles = {
  container: {
    fontFamily: "Poppins, sans-serif",
    background: "#f7f9f9",
    color: "#2c3e50",
  },
  heroSection: {
    background: "linear-gradient(135deg, #2ecc71, #27ae60)",
    color: "white",
    textAlign: "center",
    padding: "70px 20px",
    borderBottomLeftRadius: "40px",
    borderBottomRightRadius: "40px",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "10px",
  },
  heroText: {
    fontSize: "1.1rem",
    opacity: 0.9,
    maxWidth: "600px",
    margin: "0 auto 30px",
  },
  heroButton: {
    background: "#fff",
    color: "#27ae60",
    border: "none",
    borderRadius: "30px",
    padding: "14px 32px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  searchContainer: {
    textAlign: "center",
    margin: "40px 0 20px",
    padding: "0 20px",
  },
  searchInput: {
    padding: "12px 18px",
    width: "90%",
    maxWidth: "420px",
    borderRadius: "30px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "8px",
    marginTop: "15px",
  },
  filterButton: (active) => ({
    padding: "8px 18px",
    borderRadius: "25px",
    fontSize: "0.9rem",
    fontWeight: "600",
    border: active ? "2px solid #27ae60" : "1px solid #ddd",
    background: active ? "#eafaf1" : "white",
    color: active ? "#27ae60" : "#2c3e50",
    cursor: "pointer",
    transition: "all 0.3s ease",
  }),
  plantGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
    maxWidth: "1300px",
    margin: "0 auto 60px",
    padding: "0 15px",
  },
  plantCard: {
    background: "white",
    borderRadius: "16px",
    padding: "14px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "10px",
    transition: "transform 0.3s ease",
  },
  priceText: {
    margin: "8px 0",
    fontSize: "16px",
    color: "#27ae60",
    fontWeight: "600",
  },
  actionButton: {
    padding: "7px 14px",
    borderRadius: "25px",
    fontSize: "13px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
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
    fontSize: "22px",
    color: isFav ? "gold" : "#ccc",
    transition: "color 0.3s",
  }),
  modalOverlay: {
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
  },
  modalContent: {
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    maxWidth: "700px",
    width: "100%",
    textAlign: "center",
  },
  closeButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "25px",
    background: "#e74c3c",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

// 🌿 Inject responsive CSS
const injectResponsiveCSS = () => {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    @media (max-width: 768px) {
      #plantGrid {
        grid-template-columns: repeat(2, 1fr) !important; /* 📱 2 per row */
        gap: 14px !important;
      }
      .plant-card img {
        height: 140px !important;
      }
      .plant-card {
        padding: 10px !important;
      }
    }
    @media (min-width: 769px) {
      #plantGrid {
        grid-template-columns: repeat(4, 1fr) !important; /* 💻 4 per row */
      }
    }
    .plant-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    .plant-card img:hover {
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(styleTag);
};

const PlantShop = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();
  const plantSectionRef = useRef(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPlants();
      if (!data || data.error) {
        setError(data?.error || "Could not load plant list.");
        setPlants([]);
      } else {
        setPlants(data);
      }
    } catch {
      setError("Network error. Please try again.");
      setPlants([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlants();
    injectResponsiveCSS();
  }, [fetchPlants]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleBuy = (plantId) => navigate(`/checkout/${plantId}`);

  const toggleFavorite = (plant) => {
    setFavorites((prev) =>
      prev.find((fav) => fav._id === plant._id)
        ? prev.filter((fav) => fav._id !== plant._id)
        : [...prev, plant]
    );
  };

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

  if (loading) return <p style={{ textAlign: "center", padding: "20px" }}>🌿 Loading plants...</p>;
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
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <h1 style={styles.heroTitle}>🌱 Bring Nature Home</h1>
        <p style={styles.heroText}>
          Discover beautiful plants to brighten your space & purify the air.
        </p>
        <button
          style={styles.heroButton}
          onClick={() => plantSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          Shop Now
        </button>
      </section>

      {/* Search & Filters */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Search plants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.filters}>
          {["All", "Indoor", "Outdoor", "Succulent", "Flowering", "Favorites"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={styles.filterButton(filter === cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plants Grid */}
      <div ref={plantSectionRef} id="plantGrid" style={styles.plantGrid}>
        {(filter === "Favorites" ? favorites : filteredPlants).length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>No plants found.</p>
        ) : (
          (filter === "Favorites" ? favorites : filteredPlants).map((plant) => {
            const isFav = favorites.some((fav) => fav._id === plant._id);
            return (
              <div key={plant._id} className="plant-card" style={styles.plantCard}>
                <img
                  src={`${API_BASE_URL}${plant.imageUrl}`}
                  alt={plant.name}
                  style={styles.image}
                  onError={(e) => (e.target.src = "/fallback.png")}
                  onClick={() => setSelectedPlant(plant)}
                />
                <h3 style={{ fontSize: "16px", margin: "6px 0" }}>{plant.name}</h3>
                <p style={styles.priceText}>Rs. {plant.price}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "8px" }}>
                  <button onClick={() => handleBuy(plant._id)} style={{ ...styles.actionButton, ...styles.buyButton }}>
                    🛒 Buy
                  </button>
                  <button
                    onClick={() => setSelectedPlant(plant)}
                    style={{ ...styles.actionButton, ...styles.viewButton }}
                  >
                    👁 View
                  </button>
                  <span onClick={() => toggleFavorite(plant)} style={styles.favoriteStar(isFav)}>
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
        <div onClick={() => setSelectedPlant(null)} style={styles.modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} style={styles.modalContent}>
            <img
              src={`${API_BASE_URL}${selectedPlant.imageUrl}`}
              alt={selectedPlant.name}
              style={{
                width: "100%",
                maxHeight: "350px",
                objectFit: "contain",
                borderRadius: "12px",
                marginBottom: "15px",
              }}
            />
            <h2>{selectedPlant.name}</h2>
            <p style={{ fontSize: "18px", color: "#27ae60", margin: "8px 0" }}>
              <strong>Rs. {selectedPlant.price}</strong>
            </p>
            <p>{selectedPlant.description || "No description available."}</p>
            <button onClick={() => setSelectedPlant(null)} style={styles.closeButton}>
              ❌ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantShop;
