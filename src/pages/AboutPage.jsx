import { useState, useEffect } from 'react'
import { FiMapPin, FiClock, FiPhone, FiMail, FiInstagram, FiTruck, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { STORE_INFO } from '../data/seedProducts'
import { getStoredConfig } from '../services/storeDb'
import { getWhatsAppChannelUrl, generateGeneralInquiryLink } from '../utils/whatsapp'
import { updatePageSEO } from '../utils/seo'
import './AboutPage.css'

const AboutPage = () => {
  const [config, setConfig] = useState(getStoredConfig)

  useEffect(() => {
    updatePageSEO({
      title: 'Punto de Retiro & Envíos Andreani Express | AzkabanStore San Martín',
      description: 'Retirá tu compra gratis en nuestro punto de San Martín o recibila en tu domicilio en cualquier punto de Argentina exclusivamente por Andreani con tracking oficial.',
      canonical: 'https://www.azkabanstore.com.ar/nosotros',
    })
  }, [])

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

          {/* Card 3: Envíos Exclusivos por Andreani */}
          <div className="about-info-card about-info-card--shipping">
            <div className="about-card-top">
              <div className="about-card-top__icon-badge">
                <FiTruck className="about-ico" />
              </div>
              <div>
                <h3>Envíos por Andreani Express</h3>
                <span className="about-card-top__tag">Cobertura Nacional 100%</span>
              </div>
            </div>

            <p className="about-shipping-p">
              Despachamos todas las compras a cualquier punto del país dentro de las 24 a 48 hs hábiles:
            </p>

            <div className="about-shipping-options">
              <div className="about-shipping-pill">
                <div className="about-shipping-pill__header">
                  <strong>🏠 Entrega a Domicilio</strong>
                  <span className="pill-badge-green">24 a 72 hs</span>
                </div>
                <p>El cartero de Andreani entrega el paquete en mano en tu domicilio o lugar de trabajo.</p>
              </div>

              <div className="about-shipping-pill">
                <div className="about-shipping-pill__header">
                  <strong>🏢 Retiro en Sucursal Andreani</strong>
                  <span className="pill-badge-blue">Económico</span>
                </div>
                <p>Retirá cuando quieras en la sucursal Andreani o punto pick-up más cercano a tu ciudad.</p>
              </div>
            </div>

            <div className="about-pill-status">
              <span>🚚 Despachos de lunes a viernes • Código de seguimiento online</span>
            </div>
          </div>

          {/* Card 4: Redes & Contacto Directo */}
          <div className="about-info-card about-info-card--contact">
            <div className="about-card-top">
              <div className="about-card-top__icon-badge about-card-top__icon-badge--orange">
                <FiPhone className="about-ico" />
              </div>
              <div>
                <h3>Canales Oficiales</h3>
                <span className="about-card-top__tag">Atención Personalizada</span>
              </div>
            </div>

            <div className="about-contact-list">
              {/* WhatsApp Ventas */}
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-tile"
              >
                <div className="about-contact-tile__icon about-contact-tile__icon--whatsapp">
                  <FaWhatsapp size={20} />
                </div>
                <div className="about-contact-tile__body">
                  <span className="tile-category">VENTAS & ASESORAMIENTO</span>
                  <strong className="tile-value">{config?.phoneDisplay || STORE_INFO.phoneDisplay}</strong>
                </div>
                <span className="tile-action">Chatear ↗</span>
              </a>

              {/* Instagram */}
              <a
                href={config?.instagramUrl || STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-tile"
              >
                <div className="about-contact-tile__icon about-contact-tile__icon--instagram">
                  <FiInstagram size={18} />
                </div>
                <div className="about-contact-tile__body">
                  <span className="tile-category">INSTAGRAM OFICIAL</span>
                  <strong className="tile-value">{config?.instagram || STORE_INFO.instagram}</strong>
                </div>
                <span className="tile-action">Seguir ↗</span>
              </a>

              {/* Canal de WhatsApp */}
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-tile"
              >
                <div className="about-contact-tile__icon about-contact-tile__icon--channel">
                  <FaWhatsapp size={20} />
                </div>
                <div className="about-contact-tile__body">
                  <span className="tile-category">CANAL VIP DE WHATSAPP</span>
                  <strong className="tile-value">Drops & Descuentos Exclusivos</strong>
                </div>
                <span className="tile-action">Unirme ↗</span>
              </a>

              {/* Correo Electrónico */}
              <a
                href={`mailto:${config?.email || STORE_INFO.email}`}
                className="about-contact-tile"
              >
                <div className="about-contact-tile__icon about-contact-tile__icon--email">
                  <FiMail size={18} />
                </div>
                <div className="about-contact-tile__body">
                  <span className="tile-category">CORREO ELECTRÓNICO</span>
                  <strong className="tile-value">{config?.email || STORE_INFO.email}</strong>
                </div>
                <span className="tile-action">Escribir ↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
