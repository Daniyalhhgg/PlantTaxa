import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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
    width: 100%; height: 100%;
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

  input { display: none; }
`;

const PreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const Preview = styled.img`
  margin-top: 18px;
  max-width: 100%;
  border-radius: 12px;
  border: 2px solid #b6ffb6;
  box-shadow: 0 6px 18px rgba(0,0,0,0.32);
`;

const ScanOverlay = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
`;

const ScanLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 7px;
  background: linear-gradient(90deg, #43e97b, #38f9d7);
  animation: ${scanAnim} 1.2s linear infinite;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #43e97b, #38f9d7);
  color: #1a3c1a;
  font-weight: bold;
  margin-top: 22px;
  padding: 13px 32px;
  border: none;
  border-radius: 30px;
  font-size: 1.08rem;
  cursor: pointer;

  &:hover {
    background: linear-gradient(90deg, #38f9d7, #43e97b);
    color: #0e1e0e;
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

const CameraModalBackdrop = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
`;

const CameraModalBox = styled.div`
  background: #222;
  padding: 24px 28px;
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.4);
`;

const CameraModal = ({ onCapture, onClose }) => {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    let stream;
    navigator.mediaDevices.getUserMedia({ video: true }).then(s => {
      stream = s;
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
    return () => stream && stream.getTracks().forEach(track => track.stop());
  }, []);

  const handleCapture = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 400, 300);
    canvasRef.current.toBlob(blob => {
      onCapture(blob);
      onClose();
    }, "image/jpeg");
  };

  return (
    <CameraModalBackdrop>
      <CameraModalBox>
        <video ref={videoRef} width={400} height={300} autoPlay />
        <canvas ref={canvasRef} width={400} height={300} style={{ display: "none" }} />
        <div style={{ marginTop: 16 }}>
          <Button onClick={handleCapture}>Capture</Button>
          <Button onClick={onClose} style={{ marginLeft: 12 }}>Close</Button>
        </div>
      </CameraModalBox>
    </CameraModalBackdrop>
  );
};

const DiseaseDetect = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    const onClick = (e) => {
      if (e.target.classList.contains("disease-link")) {
        const disease = e.target.textContent;
        alert(`Advice for: ${disease}`);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      setResult("");
    }
  };

  const handleCameraCapture = (blob) => {
    setImage(URL.createObjectURL(blob));
    setImageFile(new File([blob], "captured.jpg", { type: "image/jpeg" }));
    setResult("");
  };

  const handleDetect = async () => {
    if (!imageFile) return setResult("❌ Please upload an image first.");
    setLoading(true);
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch("https://daniyaoi5678-plant-leaf-detector.hf.space/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data && data.class) {
        const readable = data.class.replace(/___/g, " → ").replace(/_/g, " ");
        const html = `✅ Prediction: <span class="disease-link">${readable}</span><br/>🔬 Confidence: ${(data.confidence * 100).toFixed(2)}%`;
        setResult(html);
      } else {
        setResult("❌ No prediction returned from server.");
      }
    } catch (err) {
      setResult("❌ Error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>🦠 Disease Detection</Title>
      <Subtitle>Upload or capture an image of your plant to detect possible diseases using AI.</Subtitle>

      <UploadBox>
        <input type="file" accept="image/*" onChange={handleUpload} />
        <p>📁 Click to upload from gallery or storage</p>
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
      </UploadBox>

      <Button onClick={() => setShowCamera(true)}>📷 Use Laptop Camera</Button>

      <UploadBox>
        <input type="file" accept="image/*" capture="environment" onChange={handleUpload} />
        <p>📷 Click to capture using your camera (mobile only)</p>
      </UploadBox>

      {showCamera && <CameraModal onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />}

      {image && (
        <>
          <Button onClick={handleDetect} disabled={loading}>
            {loading ? "Detecting..." : "Detect Disease"}
          </Button>
          <Button onClick={() => { setImage(null); setImageFile(null); setResult(""); }}>
            🔁 Try Another Image
          </Button>
          <ResultBox dangerouslySetInnerHTML={{ __html: result }} />
        </>
      )}
    </Container>
  );
};

export default DiseaseDetect;
