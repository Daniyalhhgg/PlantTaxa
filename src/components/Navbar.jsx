// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { isAuthenticated, removeToken } from "../utils/auth";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

// ================== Styled Components ==================
const Nav = styled.nav`
  background: ${({ dark }) => (dark ? "#1c1c1c" : "#4caf50")};
  color: ${({ dark }) => (dark ? "#f1f1f1" : "#fff")};
  padding: 12px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
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
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`;

const LogoText = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  font-family: 'Segoe UI', sans-serif;
`;

const NavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: inherit;
  font-weight: 500;
  text-decoration: none;
  font-size: 1rem;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s;

  ${({ active }) =>
    active &&
    `
    background: rgba(255,255,255,0.2);
    font-weight: 700;
  `};

  &:hover {
    background: rgba(255,255,255,0.2);
    color: #d0ffd0;
    transform: translateY(-2px);
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

const CartIcon = styled.div`
  position: relative;
  cursor: pointer;
  svg {
    font-size: 1.4rem;
    color: inherit;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -6px;
  right: -10px;
  background: #ff5252;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 50%;
`;

// ================== Navbar Component ==================
const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { cart } = useContext(CartContext);
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
        <StyledLink to="/shop" active={location.pathname === "/shop" ? 1 : 0}>Shop</StyledLink>
        <StyledLink to="/cart" active={location.pathname === "/cart" ? 1 : 0}>
          <CartIcon>
            <FaShoppingCart />
            {cart.length > 0 && <CartCount>{cart.reduce((sum, item) => sum + item.qty, 0)}</CartCount>}
          </CartIcon>
        </StyledLink>

        {isAuthenticated() ? (
          <>
            <StyledLink to="/dashboard" active={location.pathname === "/dashboard" ? 1 : 0}>Dashboard</StyledLink>
            <StyledLink to="/profile" active={location.pathname === "/profile" ? 1 : 0}>Profile</StyledLink>
            <StyledLink to="/identify" active={location.pathname === "/identify" ? 1 : 0}>Identify</StyledLink>
            <StyledLink to="/disease-detect" active={location.pathname === "/disease-detect" ? 1 : 0}>Disease</StyledLink>
            <StyledLink to="/chatbot" active={location.pathname === "/chatbot" ? 1 : 0}>ChatBot</StyledLink>
            <StyledLink to="/forum" active={location.pathname === "/forum" ? 1 : 0}>Forum</StyledLink>
            <StyledLink to="/climate-advice" active={location.pathname === "/climate-advice" ? 1 : 0}>Climate</StyledLink>
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
