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
            <span className="section-badge">LO MÁS BUSCADO</span>
            <h2 className="section-title">Productos <span className="text-orange">Destacados</span></h2>
            <p className="section-subtitle">
              Selección exclusiva de buzos frizados, bermudas y prendas de alta rotación.
            </p>
          </div>
          <Link to="/catalogo" className="btn-secondary view-all-btn">
            <span>Ver todo el catálogo</span>
            <FiArrowRight size={16} />
          </Link>
        </div>

        <div className="featured-grid">
          {featured.map((prod) => (
            <ProductCard key={prod.id} product={prod} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedGrid
