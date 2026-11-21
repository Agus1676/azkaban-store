import { useState, useEffect } from 'react'
import HeroSlider from '../components/home/HeroSlider'
import CategoryBubbles from '../components/home/CategoryBubbles'
import ProductCarousel from '../components/home/ProductCarousel'
import FeaturedGrid from '../components/home/FeaturedGrid'
import TrustFeatures from '../components/home/TrustFeatures'
import CustomerReviewsSection from '../components/home/CustomerReviewsSection'
import ProductDetailModal from '../components/catalog/ProductDetailModal'
import { getStoredProducts } from '../services/storeDb'
import { updatePageSEO } from '../utils/seo'
import './HomePage.css'

const loadProducts = () => {
  return getStoredProducts().filter((p) => p && p.active !== false)
}

const HomePage = () => {
  const [products, setProducts] = useState(loadProducts)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    updatePageSEO({
      title: 'AzkabanStore | Indumentaria Deportiva y Urbana | Catálogo Online',
      description: 'Catálogo oficial de AzkabanStore en Argentina. Buzos frizados, bermudas de algodón, remeras oversize y conjuntos urbanos. Envíos a todo el país por Andreani y Vía Cargo.',
      canonical: 'https://www.azkabanstore.com.ar/',
    })
  }, [])

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
