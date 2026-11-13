import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiShield,
  FiAlertTriangle,
  FiCheckCircle,
  FiTag,
  FiArrowRight,
  FiHelpCircle,
  FiClock,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { getReturnPolicy } from '../data/policies'
import { STORE_INFO } from '../data/seedProducts'
import { generateGeneralInquiryLink } from '../utils/whatsapp'
import './ReturnPolicyPage.css'

const getStoredConfig = () => {
  try {
    const saved = localStorage.getItem('azkaban_store_config')
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn(e)
  }
  return STORE_INFO
}

const ReturnPolicyPage = () => {
  const [policies, setPolicies] = useState(getReturnPolicy)
  const [config, setConfig] = useState(getStoredConfig)

  useEffect(() => {
    const handleConfig = () => {
      setPolicies(getReturnPolicy())
      setConfig(getStoredConfig())
    }
    window.addEventListener('azkaban_config_updated', handleConfig)
    return () => window.removeEventListener('azkaban_config_updated', handleConfig)
  }, [])

  const whatsappUrl = generateGeneralInquiryLink()

  return (
    <div className="policy-view">
      <div className="container">
        {/* Header */}
        <div className="policy-header">
          <span className="section-badge">
            <FiShield size={13} style={{ marginRight: 6 }} /> TÉRMINOS Y CONDICIONES
          </span>
          <h1 className="policy-main-title">Políticas de Cambios y Devoluciones</h1>
          <p className="policy-lead">
            En AzkabanStore priorizamos la calidad y la transparencia. Conocé en detalle las condiciones para gestionar cambios y cuidar tu compra.
          </p>
        </div>

        {/* 3 Main Pillars Cards */}
        <div className="policy-pillars-grid">
          {/* Pilar 1 */}
          <div className="policy-card policy-card--highlight">
            <div className="policy-card__icon-box policy-card__icon-box--orange">
              <FiAlertTriangle />
            </div>
            <h3 className="policy-card__title">Cambios por Falla</h3>
            <p className="policy-card__desc">
              Solamente se realizan cambios de la prenda si la misma presenta alguna <strong>falla o defecto de fábrica</strong> al momento de la entrega o recepción.
            </p>
            <span className="policy-card__badge policy-card__badge--ok">Garantía asegurada</span>
          </div>

          {/* Pilar 2 */}
          <div className="policy-card">
            <div className="policy-card__icon-box policy-card__icon-box--gray">
              <FiTag />
            </div>
            <h3 className="policy-card__title">Elección de Modelo o Talle</h3>
            <p className="policy-card__desc">
              Si el producto recibido coincide con lo solicitado y <strong>no es el que querías por gusto o elección personal</strong>, no se aceptan devoluciones. Te sugerimos consultar medidas por WhatsApp antes de confirmar tu pedido.
            </p>
            <span className="policy-card__badge policy-card__badge--neutral">Sin cambios por arrepentimiento</span>
          </div>

          {/* Pilar 3 */}
          <div className="policy-card">
            <div className="policy-card__icon-box policy-card__icon-box--green">
              <FiCheckCircle />
            </div>
            <h3 className="policy-card__title">Reintegro de Dinero</h3>
            <p className="policy-card__desc">
              En caso de prenda fallada, se prioriza el reemplazo por otra unidad idéntica o del mismo valor. Si no existiera reemplazo posible y se deba reintegrar el dinero, la prenda debe estar en <strong>perfectas condiciones, sin uso y con su etiqueta puesta</strong>.
            </p>
            <span className="policy-card__badge policy-card__badge--tag">Etiqueta & sin uso requeridos</span>
          </div>
        </div>

        {/* Direct Rules List (Dynamic from admin config) */}
        <div className="policy-rules-box">
          <div className="policy-rules-box__header">
            <FiHelpCircle className="policy-rules-icon" />
            <div>
              <h3>Condiciones Oficiales Vigentes</h3>
              <p>Resumen reglamentario aplicable a todas las órdenes de AzkabanStore</p>
            </div>
          </div>
          <ul className="policy-rules-list">
            {policies.map((p, idx) => (
              <li key={idx} className="policy-rule-item">
                <span className="policy-rule-bullet">{idx + 1}</span>
                <span className="policy-rule-text">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps to proceed */}
        <div className="policy-steps">
          <h2 className="policy-steps__title">¿Cómo gestionar un cambio si tu prenda tiene falla?</h2>
          <div className="policy-steps__grid">
            <div className="policy-step">
              <div className="policy-step__num">1</div>
              <h4>Escribinos por WhatsApp</h4>
              <p>Comunicate dentro de las 48 hs de recibido tu pedido indicando número de orden y prenda recibida.</p>
            </div>
            <div className="policy-step">
              <div className="policy-step__num">2</div>
              <h4>Enviá fotos o video</h4>
              <p>Adjuntá fotos o video nítido mostrando el detalle de la falla y la etiqueta original colocada en la prenda.</p>
            </div>
            <div className="policy-step">
              <div className="policy-step__num">3</div>
              <h4>Coordinación rápida</h4>
              <p>Coordinamos el cambio en nuestro punto de retiro en San Martín o mediante despacho de logística (Andreani / Vía Cargo).</p>
            </div>
          </div>
        </div>

        {/* Help CTA Box */}
        <div className="policy-cta-card">
          <div className="policy-cta-content">
            <h3>¿Tenés alguna duda sobre tu compra?</h3>
            <p>
              Estamos a tu disposición en WhatsApp para responder cualquier consulta sobre talles, calidad de telas o seguimiento de envíos.
            </p>
          </div>
          <div className="policy-cta-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--whatsapp"
            >
              <FaWhatsapp size={18} /> Consultar por WhatsApp
            </a>
            <Link to="/catalogo" className="btn btn--outline">
              Explorar Catálogo <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnPolicyPage
