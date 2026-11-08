import { FaTruck, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'
import { getWhatsAppChannelUrl } from '../../utils/whatsapp'
import './AnnouncementBar.css'

const AnnouncementBar = () => {
  const channelUrl = getWhatsAppChannelUrl()

  return (
    <div className="announcement-bar">
      <div className="container announcement-bar__inner">
        <div className="announcement-bar__text">
          <span><FaTruck className="ann-icon" /> Envíos a todo el país por <strong>Andreani</strong> y <strong>Vía Cargo</strong></span>
          <span className="ann-dot">•</span>
          <span><FaMapMarkerAlt className="ann-icon" /> Retiro gratis en <strong>San Martín</strong></span>
          <span className="ann-dot">•</span>
          <span>Horario: Lun a Vie 10 a 20hs</span>
        </div>
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="announcement-bar__link"
        >
          <FaWhatsapp /> Canal de Novedades
        </a>
      </div>
    </div>
  )
}

export default AnnouncementBar
