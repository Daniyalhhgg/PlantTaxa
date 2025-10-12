// ==== pages/Dashboard.js ====
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { FaRobot, FaBars, FaHome, FaLeaf, FaVirus, FaComments, FaPhone, FaThermometerHalf } from "react-icons/fa";
import { removeToken } from "../utils/auth";

// ===== Fake Data =====
const fakeOrders = [
  { name: "Ali", plants: 4, avatar: "/avatars/a1.png" },
  { name: "Sara", plants: 2, avatar: "/avatars/a2.png" },
  { name: "Hassan", plants: 5, avatar: "/avatars/a3.png" },
  { name: "Ayesha", plants: 3, avatar: "/avatars/a4.png" },
  { name: "Bilal", plants: 1, avatar: "/avatars/a5.png" },
];

// ===== Styled Components =====
const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  background: #f4f7fa;
  overflow-x: hidden;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #1b5e20;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 2000;
  position: fixed;
  top: 0;
  left: ${({ open }) => (open ? "0" : "-260px")};
  height: 100%;
  transition: left 0.3s ease;
  @media (min-width: 1025px) {
    position: sticky;
    left: 0;
    height: 100vh;
    transition: none;
  }
  h2 {
    margin-bottom: 30px;
    text-align: center;
    font-size: 1.6rem;
    letter-spacing: 1px;
  }
  a {
    color: white;
    text-decoration: none;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    transition: 0.3s;
  }
  a:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Overlay = styled.div`
  display: ${({ open }) => (open ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1000;
  @media (min-width: 1025px) {
    display: none;
  }
`;

const Main = styled.div`
  flex: 1;
  padding: 25px;
  margin-left: 0;
  transition: margin 0.3s ease;
  @media (min-width: 1025px) {
    margin-left: 250px;
  }
`;

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  h1 {
    font-size: 1.8rem;
    color: #1b5e20;
  }
  .menu-icon {
    display: none;
    font-size: 1.8rem;
    color: #1b5e20;
    cursor: pointer;
  }
  @media (max-width: 1024px) {
    .menu-icon {
      display: block;
    }
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #1b5e20;
    margin-right: 8px;
    object-fit: cover;
  }
  span {
    font-weight: 600;
    color: #1b5e20;
  }
  @media (max-width: 480px) {
    span { display: none; }
  }
`;

const AnnouncementBar = styled.div`
  background: #ffeb3b;
  color: #1b5e20;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const OrderNowButton = styled.button`
  background: #1b5e20;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #2e7d32; }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  height: 180px;
  border-radius: 14px;
  background: url(${props => props.bg}) center/cover no-repeat;
  color: #fff;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: transform 0.3s;
  &:hover { transform: translateY(-5px); }
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
    border-radius: 14px;
  }
  h3,p { position: relative; z-index:1; margin:0; }
  h3 { font-size:1.1rem; font-weight:600; }
  p { font-size:0.9rem; }
`;

const CommunitySection = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 30px;
  h2 { margin-bottom:15px; color:#1b5e20; }
`;

const CommunityMessage = styled.div`
  background:#f1fdf1;
  padding:10px 14px;
  border-radius:8px;
  margin-bottom:8px;
  cursor:pointer;
  transition:0.3s;
  &:hover { background:#d8f6d8; }
`;

const ShopSection = styled.div`
  h2 { color:#1b5e20; margin-bottom:20px; }
  .plant-grid {
    display:grid;
    grid-template-columns: repeat(auto-fit,minmax(160px,1fr));
    gap:15px;
  }
`;

const ProductCard = styled.div`
  background:#fff;
  border-radius:16px;
  box-shadow:0 4px 14px rgba(0,0,0,0.1);
  text-align:center;
  overflow:hidden;
  transition:0.3s;
  &:hover{ transform: translateY(-5px); }
  img{ width:100%; height:120px; object-fit:cover; }
  p{ font-weight:600; color:#1b5e20; padding:8px 0; }
  button{
    margin-bottom:10px;
    padding:6px 12px;
    border:none;
    border-radius:6px;
    background:#1b5e20;
    color:white;
    font-weight:600;
    cursor:pointer;
  }
`;

const LogoutButton = styled.button`
  margin-top:auto;
  background:#e53935;
  color:white;
  border:none;
  border-radius:8px;
  padding:12px;
  font-weight:600;
  cursor:pointer;
  &:hover{ background:#c62828; }
`;

const ChatBotButton = styled.button`
  position:fixed;
  bottom:25px;
  right:25px;
  background:#1b5e20;
  border:none;
  border-radius:50%;
  width:55px; height:55px;
  font-size:26px;
  color:white;
  box-shadow:0 4px 12px rgba(0,0,0,0.3);
  cursor:pointer;
  z-index:1000;
`;

// ===== Component =====
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [featureCards] = useState([
    { to:"/identify", bg:"/img2.jpg", title:"Identify", desc:"Find plant names" },
    { to:"/disease-detect", bg:"/img3.jpg", title:"Detect", desc:"Leaf disease check" },
    { to:"/ChatBot", bg:"/img4.jpg", title:"Chat Bot", desc:"AI plant help" },
    { to:"/forum", bg:"/img1.jpg", title:"Forum", desc:"Community chat" },
  ]);
  const [topPlants]=useState([{id:1,image:"/p1.jpg"},{id:2,image:"/2.jpg"},{id:3,image:"/p3.jpg"},{id:4,image:"/p4.jpg"}]);
  const [user,setUser]=useState({name:"",photo:""});
  const [communityMessages,setCommunityMessages]=useState([]);
  const token = localStorage.getItem("token");

  const fetchProfile = useCallback(async()=>{
    if(!token) return;
    try{
      const res = await fetch(`${API_BASE_URL}/api/profile`,{ headers:{Authorization:`Bearer ${token}`}});
      const data = await res.json();
      if(res.ok)setUser({name:data.name,photo:data.photo});
    }catch(err){ console.error(err); }
  },[token]);

  const fetchCommunityMessages = useCallback(async()=>{
    try{
      const res = await fetch(`${API_BASE_URL}/api/forum`);
      const data = await res.json();
      setCommunityMessages(data.slice(0,3));
    }catch(err){ console.error(err); }
  },[]);

  useEffect(()=>{ fetchProfile(); fetchCommunityMessages(); },[fetchProfile,fetchCommunityMessages]);

  return(
    <Wrapper>
      <Sidebar open={sidebarOpen}>
        <h2>PlantTaxa</h2>
        <Link to="/dashboard" onClick={()=>setSidebarOpen(false)}><FaHome /> Dashboard</Link>
        <Link to="/identify" onClick={()=>setSidebarOpen(false)}><FaLeaf /> Identify</Link>
        <Link to="/disease-detect" onClick={()=>setSidebarOpen(false)}><FaVirus /> Disease</Link>
        <Link to="/ChatBot" onClick={()=>setSidebarOpen(false)}><FaRobot /> ChatBot</Link>
        <Link to="/forum" onClick={()=>setSidebarOpen(false)}><FaComments /> Forum</Link>
        <Link to="/ClimateAdvice" onClick={()=>setSidebarOpen(false)}><FaThermometerHalf /> Climate</Link>
        <Link to="/contact" onClick={()=>setSidebarOpen(false)}><FaPhone /> Contact</Link>
        <LogoutButton onClick={()=>{removeToken();navigate("/login");}}>Logout</LogoutButton>
      </Sidebar>

      <Overlay open={sidebarOpen} onClick={()=>setSidebarOpen(false)}/>

      <Main>
        <Navbar>
          <FaBars className="menu-icon" onClick={()=>setSidebarOpen(true)}/>
          <h1>Welcome back 👋</h1>
          <ProfileContainer onClick={()=>navigate("/profile")}>
            <img src={user.photo || "https://via.placeholder.com/40"} alt="Profile"/>
            <span>{user.name || "Guest"}</span>
          </ProfileContainer>
        </Navbar>

        <AnnouncementBar>
          <span>🚚 Free delivery available! Continue plant shopping!</span>
          <OrderNowButton onClick={()=>navigate("/PlantShop")}>Order Now</OrderNowButton>
        </AnnouncementBar>

        <CommunitySection>
          <h2>Live Tips Community</h2>
          {communityMessages.length===0 && <p>No messages yet.</p>}
          {communityMessages.map((msg,i)=>(
            <CommunityMessage key={i} onClick={()=>navigate("/forum")}>
              <strong>{msg.user?.name||"User"}:</strong> {msg.content}
            </CommunityMessage>
          ))}
        </CommunitySection>

        <CardGrid>
          {featureCards.map((card,i)=>(
            <Card key={i} to={card.to} bg={card.bg}>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </Card>
          ))}
        </CardGrid>

        <ShopSection>
          <h2>Top Selling Plants</h2>
          <div className="plant-grid">
            {topPlants.map((p)=>(
              <ProductCard key={p.id}>
                <img src={p.image} alt="" />
                <p>Plant #{p.id}</p>
                <button onClick={()=>navigate(`/shop/${p.id}`)}>Buy</button>
              </ProductCard>
            ))}
          </div>
        </ShopSection>

        <ChatBotButton onClick={()=>navigate("/ChatBot")}/>
      </Main>
    </Wrapper>
  );
};

export default Dashboard;
