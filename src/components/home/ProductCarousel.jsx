import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi'
import ProductCard from '../catalog/ProductCard'
import './ProductCarousel.css'

const ProductCarousel = ({ products = [], onOpenDetail }) => {
  const [activeTab, setActiveTab] = useState('all')
  const trackRef = useRef(null)

  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case 'buzos':
        return products.filter((p) => p.category === 'buzos')
      case 'bermudas':
        return products.filter((p) => p.category === 'bermudas')
      case 'featured':
        return products.filter((p) => p.featured)
      case 'all':
      default:
        return products
    }
  }, [products, activeTab])

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="product-carousel-section">
      <div className="container">
        {/* Header with Tabs & Controls */}
        <div className="carousel-header">
          <div>
            <span className="section-tag">CATÁLOGO EXCLUSIVO</span>
            <h2 className="section-heading">Prendas Destacadas</h2>
          </div>

          <div className="carousel-tabs-and-nav">
            <div className="carousel-tabs">
              <button
                className={`carousel-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Todas
              </button>
              <button
                className={`carousel-tab-btn ${activeTab === 'buzos' ? 'active' : ''}`}
                onClick={() => setActiveTab('buzos')}
              >
                Buzos
              </button>
              <button
                className={`carousel-tab-btn ${activeTab === 'bermudas' ? 'active' : ''}`}
                onClick={() => setActiveTab('bermudas')}
              >
                Bermudas
              </button>
              <button
                className={`carousel-tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
                onClick={() => setActiveTab('featured')}
              >
                Drops 2026
              </button>
            </div>

            <div className="carousel-nav-arrows">
              <button onClick={() => scroll('left')} aria-label="Anterior">
                <FiChevronLeft size={20} />
              </button>
              <button onClick={() => scroll('right')} aria-label="Siguiente">
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Track */}
        <div className="carousel-scroll-container" ref={trackRef}>
          <div className="carousel-items-track">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="carousel-product-wrap">
                <ProductCard product={prod} onOpenDetail={onOpenDetail} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <div className="carousel-footer-link">
          <Link to="/catalogo" className="btn-secondary">
            <span>Explorar Todo el Catálogo de AzkabanStore</span>
            <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProductCarousel
