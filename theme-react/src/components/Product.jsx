import React from 'react';

const ProductCard = ({product}) => {
    const styles = {
        carouselItem: {
          margin: '0 1rem',
          flex: '0 0 auto',
          cursor: "pointer",
        },
        card: {
          backgroundColor: '#F3F4F6', // bg-base-100 equivalent
          width: '24rem', // w-96 equivalent
          height: "508px",
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
        },
        image: {
          width: '100%',
          height: '24rem', // h-96 equivalent
          objectFit: 'cover',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        },
        cardBody: {
          padding: '1.5rem',
        },
        cardTitle: {
          fontSize: '1.25rem', // text-lg equivalent
          fontWeight: '600',
        },
        cardPrice: {
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.25rem', // text-lg equivalent
          gap: '0.5rem',
          marginTop: '0.5rem',
        },
      };
     
    return (
        <div onClick={()=> {
            window.location.href = `/products/${product?.handle}`
        }}  key={product?.id} style={styles?.carouselItem}>
              <div style={styles?.card}>
                <figure>
                  <img
                    src={product?.images}
                    alt={product?.title}
                    style={styles?.image}
                  />
                </figure>
                <div style={styles?.cardBody}>
                  <h2 style={styles?.cardTitle}>{product?.title}</h2>
                  <p style={styles?.cardPrice}>
                    <span>{window?.Shopify?.currency?.active}</span>
                    {product?.price / 100}
                  </p>
                </div>
              </div>
            </div>
    );
};

export default ProductCard;