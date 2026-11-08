import { useState, useEffect } from 'react'
import HeroSlider from '../components/home/HeroSlider'
import CategoryBubbles from '../components/home/CategoryBubbles'
import ProductCarousel from '../components/home/ProductCarousel'
import FeaturedGrid from '../components/home/FeaturedGrid'
import TrustFeatures from '../components/home/TrustFeatures'
import CustomerReviewsSection from '../components/home/CustomerReviewsSection'
import ProductDetailModal from '../components/catalog/ProductDetailModal'
import { SEED_PRODUCTS } from '../data/seedProducts'
import './HomePage.css'

const loadProducts = () => {
  try {
    const saved = localStorage.getItem('azkaban_products')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((p) => p && p.active !== false)
      }
    }
  } catch (e) {
    console.warn('Error reading products:', e)
  }
  return SEED_PRODUCTS.filter((p) => p.active !== false)
}

const HomePage = () => {
  const [products, setProducts] = useState(loadProducts)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const handleUpdate = () => setProducts(loadProducts())
    window.addEventListener('azkaban_products_updated', handleUpdate)
    return () => window.removeEventListener('azkaban_products_updated', handleUpdate)
  }, [])

  return (
    <div className="home-view">
      {/* 1. Hero Promo Lookbook Slider */}
      <HeroSlider />

      {/* 2. Categorías en Círculos (Category Bubbles) */}
      <CategoryBubbles />

      {/* 3. Carrusel Interactivo con Pestañas */}
      <ProductCarousel products={products} onOpenDetail={setSelectedProduct} />

      {/* 4. Grilla de Productos Destacados */}
      <FeaturedGrid products={products} onOpenDetail={setSelectedProduct} />

      {/* 5. Franja de Beneficios & Envíos */}
      <TrustFeatures />

      {/* 6. Opiniones de Clientes Verificadas */}
      <CustomerReviewsSection />

      {/* Modal de Detalle de Prenda */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}

export default HomePage
