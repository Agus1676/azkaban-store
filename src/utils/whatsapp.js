import { STORE_INFO } from '../data/seedProducts'

export const getWhatsAppNumber = () => {
  try {
    const saved = localStorage.getItem('azkaban_store_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.phoneRaw) return parsed.phoneRaw.replace(/\D/g, '')
    }
  } catch (e) {
    console.warn('Error reading store phone:', e)
  }
  return STORE_INFO.phoneRaw
}

export const getWhatsAppChannelUrl = () => {
  try {
    const saved = localStorage.getItem('azkaban_store_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.whatsappChannelUrl) return parsed.whatsappChannelUrl
    }
  } catch (e) {
    console.warn(e)
  }
  return STORE_INFO.whatsappChannelUrl
}

export const generateProductInquiryLink = (product, selectedSize = null) => {
  const number = getWhatsAppNumber()
  let message = `¡Hola AzkabanStore! 👋 Te consulto desde la web por:\n\n` +
    `🔥 *${product.name}*\n` +
    (selectedSize ? `📏 *Talle:* ${selectedSize}\n` : '') +
    `💰 *Precio:* $${(product.priceOffer || product.price)?.toLocaleString('es-AR')}\n\n` +
    `¿Tienen disponibilidad para entrega o envío? ¡Muchas gracias!`

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export const generateGeneralInquiryLink = () => {
  const number = getWhatsAppNumber()
  const message = `¡Hola AzkabanStore! 👋 Me contacto desde la web oficial para hacer una consulta sobre indumentaria y envíos.`
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
