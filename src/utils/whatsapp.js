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

/**
 * Consulta genérica por una prenda
 */
export const generateProductInquiryLink = (product, selectedSize = null) => {
  const number = getWhatsAppNumber()
  const price = product.priceOffer || product.price || 0
  let message = `¡Hola AzkabanStore! 👋 Te consulto desde la web por:\n\n` +
    `🔥 *${product.name}*\n` +
    (selectedSize ? `📏 *Talle:* ${selectedSize}\n` : '') +
    `💰 *Precio:* $${price.toLocaleString('es-AR')} ARS\n\n` +
    `¿Tienen disponibilidad para entrega o despacho? ¡Muchas gracias!`

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/**
 * Compra directa de una prenda con método de entrega y costo de envío sumado
 */
export const generateProductBuyLink = (product, selectedSize = null, quantity = 1, shippingOption = null) => {
  const number = getWhatsAppNumber()
  const unitPrice = product.priceOffer || product.price || 0
  const subtotal = unitPrice * quantity
  const shippingPrice = shippingOption ? (Number(shippingOption.price) || 0) : 0
  const finalTotal = subtotal + shippingPrice

  let message = `¡Hola AzkabanStore! 👋 Quiero realizar el pedido de esta prenda:\n\n`
  message += `🔥 *${product.name}*\n`
  if (selectedSize) message += `📏 *Talle:* ${selectedSize}\n`
  if (quantity > 1) message += `📦 *Cantidad:* ${quantity} un.\n`
  message += `💵 *Subtotal prenda:* $${subtotal.toLocaleString('es-AR')} ARS\n\n`

  if (shippingOption && shippingOption.id !== 'pickup') {
    const costText = shippingPrice === 0 ? '¡GRATIS!' : `$${shippingPrice.toLocaleString('es-AR')} ARS`
    message += `🚚 *Método de Envío:* ${shippingOption.name} (${costText})\n`
    if (shippingOption.zoneName) message += `📍 *Zona / Destino:* ${shippingOption.zoneName}\n`
    if (shippingOption.estimatedDays) message += `⏱️ *Plazo estimado:* ${shippingOption.estimatedDays}\n`
  } else {
    message += `🚶 *Método de Entrega:* Retiro en Punto San Martín (Gratis)\n`
  }

  message += `\n💰 *TOTAL A ABONAR: $${finalTotal.toLocaleString('es-AR')} ARS*\n\n`
  message += `¿Me confirman los datos para realizar la transferencia / pago? ¡Muchas gracias!`

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export const generateGeneralInquiryLink = () => {
  const number = getWhatsAppNumber()
  const message = `¡Hola AzkabanStore! 👋 Me contacto desde la web oficial para hacer una consulta sobre indumentaria y envíos.`
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
