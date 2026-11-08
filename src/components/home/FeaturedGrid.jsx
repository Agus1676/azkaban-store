import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import ProductCard from '../catalog/ProductCard'
import './FeaturedGrid.css'

const FeaturedGrid = ({ products, onOpenDetail }) => {
  const featured = products.filter((p) => p.featured || p.badge).slice(0, 8)

  return (
    <section className="featured-section">
      <div className="container">
        <div className="featured-section__header">
          <div>
            <span className="section-badge">DESTACADOS</span>
            <h2 className="section-title">Prendas en Tendencia</h2>
            <p className="section-subtitle">
              Los buzos y bermudas más elegidos de nuestra colección.
            </p>
          </div>
          <Link to="/catalogo" className="btn-secondary featured-all-btn">
            <span>Ver Todo el Catálogo</span>
            <FiArrowRight size={16} />
          </Link>
        </div>

        <div className="products-grid-responsive">
          {featured.map((prod) => (
            <ProductCard key={prod.id} product={prod} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedGrid
