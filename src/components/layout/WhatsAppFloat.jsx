import { FaWhatsapp } from 'react-icons/fa'
import { generateGeneralInquiryLink } from '../../utils/whatsapp'
import './WhatsAppFloat.css'

const WhatsAppFloat = () => {
  const chatUrl = generateGeneralInquiryLink()

  return (
    <a
      href={chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float-btn"
      aria-label="Contactar por WhatsApp"
      title="Escribinos por WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  )
}

export default WhatsAppFloat
