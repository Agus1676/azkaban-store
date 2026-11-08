import { FaWhatsapp, FaTruck, FaMapMarkerAlt } from 'react-icons/fa'
import { STORE_INFO } from '../../data/seedProducts'
import { getWhatsAppChannelUrl } from '../../utils/whatsapp'
import './AnnouncementBar.css'

const AnnouncementBar = () => {
  const channelUrl = getWhatsAppChannelUrl()

  return (
    <div className="announcement-bar">
      <div className="announcement-bar__marquee">
        <div className="announcement-bar__content">
          <span className="announcement-bar__item">
            <FaTruck className="icon-orange" /> Despachos a todo el país por <strong>Andreani</strong> y <strong>Vía Cargo</strong>
          </span>
          <span className="announcement-bar__divider">•</span>
          <span className="announcement-bar__item">
            <FaMapMarkerAlt className="icon-orange" /> Punto de retiro: <strong>Dr. marcos zimmermann 3339, San Martín</strong>
          </span>
          <span className="announcement-bar__divider">•</span>
          <span className="announcement-bar__item">
            ⏰ Atención Lun a Vie 10 a 20hs
          </span>
          <span className="announcement-bar__divider">•</span>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="announcement-bar__link"
          >
            <FaWhatsapp className="icon-whatsapp" /> <strong>Unite al Canal de WhatsApp</strong> para novedades exclusivas
          </a>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementBar
