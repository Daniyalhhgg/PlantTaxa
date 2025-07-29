import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Background = styled.div`
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6") center/cover no-repeat;
  padding: 60px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: white;

  &::before {
    content: "";
    background: rgba(0, 60, 30, 0.8);
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  color: #fff;
`;

const Title = styled.h2`
  text-align: center;
  color: #c8ffc8;
  margin-bottom: 25px;
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ProfileImage = styled.img`
  width: 130px;
  height: 130px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #4caf50;
  background: #eee;
  transition: 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    opacity: 0.85;
  }
`;

const Label = styled.label`
  font-weight: 600;
  margin: 10px 0 5px;
  display: block;
  color: #e0f7e9;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border-radius: 10px;
  font-size: 1rem;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.2);
  color: white;

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: #ccc;
    cursor: not-allowed;
  }

  &:focus {
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  background: #4caf50;
  color: white;
  padding: 14px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  margin-top: 10px;

  &:hover {
    background: #388e3c;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #a5d6a7;
    cursor: not-allowed;
  }
`;

const LogoutBtn = styled(Button)`
  background: #e53935;
  margin-top: 20px;

  &:hover {
    background: #c62828;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef();

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(res.status === 401 ? "Session expired" : "Failed to fetch profile");

      const data = await res.json();
      setProfile(data);
      setPhone(data.phone || "");
      setPhoto(data.photo || "");
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error(err.message);
      if (err.message === "Session expired") logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ phone, photo }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setProfile(data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) return toast.error("Please select an image file");
    if (file.size > 2 * 1024 * 1024) return toast.error("Image size should be less than 2MB");

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (isLoading) {
    return (
      <Background>
        <Container>Loading your profile...</Container>
      </Background>
    );
  }

  if (!profile) {
    return (
      <Background>
        <Container>
          <p>Failed to load profile. Please try again.</p>
          <Button onClick={fetchProfile}>Retry</Button>
        </Container>
      </Background>
    );
  }

  return (
    <Background>
      <ToastContainer position="top-center" autoClose={3000} />
      <Container>
        <Title>🌿 My Profile</Title>

        <ProfileImageWrapper onClick={handleImageClick}>
          <ProfileImage 
            src={photo || "https://via.placeholder.com/130?text=Upload+Photo"} 
            alt="Profile" 
          />
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </ProfileImageWrapper>

        <Label>Full Name</Label>
        <Input value={profile.name || ""} disabled />

        <Label>Email Address</Label>
        <Input value={profile.email || ""} disabled />

        <Label>Phone Number</Label>
        <Input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Button onClick={handleUpdate} disabled={isUpdating || !phone.trim()}>
          {isUpdating ? <LoadingSpinner /> : "Update Profile"}
        </Button>

        <LogoutBtn onClick={logout}>🚪 Sign Out</LogoutBtn>
      </Container>
    </Background>
  );
};

export default Profile;
