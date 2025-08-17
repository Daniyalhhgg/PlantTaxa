import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { isAuthenticated, removeToken } from "../utils/auth";
import { useState, useEffect } from "react";

// Styled Components
const Nav = styled.nav`
  background: ${({ dark }) => (dark ? "#1c1c1c" : "#4caf50")};
  color: ${({ dark }) => (dark ? "#f1f1f1" : "#fff")};
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const LogoGroup = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: inherit;
`;

const LogoImage = styled.img`
  height: 60px;
  width: 60px;
  object-fit: cover;
  border-radius: 50%;
`;

const LogoText = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  font-family: 'Segoe UI', sans-serif;
`;

const NavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: inherit;
  font-weight: 500;
  text-decoration: none;
  font-size: 1rem;
  transition: 0.3s;
  position: relative;

  ${({ active }) =>
    active &&
    `
    color: #fff;
    font-weight: 700;
    border-bottom: 2px solid #fff;
  `};

  &:hover {
    color: #d0ffd0;
  }
`;

const Button = styled.button`
  background-color: #c8e6c9;
  color: #2e7d32;
  border: none;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    background-color: #a5d6a7;
    color: #1b5e20;
  }
`;

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
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

  return (
    <Nav dark={darkMode}>
      <LogoGroup to="/">
        <LogoImage src="/logo1.png" alt="PlantTaxa Logo" />
        <LogoText>PlantTaxa</LogoText>
      </LogoGroup>

      <NavLinks>
        {isAuthenticated() ? (
          <>
            <StyledLink to="/dashboard" active={location.pathname === "/dashboard" ? 1 : 0}>Dashboard</StyledLink>
            <StyledLink to="/Profile" active={location.pathname === "/Profile" ? 1 : 0}>Profile</StyledLink>
            <StyledLink to="/identify" active={location.pathname === "/identify" ? 1 : 0}>Identify</StyledLink>
            <StyledLink to="/disease-detect" active={location.pathname === "/disease-detect" ? 1 : 0}>Disease</StyledLink>
            <StyledLink to="/ChatBot" active={location.pathname === "/ChatBot" ? 1 : 0}>ChatBot</StyledLink>
            <StyledLink to="/forum" active={location.pathname === "/forum" ? 1 : 0}>Forum</StyledLink>
            <StyledLink to="/ClimateAdvice" active={location.pathname === "/ClimateAdvice" ? 1 : 0}>Climate</StyledLink>

            {/* ✅ New Plant Shop Link */}
            <StyledLink to="/PlantShop" active={location.pathname === "/PlantShop" ? 1 : 0}>
              Plant Shop
            </StyledLink>

            <StyledLink to="/about" active={location.pathname === "/about" ? 1 : 0}>About</StyledLink>
            <StyledLink to="/contact" active={location.pathname === "/contact" ? 1 : 0}>Contact</StyledLink>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <StyledLink to="/login" active={location.pathname === "/login" ? 1 : 0}>Login</StyledLink>
            <StyledLink to="/register" active={location.pathname === "/register" ? 1 : 0}>Register</StyledLink>
          </>
        )}
        <Button onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light" : "🌙 Night"}
        </Button>
      </NavLinks>
    </Nav>
  );
};

export default Navbar;
