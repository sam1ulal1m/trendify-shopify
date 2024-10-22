import React from "react";
import "./ManualStyles.css";

// ProductCard component to display each product, with image
export const ProductCard = ({ product }) => {
  return (
    <div 
    onClick={() => {
        window.location.href = `/products/${product?.handle}`
    }}
    style={{
        cursor: 'pointer',
    }} className="product-card">
      <img src={product?.image} alt={product?.title} className="product-image" />
      <h2>{product?.title}</h2>

    </div>
  );
};

// ProductList component to render all products
export const ProductList = ({ products }) => {
  return (
    <div className="product-list">
      {products?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
