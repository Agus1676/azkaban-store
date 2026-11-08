import { useState, useEffect } from 'react'
import HeroBanner from '../components/home/HeroBanner'
import CategoryChips from '../components/home/CategoryChips'
import FeaturedGrid from '../components/home/FeaturedGrid'
import TrustFeatures from '../components/home/TrustFeatures'
import ProductDetailModal from '../components/catalog/ProductDetailModal'
import { SEED_PRODUCTS, STORE_INFO } from '../data/seedProducts'
import { getWhatsAppChannelUrl } from '../utils/whatsapp'
import { FaWhatsapp } from 'react-icons/fa'
import { FiInstagram, FiArrowRight } from 'react-icons/fi'
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

  const channelUrl = getWhatsAppChannelUrl()

  return (
    <div className="home-view">
      {/* 1. Hero Lookbook Banner */}
      <HeroBanner />

      {/* 2. Categorías Rápidas */}
      <CategoryChips />

      {/* 3. Productos Destacados (Grid 2 col mobile) */}
      <FeaturedGrid products={products} onOpenDetail={setSelectedProduct} />

      {/* 4. Banner Comunidad Oficial */}
      <section className="community-strip">
        <div className="container">
          <div className="community-strip__box">
            <div className="community-strip__text">
              <span className="community-tag">CANALES OFICIALES</span>
              <h2>Enterate de los nuevos ingresos antes de que se agoten</h2>
              <p>
                Sumate a nuestro canal de WhatsApp para ver drops exclusivos y seguinos en Instagram para consultar talles y fotos reales.
              </p>
            </div>
            <div className="community-strip__actions">
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp community-btn"
              >
                <FaWhatsapp size={18} />
                <span>Unirme al Canal</span>
              </a>
              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary community-btn"
              >
                <FiInstagram size={17} />
                <span>Instagram @azkabanstore</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust Features Strip */}
      <TrustFeatures />

      {/* Product Detail Modal */}
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
