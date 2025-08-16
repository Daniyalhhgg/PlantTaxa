// src/pages/ProductDetails.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { getProductById } from "../utils/api";
import { CartContext } from "../context/CartContext";

const Container = styled.div`
  display: flex;
  gap: 40px;
  padding: 20px;
  flex-wrap: wrap;
`;

const Img = styled.img`
  width: 400px;
  max-width: 100%;
  border-radius: 12px;
`;

const Info = styled.div`
  flex: 1;
`;

const Button = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 12px;
  &:hover { background: #45a049; }
`;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <Container>
      <Img src={product.image} alt={product.name} />
      <Info>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <h3>Price: ${product.price}</h3>
        <Button onClick={() => addToCart(product)}>Add to Cart</Button>
      </Info>
    </Container>
  );
};

export default ProductDetails;
