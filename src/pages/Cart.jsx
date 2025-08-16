// src/pages/Cart.jsx
import { useContext } from "react";
import styled from "styled-components";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Container = styled.div`padding: 20px;`;
const Item = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  align-items: center;
`;
const Img = styled.img`width: 120px; height: 100px; object-fit: cover; border-radius: 8px;`;
const Button = styled.button`
  background: #f44336;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background: #d32f2f; }
`;

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <Container>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty. <Link to="/shop">Shop now</Link></p>
      ) : (
        <>
          {cart.map((item) => (
            <Item key={item._id}>
              <Img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>Qty: {item.qty}</p>
                <p>Price: ${item.price}</p>
                <Button onClick={() => removeFromCart(item._id)}>Remove</Button>
              </div>
            </Item>
          ))}
          <h3>Total: ${total.toFixed(2)}</h3>
          <Button onClick={() => navigate("/checkout")}>Proceed to Checkout</Button>
          <Button onClick={clearCart} style={{ marginLeft: "10px", background: "#9e9e9e" }}>Clear Cart</Button>
        </>
      )}
    </Container>
  );
};

export default Cart;
