// src/pages/DiseaseDetect.jsx
import { useState } from "react";

import styled, { keyframes } from "styled-components";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
`;

const scanAnim = keyframes`
  0% { top: 0; }
  100% { top: 100%; }
`;

const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6") center/cover no-repeat;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  color: #f4fff4;

  &::before {
    content: "";
    background: rgba(0, 60, 30, 0.85);
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
    animation: ${fadeIn} 0.7s;
  }
`;

const Title = styled.h1`
  font-size: 2.8rem;
  color: #b6ffb6;
  margin-bottom: 18px;
  letter-spacing: 1px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.18rem;
  color: #e0f7e9;
  margin-bottom: 36px;
  text-align: center;
  max-width: 600px;
`;

const UploadBox = styled.label`
  background: rgba(255,255,255,0.13);
  border: 2px dashed #a5d6a7;
  border-radius: 16px;
  padding: 36px 24px;
  width: 100%;
  max-width: 440px;
  cursor: pointer;
  text-align: center;
  color: #eaffea;
  margin-bottom: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);

  &:hover {
    background: rgba(255,255,255,0.22);
    border-color: #66bb6a;
  }

  input {
    display: none;
  }
`;

const PreviewWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 400px;
`;

const Preview = styled.img`
  margin-top: 18px;
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.32);
  border: 2px solid #b6ffb6;
`;

const ScanOverlay = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 2;
`;

const ScanLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 7px;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  animation: ${scanAnim} 1.2s linear infinite;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: #1a3c1a;
  font-weight: bold;
  margin-top: 22px;
  padding: 13px 32px;
  border: none;
  border-radius: 30px;
  font-size: 1.08rem;
  cursor: pointer;

  &:hover {
    background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ResultBox = styled.div`
  margin-top: 36px;
  background: rgba(255,255,255,0.13);
  padding: 26px 18px;
  border-radius: 12px;
  backdrop-filter: blur(7px);
  max-width: 600px;
  color: #c8ffc8;
  font-size: 1.13rem;
  text-align: center;
`;

const DiseaseDetect = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      setResult("");
    }
  };

  const handleDetect = async () => {
    if (!imageFile) {
      setResult("❌ Please upload an image first.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(`${API_BASE_URL}/api/disease/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data && data.prediction) {
        const cleaned = data.prediction
          .replace(/___/g, " → ")
          .replace(/_/g, " ");
        setResult(`✅ Result: ${cleaned}`);
      } else {
        setResult("❌ No prediction returned from server.");
      }
    } catch (err) {
      setResult("❌ Error during prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>🦠 Disease Detection</Title>
      <Subtitle>Upload an image of your plant to detect disease using AI.</Subtitle>

      <UploadBox>
        <input type="file" accept="image/*" onChange={handleUpload} />
        <p>📁 Click to upload</p>
      </UploadBox>

      {image && (
        <PreviewWrapper>
          <Preview src={image} alt="preview" />
          {loading && (
            <ScanOverlay>
              <ScanLine />
            </ScanOverlay>
          )}
        </PreviewWrapper>
      )}

      {image && (
        <>
          <Button onClick={handleDetect} disabled={loading}>
            {loading ? "Detecting..." : "Detect Disease"}
          </Button>
          {result && <ResultBox>{result}</ResultBox>}
        </>
      )}
    </Container>
  );
};

export default DiseaseDetect;
