import { Link } from 'react-router-dom'
import { FiInstagram, FiMail, FiPhone, FiMapPin, FiClock, FiLock, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp, FaTruck } from 'react-icons/fa'
import { STORE_INFO } from '../../data/seedProducts'
import { getWhatsAppChannelUrl, generateGeneralInquiryLink } from '../../utils/whatsapp'
import './Footer.css'

const Footer = () => {
  const channelUrl = getWhatsAppChannelUrl()
  const whatsappChatUrl = generateGeneralInquiryLink()

  return (
    <footer className="footer-main">
      <div className="container footer-grid">
        {/* Col 1: Brand */}
        <div className="footer-col footer-col--brand">
          <div className="footer-brand">
            <img src="/logo.jpg" alt="AzkabanStore" className="footer-logo" />
            <span className="footer-title">AZKABAN<span className="text-orange">STORE</span></span>
          </div>
          <p className="footer-desc">
            Tienda oficial de indumentaria deportiva y urbana. Buzos frizados, bermudas, remeras y conjuntos seleccionados con envíos a toda la Argentina.
          </p>
          <div className="footer-social-row">
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn"
              title="Instagram"
            >
              <FiInstagram size={17} />
            </a>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn"
              title="Canal de WhatsApp"
            >
              <FaWhatsapp size={17} />
            </a>
            <a
              href={`mailto:${STORE_INFO.email}`}
              className="footer-social-btn"
              title="Email"
            >
              <FiMail size={17} />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="footer-col">
          <h4 className="footer-heading">Navegación</h4>
          <ul className="footer-nav-list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo">Catálogo Completo</Link></li>
            <li><Link to="/nosotros">Punto de Retiro & Envíos</Link></li>
            <li><a href={STORE_INFO.treintaCatalogUrl} target="_blank" rel="noopener noreferrer">Catálogo en Treinta</a></li>
            <li><Link to="/admin"><FiLock size={12} /> Administración</Link></li>
          </ul>
        </div>

        {/* Col 3: Despachos */}
        <div className="footer-col">
          <h4 className="footer-heading">Logística & Envíos</h4>
          <div className="footer-carrier-card">
            <FaTruck className="text-orange" />
            <div>
              <strong>Andreani</strong>
              <p>A domicilio y sucursales en todo el país con número de guía.</p>
            </div>
          </div>
          <div className="footer-carrier-card">
            <FaTruck className="text-orange" />
            <div>
              <strong>Vía Cargo</strong>
              <p>Despachos a agencias y terminales de toda la Argentina.</p>
            </div>
          </div>
        </div>

        {/* Col 4: Atención & Ubicación */}
        <div className="footer-col">
          <h4 className="footer-heading">Punto de Retiro & Contacto</h4>
          <ul className="footer-contact-list">
            <li>
              <FiMapPin className="text-orange contact-ico" />
              <span>Dr. marcos zimmermann 3339 (Entre av JM campos y pasaje 86), San Martín, Prov. Buenos Aires.</span>
            </li>
            <li>
              <FiClock className="text-orange contact-ico" />
              <span>Lunes a Viernes de 10:00 a 20:00 hs</span>
            </li>
            <li>
              <FiPhone className="text-orange contact-ico" />
              <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" className="footer-wa-link">
                WhatsApp: {STORE_INFO.phoneDisplay}
              </a>
            </li>
            <li>
              <FiMail className="text-orange contact-ico" />
              <span>{STORE_INFO.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <p>© {new Date().getFullYear()} AzkabanStore. Indumentaria Deportiva y Urbana.</p>
          <div className="footer-safe-tags">
            <span>Envíos Andreani & Vía Cargo</span>
            <span>•</span>
            <span>Retiro sin cargo en San Martín</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
