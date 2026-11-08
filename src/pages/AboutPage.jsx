import { FiMapPin, FiClock, FiPhone, FiMail, FiInstagram, FiTruck, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { STORE_INFO } from '../data/seedProducts'
import { getWhatsAppChannelUrl, generateGeneralInquiryLink } from '../utils/whatsapp'
import './AboutPage.css'

const AboutPage = () => {
  const channelUrl = getWhatsAppChannelUrl()
  const chatUrl = generateGeneralInquiryLink()
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Dr. marcos zimmermann 3339, San Martin, Provincia de Buenos Aires'
  )}`

  return (
    <div className="about-page">
      <div className="container">
        {/* Header */}
        <div className="about-header">
          <span className="section-badge">INFORMACIÓN OFICIAL</span>
          <h1 className="section-title">
            Sobre <span className="text-orange">AzkabanStore</span>
          </h1>
          <p className="section-subtitle">
            Conocé nuestro punto de retiro físico en San Martín, horarios de atención y logística de despachos a toda la Argentina.
          </p>
        </div>

        {/* Info Grid */}
        <div className="about-grid">
          {/* Card 1: Ubicación & Retiros */}
          <div className="about-card">
            <div className="about-card__icon">
              <FiMapPin />
            </div>
            <h3>Punto de Retiro Físico</h3>
            <p className="about-card__address">
              <strong>Dr. marcos zimmermann 3339</strong><br />
              (Entre Av. JM Campos y Pasaje 86)<br />
              San Martín, Provincia de Buenos Aires
            </p>
            <div className="about-card__hint">
              Coordiná previamente tu pedido por WhatsApp para tenerlo empaquetado y listo para retirar.
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary about-card__btn"
            >
              <span>Abrir en Google Maps</span>
              <FiArrowRight size={16} />
            </a>
          </div>

          {/* Card 2: Horarios & Atención */}
          <div className="about-card">
            <div className="about-card__icon">
              <FiClock />
            </div>
            <h3>Horarios de Atención</h3>
            <div className="about-card__schedule">
              <div className="schedule-row">
                <span>Lunes a Viernes:</span>
                <strong>10:00 a 20:00 hs</strong>
              </div>
              <div className="schedule-row">
                <span>Sábados y Domingos:</span>
                <span className="text-muted">Cerrado (Atención vía mensajes)</span>
              </div>
            </div>
            <p className="about-card__note">
              Respondemos todas tus dudas sobre talles, medidas exactas y disponibilidad por WhatsApp de forma personalizada.
            </p>
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp about-card__btn"
            >
              <FaWhatsapp size={18} />
              <span>Chatear por WhatsApp</span>
            </a>
          </div>

          {/* Card 3: Envíos Nacionales */}
          <div className="about-card">
            <div className="about-card__icon">
              <FiTruck />
            </div>
            <h3>Logística & Despachos</h3>
            <p>
              Llegamos a cada rincón del país a través de los operadores logísticos líderes:
            </p>
            <ul className="about-card__list">
              <li>
                <strong>Andreani:</strong> Entregas seguras a domicilio o sucursales oficiales con tracking online.
              </li>
              <li>
                <strong>Vía Cargo:</strong> Envíos rápidos con retiro en terminales y agencias de encomienda.
              </li>
            </ul>
            <div className="about-card__footer-tag">
              🚀 Despachamos dentro de las 24 a 48 hs hábiles de acreditado el pago.
            </div>
          </div>

          {/* Card 4: Contacto & Redes */}
          <div className="about-card">
            <div className="about-card__icon">
              <FiPhone />
            </div>
            <h3>Canales de Comunicación</h3>
            <ul className="about-contact-list">
              <li>
                <FaWhatsapp className="contact-icon text-whatsapp" />
                <div>
                  <span>WhatsApp Oficial:</span>
                  <a href={chatUrl} target="_blank" rel="noopener noreferrer">
                    <strong>{STORE_INFO.phoneDisplay}</strong>
                  </a>
                </div>
              </li>
              <li>
                <FiInstagram className="contact-icon text-ig" />
                <div>
                  <span>Instagram Oficial:</span>
                  <a href={STORE_INFO.instagramUrl} target="_blank" rel="noopener noreferrer">
                    <strong>{STORE_INFO.instagram}</strong>
                  </a>
                </div>
              </li>
              <li>
                <FiMail className="contact-icon text-orange" />
                <div>
                  <span>Correo Electrónico:</span>
                  <strong>{STORE_INFO.email}</strong>
                </div>
              </li>
            </ul>

            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary about-card__btn"
            >
              <FaWhatsapp size={18} />
              <span>Unirme al Canal Oficial</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
