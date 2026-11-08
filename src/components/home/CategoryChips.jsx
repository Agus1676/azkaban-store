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
        <div className="category-chips-scroll">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              className={`category-chip-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleChipClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryChips
