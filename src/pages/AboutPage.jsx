import { useState, useEffect } from 'react'
import { FiMapPin, FiClock, FiPhone, FiMail, FiInstagram, FiTruck, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { STORE_INFO } from '../data/seedProducts'
import { getWhatsAppChannelUrl, generateGeneralInquiryLink } from '../utils/whatsapp'
import './AboutPage.css'

const getStoredConfig = () => {
  try {
    const saved = localStorage.getItem('azkaban_store_config')
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn(e)
  }
  return STORE_INFO
}

const AboutPage = () => {
  const [config, setConfig] = useState(getStoredConfig)

  useEffect(() => {
    const handleConfig = () => setConfig(getStoredConfig())
    window.addEventListener('azkaban_config_updated', handleConfig)
    return () => window.removeEventListener('azkaban_config_updated', handleConfig)
  }, [])

  const channelUrl = config?.whatsappChannelUrl || getWhatsAppChannelUrl()
  const chatUrl = generateGeneralInquiryLink()
  const currentAddress = config?.address || STORE_INFO.address
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    currentAddress
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
              <strong>{currentAddress}</strong>
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
                <strong>{config?.hours || STORE_INFO.hours}</strong>
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
              <span>🚚 Despachos diarios con código de tracking</span>
            </div>
          </div>

          {/* Card 4: Redes & Contacto Directo */}
          <div className="about-info-card">
            <div className="about-card-top">
              <FiPhone className="about-ico" />
              <h3>Canales Oficiales</h3>
            </div>
            <div className="about-contact-list">
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-row"
              >
                <FaWhatsapp className="text-green" />
                <div>
                  <strong>WhatsApp de Ventas</strong>
                  <span>{config?.phoneDisplay || STORE_INFO.phoneDisplay}</span>
                </div>
              </a>

              <a
                href={config?.instagramUrl || STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-row"
              >
                <FiInstagram className="text-orange" />
                <div>
                  <strong>Instagram</strong>
                  <span>{config?.instagram || STORE_INFO.instagram}</span>
                </div>
              </a>

              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-row"
              >
                <FaWhatsapp className="text-green" />
                <div>
                  <strong>Canal de Novedades</strong>
                  <span>Drops, ingresos y promociones exclusivas</span>
                </div>
              </a>

              <a
                href={`mailto:${config?.email || STORE_INFO.email}`}
                className="about-contact-row"
              >
                <FiMail />
                <div>
                  <strong>Correo Electrónico</strong>
                  <span>{config?.email || STORE_INFO.email}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
