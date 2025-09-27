// ==== pages/Dashboard.js ====
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { FaRobot, FaBars } from "react-icons/fa";
import { removeToken } from "../utils/auth";

// --- Fake Orders ---
const fakeOrders = [
  { name: "Ali", plants: 4, avatar: "/avatars/a1.png" },
  { name: "Sara", plants: 2, avatar: "/avatars/a2.png" },
  { name: "Hassan", plants: 5, avatar: "/avatars/a3.png" },
  { name: "Ayesha", plants: 3, avatar: "/avatars/a4.png" },
  { name: "Bilal", plants: 1, avatar: "/avatars/a5.png" },
  { name: "Daniyal", plants: 6, avatar: "/avatars/a6.png" },
  { name: "Fatima", plants: 2, avatar: "/avatars/a7.png" },
  { name: "Zain", plants: 4, avatar: "/avatars/a8.png" },
  { name: "Hira", plants: 3, avatar: "/avatars/a9.png" },
  { name: "Usman", plants: 5, avatar: "/avatars/a10.png" },
];

// --- Styled Components ---
const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  background: #f9fafb;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  background: #1b5e20;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: sticky;
  top: 0;
  height: 100vh;
  transition: transform 0.3s ease;

  h2 {
    margin-bottom: 40px;
    font-size: 1.5rem;
    text-align: center;
    font-weight: 600;
  }
  a {
    color: white;
    text-decoration: none;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 10px;
    display: block;
    transition: 0.3s;
  }
  a:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: ${(props) =>
      props.open ? "translateX(0)" : "translateX(-100%)"};
    z-index: 1200;
  }
`;

const SidebarToggle = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: block;
    background: #1b5e20;
    color: white;
    border: none;
    font-size: 22px;
    padding: 10px 14px;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 10px;
    align-self: flex-start;
  }
`;

const Main = styled.div`
  flex: 1;
  padding: 20px 30px;
  position: relative;
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const AnnouncementBar = styled.div`
  background: #ffeb3b;
  color: #1b5e20;
  padding: 10px 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.9rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 10px;
    font-size: 0.85rem;
  }
`;

const OrderNowButton = styled.button`
  padding: 6px 14px;
  border: none;
  border-radius: 20px;
  background: #1b5e20;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #2e7d32;
  }
`;

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h1 {
    font-size: 1.6rem;
    color: #1b5e20;
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 1.2rem;
    }
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    opacity: 0.85;
  }
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 8px;
    border: 2px solid #1b5e20;
  }
  span {
    font-weight: 600;
    color: #1b5e20;
    font-size: 0.9rem;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-top: 20px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 18px;
  height: 160px;
  border-radius: 14px;
  background: url(${(props) => props.bg}) center/cover no-repeat;
  color: #fff;
  text-decoration: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 14px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
    z-index: 0;
  }
  > * {
    position: relative;
    z-index: 1;
  }
  &:hover {
    transform: scale(1.03);
  }
  h3 {
    margin: 0 0 6px;
    font-size: 1rem;
  }
  p {
    margin: 0;
    font-size: 0.8rem;
  }
`;

const CommunitySection = styled.div`
  margin-top: 20px;
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const CommunityHeader = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #1b5e20;
`;

const CommunityMessage = styled.div`
  padding: 10px;
  border-radius: 8px;
  background: #f1fdf1;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #e0f7e0;
  }
`;

const LogoutButton = styled.button`
  margin-top: auto;
  padding: 12px 16px;
  color: white;
  background: #e53935;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #c62828;
  }
`;

// 🚨 Order Alert
const OrderAlert = styled.div`
  position: fixed;
  top: ${(props) => (props.show ? "20px" : "-100px")};
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  color: #333;
  padding: 10px 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  transition: top 0.6s ease;
  z-index: 2000;
  font-size: 0.85rem;

  img {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    margin-right: 10px;
    border: 2px solid #1b5e20;
  }
`;

// --- Shop Section ---
const ShopSection = styled.div`
  margin-top: 25px;
  h2 {
    font-size: 1.3rem;
    margin-bottom: 15px;
    color: #1b5e20;
  }
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  text-align: center;
  transition: transform 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 8px;
  }
  p {
    margin: 0;
    font-weight: 600;
    color: #1b5e20;
    font-size: 0.9rem;
  }
  button {
    margin-top: 6px;
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    background: #1b5e20;
    color: white;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.85rem;
    &:hover {
      background: #2e7d32;
    }
  }
`;

const ChatBotButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 55px;
  height: 55px;
  background: #1b5e20;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 26px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s, background 0.2s;
  &:hover {
    transform: scale(1.1);
    background: #2e7d32;
  }
  z-index: 1000;
`;

const ChatBotMessageBox = styled.div`
  position: fixed;
  bottom: 85px;
  right: 20px;
  background: #1b5e20;
  color: white;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  max-width: 180px;
  text-align: center;
  animation: fadeIn 0.5s ease;
  z-index: 999;

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
`;

// --- API & Component ---
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [featureCards] = useState([
    { to: "/identify", bg: "/img2.jpg", title: "🌿 Identify Plants", desc: "Upload & recognize plant species" },
    { to: "/disease-detect", bg: "/img3.jpg", title: "🦠 Disease Detection", desc: "Detect leaf diseases instantly" },
    { to: "/ChatBot", bg: "/img4.jpg", title: "🤖 AI Chat Bot", desc: "Get AI-powered plant advice" },
    { to: "/forum", bg: "/img1.jpg", title: "💬 Community Forum", desc: "Chat with experts & users" },
  ]);

  const [communityMessages, setCommunityMessages] = useState([]);
  const [user, setUser] = useState({ name: "", photo: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUser({ name: data.name, photo: data.photo });
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchCommunityMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/forum`);
      const data = await res.json();
      const last3 = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setCommunityMessages(last3);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchCommunityMessages();
    const interval = setInterval(fetchCommunityMessages, 10000);
    return () => clearInterval(interval);
  }, [fetchProfile, fetchCommunityMessages]);

  // 🚨 Fake order alerts
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setCurrentOrder(fakeOrders[i % fakeOrders.length]);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      i++;
    }, 40000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const [topPlants] = useState([
    { id: 1, image: "/p1.jpg" },
    { id: 2, image: "/2.jpg" },
    { id: 3, image: "/p3.jpg" },
    { id: 4, image: "/p4.jpg" },
  ]);

  return (
    <Wrapper>
      {/* Sidebar toggle for mobile */}
      <Sidebar open={sidebarOpen}>
        <h2>PlantTaxa</h2>
        <Link to="/dashboard">🏠 Dashboard</Link>
        <Link to="/identify">🌿 Identify</Link>
        <Link to="/disease-detect">🦠 Disease Detect</Link>
        <Link to="/ChatBot">🤖 ChatBot</Link>
        <Link to="/forum">💬 Forum</Link>
        <Link to="/ClimateAdvice">🌡️ Climate Info</Link>
        <Link to="/contact">📞 Contact</Link>
        <LogoutButton onClick={handleLogout}>🚪 Logout</LogoutButton>
      </Sidebar>

      <Main>
        <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars />
        </SidebarToggle>

        <AnnouncementBar>
          <span>🚚 Free delivery available! Continue plant shopping now!</span>
          <OrderNowButton onClick={() => navigate("/PlantShop")}>
            Order Now
          </OrderNowButton>
        </AnnouncementBar>

        <Navbar>
          <h1>Welcome back 👋</h1>
          <ProfileContainer onClick={() => navigate("/profile")}>
            <img src={user.photo || "https://via.placeholder.com/40"} alt="Profile" />
            <span>{user.name || "Guest"}</span>
          </ProfileContainer>
        </Navbar>

        <CommunitySection>
          <CommunityHeader>💬 Live Tips Community</CommunityHeader>
          {communityMessages.length === 0 && <p>No messages yet.</p>}
          {communityMessages.map((msg) => (
            <CommunityMessage key={msg._id} onClick={() => navigate("/forum")}>
              <strong>{msg.user?.name || "Anonymous"}:</strong> {msg.content}
            </CommunityMessage>
          ))}
        </CommunitySection>

        <CardGrid>
          {featureCards.map((card, i) => (
            <Card key={i} to={card.to} bg={card.bg}>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </Card>
          ))}
        </CardGrid>

        {/* Shop Section */}
        <ShopSection>
          <h2>🔥 Top Selling Plants</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "15px",
            }}
          >
            {topPlants.map((plant) => (
              <ProductCard key={plant.id}>
                <img src={plant.image} alt={plant.name} />
                <p>{plant.name || "Popular Plant"}</p>
                <button onClick={() => navigate(`/shop/${plant.id}`)}>
                  Buy Now
                </button>
              </ProductCard>
            ))}
          </div>
        </ShopSection>

        {/* Chatbot Floating */}
        <ChatBotMessageBox>🌿 Care your plants! Click here for AI help.</ChatBotMessageBox>
        <ChatBotButton onClick={() => navigate("/ChatBot")}>
          <FaRobot />
        </ChatBotButton>

        {/* 🚨 Order Alert */}
        {currentOrder && (
          <OrderAlert show={showAlert}>
            <img src={currentOrder.avatar} alt={currentOrder.name} />
            <span>
              {currentOrder.name} just ordered {currentOrder.plants} plants!
            </span>
          </OrderAlert>
        )}
      </Main>
    </Wrapper>
  );
};

export default Dashboard;
