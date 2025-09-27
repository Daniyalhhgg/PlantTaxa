import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { isAuthenticated, removeToken } from "../utils/auth";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";   // ✅ user icon

// ===== Styled Components =====
const Nav = styled.nav`
  background: ${({ dark }) =>
    dark
      ? "linear-gradient(90deg, #0f2027, #203a43, #2c5364)"
      : "linear-gradient(90deg, #4caf50, #81c784)"};
  color: ${({ dark }) => (dark ? "#f1f1f1" : "#fff")};
  padding: 12px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.4s ease;
`;

const LogoGroup = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
`;

const LogoImage = styled.img`
  height: 50px;
  width: 50px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.6);
  transition: all 0.3s;
  &:hover {
    transform: rotate(10deg) scale(1.05);
    border-color: #fff;
  }
`;

const LogoText = styled.span`
  font-size: 1.6rem;
  font-weight: 700;
  font-family: 'Segoe UI', sans-serif;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  @media(max-width: 768px) {
    width: 100%;
    justify-content: space-around;
    margin-top: 8px;
  }
`;

const StyledLink = styled(Link)`
  color: inherit;
  font-weight: 500;
  text-decoration: none;
  font-size: 1rem;
  position: relative;
  padding: 6px 8px;
  transition: all 0.3s;

  ${({ active }) =>
    active &&
    `
    font-weight: 700;
    &:after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #fff;
      border-radius: 2px;
    }
  `};

  &:hover {
    color: #d0ffd0;
    transform: scale(1.05);
  }
`;

/* ✅ Profile link: icon above text */
const ProfileLink = styled(StyledLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;

  svg {
    font-size: 1.5rem;
  }
`;

const Button = styled.button`
  background: rgba(255,255,255,0.2);
  color: ${({ dark }) => (dark ? "#fff" : "#1b5e20")};
  border: 1px solid rgba(255,255,255,0.4);
  padding: 6px 16px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;

  &:hover {
    background: ${({ dark }) => (dark ? "rgba(255,255,255,0.3)" : "#e0f2f1")};
    color: ${({ dark }) => (dark ? "#fff" : "#1b5e20")};
    transform: scale(1.05);
  }
`;

// Modern Toggle
const ToggleWrapper = styled.div`
  width: 50px;
  height: 26px;
  border-radius: 50px;
  background: ${({ dark }) => (dark ? "#333" : "#ddd")};
  display: flex;
  align-items: center;
  padding: 3px;
  cursor: pointer;
  transition: background 0.3s ease;
`;

const ToggleCircle = styled(motion.div)`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ dark }) => (dark ? "#f1c40f" : "#2c3e50")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

// Dropdown
const Dropdown = styled.div`
  position: relative;
`;

const DropButton = styled.div`
  cursor: pointer;
  font-weight: 500;
  padding: 6px 8px;
  &:hover {
    color: #d0ffd0;
    transform: scale(1.05);
  }
`;

const DropContent = styled.div`
  position: absolute;
  top: 32px;
  right: 0;
  background: ${({ dark }) => (dark ? "#2c3e50" : "#4caf50")};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  display: ${({ open }) => (open ? "flex" : "none")};
  flex-direction: column;
  min-width: 160px;
  z-index: 999;

  ${StyledLink} {
    padding: 8px 12px;
    &:hover {
      background: rgba(255,255,255,0.1);
      transform: none;
    }
  }
`;

// ===== Component =====
const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    localStorage.setItem("darkMode", !darkMode);
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  const toggleDropdown = () => setOpen(!open);

  return (
    <Nav dark={darkMode}>
      <LogoGroup to="/">
        <LogoImage src="/logo1.png" alt="PlantTaxa Logo" />
        <LogoText>PlantTaxa</LogoText>
      </LogoGroup>

      <NavLinks>
        {isAuthenticated() ? (
          <>
            {/* ✅ Only 3 main buttons outside */}
            <StyledLink to="/dashboard" active={location.pathname === "/dashboard" ? 1 : 0}>Dashboard 🏠</StyledLink>
            <StyledLink to="/PlantShop" active={location.pathname === "/PlantShop" ? 1 : 0}>Shop 🛒</StyledLink>
            <StyledLink to="/ChatBot" active={location.pathname === "/ChatBot" ? 1 : 0}>ChatBot 🤖</StyledLink>

            {/* ✅ Profile icon (always visible) */}
            <ProfileLink to="/profile" active={location.pathname === "/profile" ? 1 : 0}>
              <FaUser />
              Profile
            </ProfileLink>

            {/* ✅ More dropdown */}
            <Dropdown>
              <DropButton onClick={toggleDropdown}>More ▾</DropButton>
              <DropContent dark={darkMode} open={open} onMouseLeave={() => setOpen(false)}>
                <StyledLink to="/identify">Identify 🌱</StyledLink>
                <StyledLink to="/disease-detect">Disease 🦠 </StyledLink>
                <StyledLink to="/forum">Forum 🌿</StyledLink>
                <StyledLink to="/ClimateAdvice">Climate 🌡️☀️</StyledLink>
                <StyledLink to="/about">About</StyledLink>
                <StyledLink to="/contact">Contact 📞</StyledLink>
                <StyledLink to="/my-orders">My Orders</StyledLink>
              </DropContent>
            </Dropdown>

            <Button dark={darkMode} onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <StyledLink to="/login" active={location.pathname === "/login" ? 1 : 0}>Login</StyledLink>
            <StyledLink to="/register" active={location.pathname === "/register" ? 1 : 0}>Register</StyledLink>
          </>
        )}

        {/* Dark mode toggle */}
        <ToggleWrapper dark={darkMode} onClick={toggleDarkMode}>
          <ToggleCircle
            dark={darkMode}
            animate={{ x: darkMode ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {darkMode ? "☀️" : "🌙"}
          </ToggleCircle>
        </ToggleWrapper>
      </NavLinks>
    </Nav>
  );
};

export default Navbar;
