import { FiStar, FiCheck, FiShield } from 'react-icons/fi'
import './CustomerReviewsSection.css'

const REVIEWS = [
  {
    id: 1,
    name: 'Matías S.',
    item: 'Buzo BMW Motorsport Cierre',
    location: 'Retiró en San Martín',
    rating: 5,
    date: '2026-03-22',
    text: 'Fui a retirar al local en San Martín. La tela es tremenda, pesada y con muy buenas terminaciones y cierres. Me asesoraron de 10 con el talle antes de ir.',
  },
  {
    id: 2,
    name: 'Gonzalo B.',
    item: '2x Buzos Jordan Bordados',
    location: 'Envío Andreani a Rosario',
    rating: 5,
    date: '2026-03-15',
    text: 'Compré con envío por Andreani. En menos de 48hs ya tenía el tracking y el paquete en mi casa. La friza es abrigada y suave, calidad 10 de 10.',
  },
  {
    id: 3,
    name: 'Valentina M.',
    item: 'Bermuda Rústica + Hoodie',
    location: 'San Isidro, Bs. As.',
    rating: 5,
    date: '2026-03-08',
    text: 'Excelente la atención por WhatsApp. Me pasaron las medidas exactas en centímetros para estar segura con el talle. Calce impecable, vuelvo a comprar seguro.',
  },
]

const CustomerReviewsSection = () => {
  return (
    <section className="customer-reviews">
      <div className="container">
        <div className="customer-reviews__header text-center">
          <span className="section-badge">OPINIONES REALES</span>
          <h2 className="section-title">Comunidad AzkabanStore</h2>
          <p className="section-subtitle">
            Clientes que visten nuestras prendas en todo el país.
          </p>
        </div>

        {/* Score Bar */}
        <div className="customer-reviews__score-card">
          <div className="customer-reviews__score-left">
            <span className="customer-reviews__score-number">4.9</span>
            <div className="customer-reviews__score-stars">
              <div className="customer-reviews__stars-row">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="star-filled" />
                ))}
              </div>
              <span className="customer-reviews__score-count">
                Más de 480 pedidos despachados
              </span>
            </div>
          </div>
          <div className="customer-reviews__score-right">
            <span>
              <FiShield className="text-orange" />
              Prendas seleccionadas y garantía de cambio
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="customer-reviews__grid">
          {REVIEWS.map((rev) => (
            <article key={rev.id} className="customer-reviews__card">
              <div className="customer-reviews__card-header">
                <div className="customer-reviews__avatar">
                  {rev.name.charAt(0)}
                </div>
                <div className="customer-reviews__user-info">
                  <div className="customer-reviews__name-row">
                    <strong className="customer-reviews__name">{rev.name}</strong>
                    <span className="customer-reviews__verified">
                      <FiCheck size={12} /> Compra verificada
                    </span>
                  </div>
                  <span className="customer-reviews__detail">
                    {rev.item} • {rev.location}
                  </span>
                </div>
              </div>

              <div className="customer-reviews__card-stars">
                {[...Array(rev.rating)].map((_, i) => (
                  <FiStar key={i} className="star-filled" />
                ))}
              </div>

              <p className="customer-reviews__text">"{rev.text}"</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CustomerReviewsSection
