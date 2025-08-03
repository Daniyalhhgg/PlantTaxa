import React, { useState } from "react";
import axios from "axios";

const DiseaseDetect = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setResult(null);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        "https://daniyaoi5678-plant-leaf-detector.hf.space/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data);
    } catch (error) {
      setResult({ error: "Prediction failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Plant Disease Detector</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="mt-4 rounded shadow-md"
          width={300}
        />
      )}

      <button
        onClick={handlePredict}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {loading ? "Analyzing..." : "Predict"}
      </button>

      {result && result.class && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded">
          ✅ Prediction: <strong>{result.class}</strong>
          <br />
          🔬 Confidence: <strong>{(result.confidence * 100).toFixed(2)}%</strong>
        </div>
      )}

      {result && result.error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded">
          ❌ Error: {result.error}
        </div>
      )}
    </div>
  );
};

export default DiseaseDetect;
