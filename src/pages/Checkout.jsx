// src/pages/Checkout.jsx
import { useContext, useState } from "react";
import styled from "styled-components";
import { CartContext } from "../context/CartContext";
import { placeOrder } from "../utils/api";
import { getToken } from "../utils/auth";

const Container = styled.div`padding: 20px; max-width: 500px; margin: auto;`;
const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 6px 0;
  border-radius: 6px;
  border: 1px solid #ccc;
`;
const Button = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 12px;
  &:hover { background: #45a049; }
`;

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const orderData = { items: cart, name, address };
      await placeOrder(orderData, token);
      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error("Order failed:", err);
      alert("Order failed");
    }
  };

  if (success) return <h2>✅ Order placed successfully!</h2>;

  return (
    <Container>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Shipping Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <Button type="submit">Place Order</Button>
      </form>
    </Container>
  );
};

export default Checkout;
