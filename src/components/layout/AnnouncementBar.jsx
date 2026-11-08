import { useState, useEffect } from 'react'
import { FaTruck, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'
import { getWhatsAppChannelUrl } from '../../utils/whatsapp'
import { STORE_INFO } from '../../data/seedProducts'
import './AnnouncementBar.css'

const getStoredConfig = () => {
  try {
    const saved = localStorage.getItem('azkaban_store_config')
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn(e)
  }
  return STORE_INFO
}

const AnnouncementBar = () => {
  const [config, setConfig] = useState(getStoredConfig)

  useEffect(() => {
    const handleConfig = () => setConfig(getStoredConfig())
    window.addEventListener('azkaban_config_updated', handleConfig)
    return () => window.removeEventListener('azkaban_config_updated', handleConfig)
  }, [])

  const channelUrl = config?.whatsappChannelUrl || getWhatsAppChannelUrl()
  const customText = config?.announcementText

  return (
    <div className="announcement-bar">
      <div className="container announcement-bar__inner">
        <div className="announcement-bar__text">
          {customText ? (
            <span><FaTruck className="ann-icon" /> {customText}</span>
          ) : (
            <>
              <span><FaTruck className="ann-icon" /> Envíos por <strong>Andreani</strong> y <strong>Vía Cargo</strong></span>
              <span className="ann-dot">•</span>
              <span><FaMapMarkerAlt className="ann-icon" /> Retiro gratis en <strong>San Martín</strong></span>
              <span className="ann-dot">•</span>
              <span>Horario: {config?.hours || 'Lun a Vie 10 a 20hs'}</span>
            </>
          )}
        </div>
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="announcement-bar__link"
        >
          <FaWhatsapp /> Canal Oficial
        </a>
      </div>
    </div>
  )
}

export default AnnouncementBar
