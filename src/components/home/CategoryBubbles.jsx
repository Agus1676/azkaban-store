import { Link } from 'react-router-dom'
import './CategoryBubbles.css'

const CATEGORY_BUBBLES = [
  {
    id: 'buzos',
    name: 'Buzos & Hoodies',
    tag: 'Top Ventas',
    img: 'https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/6c5fcc88-8047-5596-9bc2-270de9b2a0e8.jpeg',
    link: '/catalogo?category=buzos',
    highlight: 'Semi Friza',
  },
  {
    id: 'bermudas',
    name: 'Bermudas',
    tag: 'Tendencia',
    img: 'https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/0889407e-03b0-53f3-9af0-01523b5c12de.jpeg',
    link: '/catalogo?category=bermudas',
    highlight: 'Algodón 100%',
  },
  {
    id: 'jordan',
    name: 'Colección Jordan',
    tag: 'Calidad AAA',
    img: 'https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/770125ad-51c9-5266-a213-a1c3fc6bd468.jpeg',
    link: '/catalogo?search=jordan',
    highlight: 'Bordados',
  },
  {
    id: 'bmw',
    name: 'BMW Motorsport',
    tag: 'Exclusivo',
    img: 'https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/15ffd48e-5c68-5587-abc7-3799a6224d1c.jpeg',
    link: '/catalogo?search=bmw',
    highlight: 'Con Cierre',
  },
  {
    id: 'nike',
    name: 'Línea Nike',
    tag: 'Esenciales',
    img: 'https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/21492546-00c4-5cdc-89b5-be0f81050360.jpeg',
    link: '/catalogo?search=nike',
    highlight: 'Pastel & Negro',
  },
  {
    id: 'argentina-2026',
    name: 'Edición 2026',
    tag: 'Nuevos Drops',
    img: 'https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/1332ec61-8e70-5a4f-9dac-d36cfa7869c8.jpeg',
    link: '/catalogo?search=2026',
    highlight: 'Medio Cierre',
  },
]

const CategoryBubbles = () => {
  return (
    <section className="category-bubbles-section">
      <div className="container">
        <div className="category-bubbles__header">
          <div className="category-bubbles__title-wrap">
            <span className="section-tag">EXPLORÁ NUESTRAS COLECCIONES</span>
            <h2 className="section-heading">Categorías en Tendencia</h2>
          </div>
          <Link to="/catalogo" className="category-bubbles__see-all">
            Ver Todo el Catálogo →
          </Link>
        </div>

        <div className="category-bubbles__container">
          <div className="category-bubbles__track">
            {CATEGORY_BUBBLES.map((cat) => (
              <Link key={cat.id} to={cat.link} className="category-bubble__item">
                <div className="category-bubble__img-wrap">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="category-bubble__img"
                    onError={(e) => { e.target.src = '/logo.jpg' }}
                  />
                  <span className="category-bubble__tag">{cat.tag}</span>
                </div>
                <span className="category-bubble__name">{cat.name}</span>
                <span className="category-bubble__highlight">{cat.highlight}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategoryBubbles
