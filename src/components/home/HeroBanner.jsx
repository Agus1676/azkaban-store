import { Link } from 'react-router-dom'
import { FiArrowRight, FiShield, FiTruck, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { STORE_INFO } from '../../data/seedProducts'
import { getWhatsAppChannelUrl } from '../../utils/whatsapp'
import './HeroBanner.css'

const HeroBanner = () => {
  const channelUrl = getWhatsAppChannelUrl()

  return (
    <section className="hero-banner">
      <div className="container hero-container">
        {/* Left Column: Headline & CTA */}
        <div className="hero-content">
          <span className="hero-tag">COLECCIÓN TEMPORADA 2026</span>
          <h1 className="hero-title">
            Indumentaria deportiva y urbana con la <span className="text-orange">mejor calidad</span>.
          </h1>
          <p className="hero-description">
            Buzos frizados, bermudas, remeras y conjuntos seleccionados. Retirá en nuestro local en <strong>San Martín</strong> o recibí tu paquete en cualquier punto del país por <strong>Andreani</strong> y <strong>Vía Cargo</strong>.
          </p>

          <div className="hero-cta-group">
            <Link to="/catalogo" className="btn-primary hero-main-btn">
              <span>Ver Catálogo Completo</span>
              <FiArrowRight size={16} />
            </Link>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary hero-channel-btn"
            >
              <FaWhatsapp className="text-whatsapp" size={17} />
              <span>Canal de WhatsApp</span>
            </a>
          </div>

          <div className="hero-highlights">
            <div className="highlight-item">
              <FiTruck className="highlight-icon" />
              <span>Envíos Andreani & Vía Cargo</span>
            </div>
            <div className="highlight-item">
              <FiMapPin className="highlight-icon" />
              <span>Punto de Retiro San Martín</span>
            </div>
            <div className="highlight-item">
              <FiShield className="highlight-icon" />
              <span>Atención Lun a Vie 10 a 20hs</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Lookbook Visual */}
        <div className="hero-visual">
          <div className="lookbook-card">
            <img
              src="https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/6c5fcc88-8047-5596-9bc2-270de9b2a0e8.jpeg"
              alt="Buzo Medio Cierre 2026 Selección Argentina"
              className="lookbook-img"
            />
            <div className="lookbook-info">
              <span className="lookbook-badge">NUEVO DROP</span>
              <h3>Buzo Medio Cierre 2026 Azul</h3>
              <div className="lookbook-footer">
                <span className="lookbook-price">$ 47.500</span>
                <Link to="/catalogo?category=buzos" className="lookbook-link">
                  Ver Detalles →
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
