// src/pages/Shop.jsx
import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { getProducts } from "../utils/api";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(220px,1fr));
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  transition: transform 0.2s;
  &:hover { transform: scale(1.03); }
`;

const Img = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
`;

const Button = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
  &:hover { background: #45a049; }
`;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Grid>
      {products.map((p) => (
        <Card key={p._id}>
          <Link to={`/product/${p._id}`}>
            <Img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
          </Link>
          <p>Price: ${p.price}</p>
          <Button onClick={() => addToCart(p)}>Add to Cart</Button>
        </Card>
      ))}
    </Grid>
  );
};

export default Shop;
