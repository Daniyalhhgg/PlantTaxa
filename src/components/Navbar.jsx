// ==== components/Navbar.js ====
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { isAuthenticated, removeToken } from "../utils/auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

// ===== Styled Components =====
const Nav = styled.nav`
  background: ${({ dark }) =>
    dark
      ? "linear-gradient(90deg, #0f2027, #203a43, #2c5364)"
      : "linear-gradient(90deg, #4caf50, #81c784)"};
  color: ${({ dark }) => (dark ? "#f1f1f1" : "#fff")};
  padding: 14px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LogoGroup = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
`;

const LogoImage = styled.img`
  height: 46px;
  width: 46px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  transition: 0.3s ease;
  &:hover {
    transform: rotate(8deg) scale(1.05);
    border-color: #fff;
  }
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  letter-spacing: 1px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 880px) {
    display: none;
  }
`;

const StyledLink = styled(Link)`
  color: inherit;
  font-weight: 500;
  text-decoration: none;
  font-size: 1rem;
  position: relative;
  padding: 6px 10px;
  transition: all 0.3s ease;

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
    color: #e8ffe8;
    transform: scale(1.07);
  }
`;

const ProfileLink = styled(StyledLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.85rem;

  svg {
    font-size: 1.4rem;
  }
`;

const Button = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: ${({ dark }) => (dark ? "#fff" : "#1b5e20")};
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 6px 16px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;

  &:hover {
    background: ${({ dark }) => (dark ? "rgba(255,255,255,0.3)" : "#e0f2f1")};
    transform: scale(1.05);
  }
`;

// Dropdown (More)
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
  top: 35px;
  right: 0;
  background: ${({ dark }) => (dark ? "#2c3e50" : "#4caf50")};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: ${({ open }) => (open ? "flex" : "none")};
  flex-direction: column;
  min-width: 160px;
  z-index: 999;

  ${StyledLink} {
    padding: 10px 14px;
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: none;
    }
  }
`;

// Dark Mode Toggle
const ToggleWrapper = styled.div`
  width: 52px;
  height: 28px;
  border-radius: 50px;
  background: ${({ dark }) => (dark ? "#333" : "#ddd")};
  display: flex;
  align-items: center;
  padding: 3px;
  cursor: pointer;
  transition: background 0.3s ease;
  position: relative;
`;

const ToggleCircle = styled(motion.div)`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ dark }) => (dark ? "#f1c40f" : "#2c3e50")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  position: absolute;
`;

// Mobile
const MenuIcon = styled.div`
  display: none;
  font-size: 1.6rem;
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 880px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 72px;
  right: 0;
  width: 100%;
  background: ${({ dark }) =>
    dark ? "rgba(20,30,40,0.98)" : "rgba(255,255,255,0.98)"};
  backdrop-filter: blur(12px);
  color: ${({ dark }) => (dark ? "#fff" : "#2c3e50")};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  gap: 14px;
  z-index: 998;

  ${StyledLink} {
    color: inherit;
  }
`;

// ===== Component =====
const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setDarkMode(true);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  const toggleDropdown = () => setOpen(!open);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <Nav dark={darkMode}>
      {/* === Left Logo === */}
      <LeftSection>
        <LogoGroup to="/">
          <LogoImage src="/logo1.png" alt="PlantTaxa Logo" />
          <LogoText>PlantTaxa</LogoText>
        </LogoGroup>
      </LeftSection>

      {/* === Desktop Nav Links === */}
      <NavLinks>
        {isAuthenticated() ? (
          <>
            <StyledLink
              to="/dashboard"
              active={location.pathname === "/dashboard" ? 1 : 0}
            >
              Dashboard 🏠
            </StyledLink>
            <ProfileLink
              to="/profile"
              active={location.pathname === "/profile" ? 1 : 0}
            >
              <FaUser />
            </ProfileLink>
            <StyledLink
              to="/PlantShop"
              active={location.pathname === "/PlantShop" ? 1 : 0}
            >
              Shop 🛒
            </StyledLink>
            <StyledLink
              to="/ChatBot"
              active={location.pathname === "/ChatBot" ? 1 : 0}
            >
              ChatBot 🤖
            </StyledLink>

            <Dropdown>
              <DropButton onClick={toggleDropdown}>More ▾</DropButton>
              <DropContent
                dark={darkMode}
                open={open}
                onMouseLeave={() => setOpen(false)}
              >
                <StyledLink to="/identify">Identify 🌱</StyledLink>
                <StyledLink to="/disease-detect">Disease 🦠</StyledLink>
                <StyledLink to="/forum">Forum 🌿</StyledLink>
                <StyledLink to="/ClimateAdvice">Climate 🌡️☀️</StyledLink>
                <StyledLink to="/about">About</StyledLink>
                <StyledLink to="/contact">Contact 📞</StyledLink>
                <StyledLink to="/my-orders">My Orders</StyledLink>
              </DropContent>
            </Dropdown>

            <Button dark={darkMode} onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <StyledLink
              to="/login"
              active={location.pathname === "/login" ? 1 : 0}
            >
              Login
            </StyledLink>
            <StyledLink
              to="/register"
              active={location.pathname === "/register" ? 1 : 0}
            >
              Register
            </StyledLink>
          </>
        )}
      </NavLinks>

      {/* === Right Section === */}
      <RightSection>
        {/* Dark/Light Toggle */}
        <ToggleWrapper dark={darkMode} onClick={toggleDarkMode}>
          <ToggleCircle
            dark={darkMode}
            animate={{ x: darkMode ? 26 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {darkMode ? "☀️" : "🌙"}
          </ToggleCircle>
        </ToggleWrapper>

        {/* Mobile Icon */}
        <MenuIcon onClick={toggleMobile}>
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </MenuIcon>
      </RightSection>

      {/* === Mobile Menu === */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            dark={darkMode}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isAuthenticated() ? (
              <>
                <StyledLink to="/dashboard" onClick={toggleMobile}>
                  Dashboard 🏠
                </StyledLink>
                <StyledLink to="/profile" onClick={toggleMobile}>
                  Profile 👤
                </StyledLink>
                <StyledLink to="/PlantShop" onClick={toggleMobile}>
                  Shop 🛒
                </StyledLink>
                <StyledLink to="/ChatBot" onClick={toggleMobile}>
                  ChatBot 🤖
                </StyledLink>
                <StyledLink to="/identify" onClick={toggleMobile}>
                  Identify 🌱
                </StyledLink>
                <StyledLink to="/disease-detect" onClick={toggleMobile}>
                  Disease 🦠
                </StyledLink>
                <StyledLink to="/forum" onClick={toggleMobile}>
                  Forum 🌿
                </StyledLink>
                <StyledLink to="/ClimateAdvice" onClick={toggleMobile}>
                  Climate 🌡️
                </StyledLink>
                <StyledLink to="/my-orders" onClick={toggleMobile}>
                  My Orders 📦
                </StyledLink>
                <Button dark={darkMode} onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <StyledLink to="/login" onClick={toggleMobile}>
                  Login
                </StyledLink>
                <StyledLink to="/register" onClick={toggleMobile}>
                  Register
                </StyledLink>
              </>
            )}
          </MobileMenu>
        )}
      </AnimatePresence>
    </Nav>
  );
};

export default Navbar;
