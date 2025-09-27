import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { isAuthenticated, removeToken } from "../utils/auth";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";   // ✅ icons

// ===== Styled Components =====
const Nav = styled.nav`
  background: ${({ dark }) =>
    dark
      ? "linear-gradient(90deg, #0f2027, #203a43, #2c5364)"
      : "linear-gradient(90deg, #4caf50, #81c784)"};
  color: ${({ dark }) => (dark ? "#f1f1f1" : "#fff")};
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.4s ease;
`;

const LogoGroup = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
`;

const LogoImage = styled.img`
  height: 45px;
  width: 45px;
  object-fit: cover;
  border-radius: 50%;
`;

const LogoText = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media(max-width: 768px) {
    display: none; /* ✅ hide normal links on mobile */
  }
`;

const StyledLink = styled(Link)`
  color: inherit;
  font-weight: 500;
  text-decoration: none;
  font-size: 1rem;
  padding: 6px 8px;
  transition: all 0.3s;

  &:hover {
    color: #d0ffd0;
    transform: scale(1.05);
  }
`;

const ProfileLink = styled(StyledLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 0.85rem;

  svg {
    font-size: 1.4rem;
  }
`;

const Button = styled.button`
  background: rgba(255,255,255,0.2);
  color: ${({ dark }) => (dark ? "#fff" : "#1b5e20")};
  border: 1px solid rgba(255,255,255,0.4);
  padding: 6px 14px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;

  &:hover {
    background: ${({ dark }) => (dark ? "rgba(255,255,255,0.3)" : "#e0f2f1")};
    transform: scale(1.05);
  }
`;

// ✅ Hamburger
const Hamburger = styled.div`
  display: none;
  font-size: 1.6rem;
  cursor: pointer;
  @media(max-width: 768px) {
    display: block;
  }
`;

// ✅ Mobile Drawer
const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: ${({ open }) => (open ? "0" : "-100%")};
  width: 70%;
  height: 100%;
  background: ${({ dark }) => (dark ? "#2c3e50" : "#4caf50")};
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: right 0.3s ease;
  z-index: 1200;

  a, button {
    margin: 12px 0;
  }
`;

const CloseBtn = styled.div`
  align-self: flex-end;
  font-size: 1.6rem;
  cursor: pointer;
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

  return (
    <>
      <Nav dark={darkMode}>
        <LogoGroup to="/">
          <LogoImage src="/logo1.png" alt="PlantTaxa Logo" />
          <LogoText>PlantTaxa</LogoText>
        </LogoGroup>

        {/* Desktop Links */}
        <NavLinks>
          {isAuthenticated() ? (
            <>
              <StyledLink to="/dashboard">Dashboard 🏠</StyledLink>
              <StyledLink to="/PlantShop">Shop 🛒</StyledLink>
              <StyledLink to="/ChatBot">ChatBot 🤖</StyledLink>
              <ProfileLink to="/profile"><FaUser /> Profile</ProfileLink>
              <Button dark={darkMode} onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <StyledLink to="/login">Login</StyledLink>
              <StyledLink to="/register">Register</StyledLink>
            </>
          )}
          <Button onClick={toggleDarkMode}>{darkMode ? "☀️" : "🌙"}</Button>
        </NavLinks>

        {/* Mobile Hamburger */}
        <Hamburger onClick={() => setOpen(true)}>
          <FaBars />
        </Hamburger>
      </Nav>

      {/* Mobile Drawer */}
      <MobileMenu dark={darkMode} open={open}>
        <CloseBtn onClick={() => setOpen(false)}><FaTimes /></CloseBtn>
        {isAuthenticated() ? (
          <>
            <StyledLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard 🏠</StyledLink>
            <StyledLink to="/PlantShop" onClick={() => setOpen(false)}>Shop 🛒</StyledLink>
            <StyledLink to="/ChatBot" onClick={() => setOpen(false)}>ChatBot 🤖</StyledLink>
            <StyledLink to="/identify" onClick={() => setOpen(false)}>Identify 🌱</StyledLink>
            <StyledLink to="/disease-detect" onClick={() => setOpen(false)}>Disease 🦠</StyledLink>
            <StyledLink to="/forum" onClick={() => setOpen(false)}>Forum 🌿</StyledLink>
            <StyledLink to="/ClimateAdvice" onClick={() => setOpen(false)}>Climate 🌡️</StyledLink>
            <StyledLink to="/about" onClick={() => setOpen(false)}>About</StyledLink>
            <StyledLink to="/contact" onClick={() => setOpen(false)}>Contact 📞</StyledLink>
            <StyledLink to="/my-orders" onClick={() => setOpen(false)}>My Orders</StyledLink>
            <ProfileLink to="/profile" onClick={() => setOpen(false)}><FaUser /> Profile</ProfileLink>
            <Button dark={darkMode} onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <StyledLink to="/login" onClick={() => setOpen(false)}>Login</StyledLink>
            <StyledLink to="/register" onClick={() => setOpen(false)}>Register</StyledLink>
          </>
        )}
        <Button onClick={toggleDarkMode}>{darkMode ? "☀️ Light" : "🌙 Dark"}</Button>
      </MobileMenu>
    </>
  );
};

export default Navbar;
