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
    <div className="about-view">
      <div className="container">
        {/* Header */}
        <div className="about-intro">
          <span className="section-badge">INFORMACIÓN OFICIAL</span>
          <h1 className="about-main-title">Retiros & Despachos</h1>
          <p className="about-lead">
            Conocé nuestro punto de retiro físico en San Martín, los horarios de atención y las opciones de envío a toda la Argentina.
          </p>
        </div>

        {/* 4 Clean Cards */}
        <div className="about-cards-grid">
          {/* Card 1: Retiro */}
          <div className="about-info-card">
            <div className="about-card-top">
              <FiMapPin className="about-ico" />
              <h3>Punto de Retiro San Martín</h3>
            </div>
            <p className="about-address-text">
              <strong>Dr. marcos zimmermann 3339</strong><br />
              (Entre Av. JM Campos y Pasaje 86)<br />
              San Martín, Provincia de Buenos Aires
            </p>
            <span className="about-note">
              Podés realizar tu pedido por la web y retirar sin costo de envío coordinando previamente por WhatsApp.
            </span>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary about-action-btn"
            >
              <span>Ver Ubicación en Google Maps</span>
              <FiArrowRight size={15} />
            </a>
          </div>

          {/* Card 2: Horarios */}
          <div className="about-info-card">
            <div className="about-card-top">
              <FiClock className="about-ico" />
              <h3>Horarios de Atención</h3>
            </div>
            <div className="about-hours-table">
              <div className="hours-row">
                <span>Lunes a Viernes:</span>
                <strong>10:00 a 20:00 hs</strong>
              </div>
              <div className="hours-row">
                <span>Sábados y Domingos:</span>
                <span className="text-muted">Cerrado (Consultas por WhatsApp)</span>
              </div>
            </div>
            <span className="about-note">
              Asesoramos en talles, medidas y combinaciones de prendas de forma directa y personalizada.
            </span>
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp about-action-btn"
            >
              <FaWhatsapp size={16} />
              <span>Consultar por WhatsApp</span>
            </a>
          </div>

          {/* Card 3: Envíos */}
          <div className="about-info-card">
            <div className="about-card-top">
              <FiTruck className="about-ico" />
              <h3>Logística Nacional</h3>
            </div>
            <p className="about-shipping-p">
              Despachamos pedidos a cualquier punto del país dentro de las 24 a 48 hs hábiles:
            </p>
            <ul className="about-shipping-bullets">
              <li>
                <strong>Andreani:</strong> Envíos a domicilio o retiro en sucursal con número de seguimiento.
              </li>
              <li>
                <strong>Vía Cargo:</strong> Despachos a terminales y agencias oficiales de todo el país.
              </li>
            </ul>
            <div className="about-pill-status">
              Seguimiento online en tiempo real de cada paquete.
            </div>
          </div>

          {/* Card 4: Redes & Canales */}
          <div className="about-info-card">
            <div className="about-card-top">
              <FiPhone className="about-ico" />
              <h3>Contacto Directo</h3>
            </div>
            <ul className="about-channel-list">
              <li>
                <FaWhatsapp className="text-whatsapp" />
                <div>
                  <span className="channel-lbl">WhatsApp Pedidos:</span>
                  <a href={chatUrl} target="_blank" rel="noopener noreferrer">
                    <strong>{STORE_INFO.phoneDisplay}</strong>
                  </a>
                </div>
              </li>
              <li>
                <FiInstagram className="text-orange" />
                <div>
                  <span className="channel-lbl">Instagram Oficial:</span>
                  <a href={STORE_INFO.instagramUrl} target="_blank" rel="noopener noreferrer">
                    <strong>{STORE_INFO.instagram}</strong>
                  </a>
                </div>
              </li>
              <li>
                <FiMail className="text-muted" />
                <div>
                  <span className="channel-lbl">Email:</span>
                  <strong>{STORE_INFO.email}</strong>
                </div>
              </li>
            </ul>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary about-action-btn"
            >
              <FaWhatsapp className="text-whatsapp" />
              <span>Unirme al Canal Oficial</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
