import { Link } from 'react-router-dom'
import { FiInstagram, FiMapPin, FiPhone, FiMail, FiClock, FiLock, FiTruck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { STORE_INFO } from '../../data/seedProducts'
import { getWhatsAppChannelUrl, generateGeneralInquiryLink } from '../../utils/whatsapp'
import './Footer.css'

const Footer = () => {
  const channelUrl = getWhatsAppChannelUrl()
  const whatsappChatUrl = generateGeneralInquiryLink()

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Col 1: Brand Lockup & Bio */}
          <div className="footer__brand">
            <Link to="/" onClick={handleLogoClick} className="footer__brand-lockup">
              <img src="/logo.jpg" alt="AzkabanStore" className="footer__logo-img" />
              <div className="footer__brand-texts">
                <span className="footer__brand-badge">AZKABAN<span className="text-orange">STORE</span></span>
                <span className="footer__brand-sub">INDUMENTARIA DEPORTIVA Y URBANA</span>
              </div>
            </Link>
            <p className="footer__desc">
              Tienda oficial de indumentaria deportiva y urbana. Buzos frizados, bermudas, remeras y conjuntos seleccionados. Retirá en nuestro local de San Martín o recibí tu compra en cualquier punto del país.
            </p>
            <div className="footer__socials">
              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-btn"
                title="Instagram"
              >
                <FiInstagram size={18} />
              </a>
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-btn footer__social-btn--wa"
                title="Canal de WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href={`mailto:${STORE_INFO.email}`}
                className="footer__social-btn"
                title="Email"
              >
                <FiMail size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Catálogo */}
          <div className="footer__section">
            <h4 className="footer__title">Colecciones</h4>
            <div className="footer__links">
              <Link to="/catalogo?category=buzos" className="footer__link">Buzos & Hoodies</Link>
              <Link to="/catalogo?category=bermudas" className="footer__link">Bermudas</Link>
              <Link to="/catalogo?category=remeras" className="footer__link">Remeras Urbanas</Link>
              <Link to="/catalogo?category=camisetas-futbol" className="footer__link">Camisetas de Fútbol</Link>
              <Link to="/catalogo?category=camperas" className="footer__link">Camperas Deportivas</Link>
              <Link to="/catalogo" className="footer__link">Todos los Productos</Link>
            </div>
          </div>

          {/* Col 3: Navegación & Envíos */}
          <div className="footer__section">
            <h4 className="footer__title">Información</h4>
            <div className="footer__links">
              <Link to="/" className="footer__link">Inicio</Link>
              <Link to="/catalogo" className="footer__link">Catálogo Completo</Link>
              <Link to="/nosotros" className="footer__link">Punto de Retiro & Envíos</Link>
              <a href={STORE_INFO.treintaCatalogUrl} target="_blank" rel="noopener noreferrer" className="footer__link">
                Ver en Treinta.co
              </a>
              <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="footer__link">
                Canal Oficial de WhatsApp
              </a>
              <Link to="/admin" className="footer__link footer__link--admin">
                <FiLock size={13} /> Panel de Administración
              </Link>
            </div>
          </div>

          {/* Col 4: Retiro & Contacto */}
          <div className="footer__section">
            <h4 className="footer__title">Punto de Retiro & Contacto</h4>
            <div className="footer__contact">
              <span className="footer__contact-item">
                <FiMapPin className="text-orange" />
                <span>Dr. marcos zimmermann 3339 (Entre Av. JM Campos y Pasaje 86). San Martín, Prov. Buenos Aires.</span>
              </span>
              <span className="footer__contact-item">
                <FiTruck className="text-orange" />
                <span>Despachos a todo el país por <strong>Andreani</strong> y <strong>Vía Cargo</strong> con código de seguimiento.</span>
              </span>
              <span className="footer__contact-item">
                <FiClock className="text-orange" />
                <span>Lunes a Viernes de 10:00 a 20:00 hs</span>
              </span>
              <a
                href={whatsappChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__contact-item footer__contact-wa"
              >
                <FaWhatsapp className="text-green" />
                <span>WhatsApp: <strong>+54 9 11 3793-4198</strong></span>
              </a>
              <a
                href={`mailto:${STORE_INFO.email}`}
                className="footer__contact-item"
              >
                <FiMail />
                <span>{STORE_INFO.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} AzkabanStore. Indumentaria Deportiva y Urbana. Todos los derechos reservados.</p>
          <div className="footer__badges">
            <span className="footer__badge-pill">Envíos Andreani & Vía Cargo</span>
            <span className="footer__badge-pill">Retiro gratis en San Martín</span>
            <span className="footer__badge-pill">Compras 100% Seguras</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
