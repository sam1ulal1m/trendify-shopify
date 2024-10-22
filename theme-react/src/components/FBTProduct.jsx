import React from 'react';
import './ProductCard.css'; // Import your CSS file (optional)

const ProductCard = ({ product }) => {
    
  const { handle, title, priceRangeV2, featuredMedia } = product;
  const imageUrl = featuredMedia?.preview?.image?.url;
  const price = priceRangeV2?.maxVariantPrice?.amount;
  const currency = priceRangeV2?.maxVariantPrice?.currencyCode;

  return (
    <div className="product-card">
      <img src={imageUrl} alt={title} />
      <div className="product-info">
        <h3>{title}</h3>
        <p>
          {price} {currency}
        </p>
        <a href={`/products/${handle}`}>View details</a>
      </div>
    </div>
  );
};

const ProductList = ({ products }) => {
    console.log("products", products)
  return (
    <div className="product-list">
      {products?.map((product) => (
        <ProductCard key={product?.handle} product={product} />
      ))}
    </div>
  );
};

export default ProductList;