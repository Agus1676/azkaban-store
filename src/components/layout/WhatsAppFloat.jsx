import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { generateGeneralInquiryLink } from '../../utils/whatsapp'
import './WhatsAppFloat.css'

const WhatsAppFloat = () => {
  const [showTooltip, setShowTooltip] = useState(true)
  const chatUrl = generateGeneralInquiryLink()

  return (
    <div className="whatsapp-float-container">
      {showTooltip && (
        <div className="whatsapp-tooltip">
          <button
            className="whatsapp-tooltip__close"
            onClick={() => setShowTooltip(false)}
            aria-label="Cerrar tooltip"
          >
            <FiX size={12} />
          </button>
          <span className="whatsapp-tooltip__badge">EN LÍNEA</span>
          <p className="whatsapp-tooltip__text">
            ¿Tenés dudas de talles o envíos? <strong>Escribinos acá</strong> 👋
          </p>
        </div>
      )}

      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Consultar por WhatsApp"
      >
        <span className="whatsapp-pulse"></span>
        <FaWhatsapp size={32} />
      </a>
    </div>
  )
}

export default WhatsAppFloat
