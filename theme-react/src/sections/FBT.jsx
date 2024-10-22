import React, { useEffect, useState } from 'react';
import ProductList from '../components/FBTProduct';

const FBT = () => {
    const [recommendedProducts, setRecommendedProducts] = useState(null)
    const [loading, setLoading] = useState(false)
    const handle = window?.currentProduct?.handle
    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            setLoading(true)
            try {
                const response = await fetch(`https://trendify99-722133f42363.herokuapp.com/api/products-by-handle?handle=${handle}&shop=${window?.Shopify?.shop}`)
                const data = await response.json()
                setRecommendedProducts(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
fetchRecommendedProducts()
    }, [])
    console.log("recommendedProducts", recommendedProducts)
    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <div>
           <ProductList products={recommendedProducts?.products} />
        </div>
    );
};

export default FBT;