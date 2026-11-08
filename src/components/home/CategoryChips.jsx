import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../../data/seedProducts'
import './CategoryChips.css'

const CategoryChips = ({ activeCategory, onSelectCategory }) => {
  const navigate = useNavigate()

  const handleChipClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId)
    } else {
      navigate(`/catalogo?category=${catId}`)
    }
  }

  return (
    <section className="category-chips-section">
      <div className="container">
        <div className="category-chips-header">
          <span className="section-badge">COLECCIONES</span>
          <h2 className="section-title">Explorá por <span className="text-orange">Categoría</span></h2>
        </div>

        <div className="category-chips-scroll">
          {CATEGORIES.slice(0, 10).map((cat) => (
            <button
              key={cat.id}
              className={`category-chip-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleChipClick(cat.id)}
            >
              <span className="category-chip-icon">{cat.icon}</span>
              <span className="category-chip-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryChips
