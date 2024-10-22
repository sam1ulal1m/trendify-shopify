import { useEffect, useState } from 'react'
import './App.css'
import useRecommendations from './hooks/useRecommendation'
import ProductCarousel from './components/ProductCarousel'
import Recommendation from './sections/Recommendation'
import FBT from './sections/FBT'
import { ProductList } from './components/ManualProducts'

function App() {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // async useEffecgt with cleanup
  useEffect(() => {
    // cleanup function
    let isMounted = true
    // async function
    async function fetchRecommendation() {
      setLoading(true)
      try {
        const response = await fetch('https://doll-suzuki-space-items.trycloudflare.com/api/trendify?' + `productId=gid://shopify/Product/${window?.currentProduct?.id}&shop=${window?.Shopify?.shop}`)
        const data = await response.json()
        if (isMounted) {
          setRecommendation(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendation()
    // cleanup function
    return () => {
      isMounted = false
    }
  }
    , [])
  if (loading) {
    return (
      <>
        Loading...
      </>
    )
  }
  if (!recommendation) {
    return (
      <>
        No recommendation
      </>
    )
  }

  switch (recommendation?.type) {
    case 'automatic':
    return (
      <>
        <Recommendation data={recommendation} />
      </>
    )
    case 'manual':
    return (
      <>
        <ProductList products={recommendation?.products} />
      </>
    )

    case 'frequently_bought_together':
    return (
      <>
       <FBT />
      </>
    )
  
    default:
      return null;
  }

 
}

export default App
