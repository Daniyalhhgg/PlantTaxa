const API_BASE_URL = "https://daniyaoi5678-plant-leaf-detector.hf.space";

export const predictDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (response.ok) {
    return data.prediction;
  } else {
    throw new Error(data.error || "Prediction failed");
  }
};
