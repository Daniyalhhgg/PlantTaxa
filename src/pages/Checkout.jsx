import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";

export default function Checkout() {
  const { plantId } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [mobile, setMobile] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Success box ke liye state
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const loadPlant = async () => {
      const data = await API.getPlantById(plantId);
      if (data.error) toast.error(data.error);
      else setPlant(data);
    };
    loadPlant();
  }, [plantId]);

  const handlePlaceOrder = async () => {
    if (quantity < 1) return toast.warn("Quantity kam se kam 1 honi chahiye");
    if (!address.trim()) return toast.warn("Address dena zaroori hai");
    if (!city.trim()) return toast.warn("City dena zaroori hai");
    if (!mobile.trim()) return toast.warn("Mobile number dena zaroori hai");
    if (!contact.trim()) return toast.warn("WhatsApp ya Email dena zaroori hai");

    setLoading(true);
    const result = await API.placeOrder({
      plantId,
      quantity,
      paymentMethod,
      address,
      city,
      mobile,
      contact
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setOrderSuccess(true); // ✅ success box dikhao
    }
  };

  if (!plant) return <p style={{ padding: 20 }}>🌿 Loading plant details...</p>;

  const fieldStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    fontSize: "15px"
  };

  // ✅ Total calculate
  const totalPrice = plant.price * quantity;

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>🛒 Checkout</h2>

      {/* ✅ Success Box */}
      {orderSuccess && (
        <div
          style={{
            maxWidth: "450px",
            margin: "20px auto",
            background: "#e6fffa",
            border: "2px solid #2ecc71",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
            animation: "fadeIn 0.5s ease-in-out"
          }}
        >
          <h2 style={{ color: "#27ae60", fontSize: "28px", marginBottom: "10px" }}>
            ✅ Order Placed Successfully!
          </h2>
          <p style={{ fontSize: "16px", color: "#333", marginBottom: "20px" }}>
            Shukriya! Aap ka order process me chala gaya hai.  
            Jaldi aap ko update milay ga.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "linear-gradient(135deg,#2ecc71,#27ae60)",
              border: "none",
              color: "#fff",
              padding: "12px 25px",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Go to Dashboard
          </button>
        </div>
      )}

      {/* ✅ Checkout Form (agar order place nahi hua) */}
      {!orderSuccess && (
        <div
          style={{
            maxWidth: "550px",
            margin: "0 auto",
            background: "#ffffff",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "5px" }}>{plant.name}</h3>
          <p style={{ color: "#27ae60", fontWeight: "bold", marginBottom: "5px" }}>
            Price: Rs. {plant.price}
          </p>
          <p style={{ color: "#333", fontWeight: "600", marginBottom: "20px" }}>
            Total: Rs. {totalPrice}
          </p>

          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={fieldStyle}
          />

          <label>Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={fieldStyle}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Credit/Debit Card</option>
          </select>

          <label>Delivery Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street / House # / Area"
            style={fieldStyle}
          />

          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Your City"
            style={fieldStyle}
          />

          <label>Mobile Number:</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="03XX-XXXXXXX"
            style={fieldStyle}
          />

          <label>WhatsApp or Email:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="WhatsApp number or email address"
            style={fieldStyle}
          />

          <button
            disabled={loading}
            onClick={handlePlaceOrder}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg,#2ecc71,#27ae60)",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "10px"
            }}
          >
            {loading ? "Placing order..." : `Place Order (Rs. ${totalPrice})`}
          </button>
        </div>
      )}
    </div>
  );
}
