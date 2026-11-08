import { Link } from 'react-router-dom'
import { FiInstagram, FiMail, FiPhone, FiMapPin, FiClock, FiShield, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp, FaTruck } from 'react-icons/fa'
import { STORE_INFO } from '../../data/seedProducts'
import { getWhatsAppChannelUrl, generateGeneralInquiryLink } from '../../utils/whatsapp'
import './Footer.css'

const Footer = () => {
  const channelUrl = getWhatsAppChannelUrl()
  const whatsappChatUrl = generateGeneralInquiryLink()

  return (
    <footer className="footer">
      <div className="container footer-container">
        {/* Col 1: Brand & Bio */}
        <div className="footer-col footer-col--brand">
          <div className="footer-brand">
            <img src="/logo.jpg" alt="AzkabanStore" className="footer-logo" />
            <span className="footer-brand-title">AZKABAN<span className="text-orange">STORE</span></span>
          </div>
          <p className="footer-bio">
            Indumentaria deportiva y urbana seleccionada. Buzos frizados, bermudas, remeras y conjuntos de alta calidad con envíos a todo el país.
          </p>
          <div className="footer-socials">
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn social-btn--ig"
              title="Instagram"
            >
              <FiInstagram size={18} />
            </a>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn social-btn--wa"
              title="Canal de WhatsApp"
            >
              <FaWhatsapp size={18} />
            </a>
            <a
              href={`mailto:${STORE_INFO.email}`}
              className="social-btn social-btn--mail"
              title="Email"
            >
              <FiMail size={18} />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Navegación</h4>
          <ul className="footer-links">
            <li>
              <Link to="/"><FiArrowRight className="link-arrow" /> Inicio</Link>
            </li>
            <li>
              <Link to="/catalogo"><FiArrowRight className="link-arrow" /> Catálogo Completo</Link>
            </li>
            <li>
              <Link to="/nosotros"><FiArrowRight className="link-arrow" /> Punto de Retiro & Envíos</Link>
            </li>
            <li>
              <a href={STORE_INFO.treintaCatalogUrl} target="_blank" rel="noopener noreferrer">
                <FiArrowRight className="link-arrow" /> Ver en Treinta.co
              </a>
            </li>
            <li>
              <Link to="/admin"><FiShield className="link-arrow text-orange" /> Acceso Administración</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Envíos y Despacho */}
        <div className="footer-col">
          <h4 className="footer-heading">Despachos & Envíos</h4>
          <div className="footer-shipping-info">
            <div className="shipping-badge">
              <FaTruck className="text-orange" />
              <div>
                <strong>Andreani</strong>
                <p>Envíos a domicilio y sucursal en todo el país con código de seguimiento.</p>
              </div>
            </div>
            <div className="shipping-badge">
              <FaTruck className="text-orange" />
              <div>
                <strong>Vía Cargo</strong>
                <p>Despachos rápidos a terminales y agencias de toda la Argentina.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Col 4: Contacto & Retiro */}
        <div className="footer-col">
          <h4 className="footer-heading">Atención & Retiros</h4>
          <ul className="footer-contact">
            <li>
              <FiMapPin className="contact-icon text-orange" />
              <div>
                <strong>Retiro en persona:</strong>
                <span>Dr. marcos zimmermann 3339 (Entre av JM campos y pasaje 86). San Martín, Prov. Buenos Aires.</span>
              </div>
            </li>
            <li>
              <FiClock className="contact-icon text-orange" />
              <div>
                <strong>Horario de atención:</strong>
                <span>Lunes a Viernes de 10:00 a 20:00 hs</span>
              </div>
            </li>
            <li>
              <FiPhone className="contact-icon text-orange" />
              <div>
                <strong>WhatsApp Pedidos:</strong>
                <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" className="phone-link">
                  {STORE_INFO.phoneDisplay}
                </a>
              </div>
            </li>
            <li>
              <FiMail className="contact-icon text-orange" />
              <div>
                <strong>Email:</strong>
                <span>{STORE_INFO.email}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <p>© {new Date().getFullYear()} AzkabanStore. Todos los derechos reservados.</p>
          <div className="footer-bottom__badges">
            <span className="safe-badge">🔒 Compras 100% Seguras</span>
            <span className="safe-badge">⚡ Envíos Andreani & Vía Cargo</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
