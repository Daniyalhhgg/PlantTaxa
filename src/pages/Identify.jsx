import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FiUploadCloud } from "react-icons/fi";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 60px 20px;
  background: url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6") center/cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-family: 'Segoe UI', sans-serif;

  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 60, 30, 0.8);
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  animation: ${fadeIn} 0.6s ease;
  backdrop-filter: blur(12px);
  color: white;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #c8ffc8;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #e0f7e9;
  font-size: 1rem;
  margin-bottom: 30px;
`;

const UploadArea = styled.div`
  border: 2px dashed #a5d6a7;
  border-radius: 16px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: 0.3s;
  position: relative;

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #c8ffc8;
  font-weight: 600;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
`;

const HiddenInput = styled.input`
  display: none;
`;

const IdentifyButton = styled.button`
  margin-top: 25px;
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #2e7d32;
  }
`;

const Identify = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleIdentify = () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }
    alert("Identifying plant species with AI... (Simulation)");
  };

  return (
    <Container>
      <Card>
        <Title>🌱 Plant Identifier</Title>
        <Description>
          Upload a plant image to identify its species using our AI-powered model.
        </Description>

        <UploadArea>
          <UploadLabel htmlFor="plant-upload">
            <FiUploadCloud size={36} />
            <span>Click or drag to upload</span>
          </UploadLabel>
          <HiddenInput
            id="plant-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && <ImagePreview src={image} alt="Uploaded plant" />}
        </UploadArea>

        <IdentifyButton onClick={handleIdentify}>
          Identify Plant
        </IdentifyButton>
      </Card>
    </Container>
  );
};

export default Identify;
