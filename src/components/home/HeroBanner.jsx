import { Link } from 'react-router-dom'
import { FiArrowRight, FiShield, FiTruck, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { STORE_INFO } from '../../data/seedProducts'
import { getWhatsAppChannelUrl, generateGeneralInquiryLink } from '../../utils/whatsapp'
import './HeroBanner.css'

const HeroBanner = () => {
  const channelUrl = getWhatsAppChannelUrl()
  const chatUrl = generateGeneralInquiryLink()

  return (
    <section className="hero-banner">
      <div className="hero-banner__bg-glow"></div>
      <div className="container hero-banner__content">
        <div className="hero-banner__text">
          <div className="hero-badge">
            <span className="hero-badge__dot"></span>
            <span>TEMPORADA 2026 • INDUMENTARIA PREMIUM</span>
          </div>

          <h1 className="hero-title">
            ESTILO URBANO Y <br />
            <span className="text-orange">DEPORTIVO</span> DE ALTO NIVEL
          </h1>

          <p className="hero-desc">
            Buzos frizados, bermudas, remeras y conjuntos seleccionados. Retirá en nuestro punto de entrega en <strong>San Martín</strong> o recibí tu pedido en cualquier punto del país por <strong>Andreani</strong> y <strong>Vía Cargo</strong>.
          </p>

          <div className="hero-actions">
            <Link to="/catalogo" className="btn-primary hero-btn-main">
              <span>VER CATÁLOGO COMPLETO</span>
              <FiArrowRight size={18} />
            </Link>

            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp hero-btn-channel"
            >
              <FaWhatsapp size={20} />
              <span>CANAL DE WHATSAPP</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="hero-stats">
            <div className="hero-stat-item">
              <FiTruck className="text-orange" />
              <div>
                <strong>Andreani / Vía Cargo</strong>
                <span>Envíos a todo el país</span>
              </div>
            </div>
            <div className="hero-stat-item">
              <FiMapPin className="text-orange" />
              <div>
                <strong>San Martín, Bs. As.</strong>
                <span>Punto de retiro físico</span>
              </div>
            </div>
            <div className="hero-stat-item">
              <FiShield className="text-orange" />
              <div>
                <strong>Lunes a Viernes</strong>
                <span>10:00 a 20:00 hs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="hero-banner__visual">
          <div className="hero-card-featured">
            <div className="hero-card__tag">DESTACADO 2026</div>
            <img
              src="https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/6c5fcc88-8047-5596-9bc2-270de9b2a0e8.jpeg"
              alt="Buzo Medio Cierre 2026 Azul"
              className="hero-card__img"
            />
            <div className="hero-card__info">
              <span className="hero-card__brand">Selección Argentina</span>
              <h4>Buzo Medio Cierre 2026 Azul</h4>
              <div className="hero-card__bottom">
                <span className="hero-card__price">$47.500</span>
                <Link to="/catalogo" className="hero-card__link">
                  Ver en Catálogo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
