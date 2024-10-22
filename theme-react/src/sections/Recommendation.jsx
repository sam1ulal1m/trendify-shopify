import React from 'react';
import ProductCard from '../components/Product';
import useRecommendations from '../hooks/useRecommendation';

const Recommendation = ({data}) => {
    const intent = data?.type === 'automatic' ? 'related' : 'complementary'
    const { recommendations, loading: recLoading } = useRecommendations(window?.currentProduct?.id, intent)
  console.log("recommendations", recommendations)
    console.log("data", data)
    if(recLoading) {
        return <div>Loading...</div>
    }
    if(!recommendations) {
        return <div>No recommendation</div>
    }

    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
        }}>
            {
                recommendations?.products?.slice(0,4).map((product) => (
                    <ProductCard key={product?.id} product={product} />
                ))
            }
        </div>
    );
};

export default Recommendation;