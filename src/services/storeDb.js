import { SEED_PRODUCTS, STORE_INFO } from '../data/seedProducts'
import { DEFAULT_CATEGORIES } from '../data/categories'

// Keys
const KEYS = {
  INITIALIZED: 'azkaban_db_initialized',
  PRODUCTS: 'azkaban_products',
  CATEGORIES: 'azkaban_categories',
  ORDERS: 'azkaban_orders',
  CONFIG: 'azkaban_store_config',
  STOCK_LOGS: 'azkaban_stock_logs',
}

/**
 * ROCK-SOLID DATABASE SERVICE (Previene el error de Emiliano Custom Shop)
 * - Nunca resucita productos eliminados si la base de datos ya fue inicializada.
 * - Validación defensiva de esquemas.
 * - Eventos reactivos sincronizados para actualización instantánea en toda la app.
 */

// ==========================================================================
// 1. SANITIZADOR DEFENSIVO XSS & SEGURIDAD DE ENTRADAS
// ==========================================================================

export const stripPrototypePollution = (val) => {
  if (!val || typeof val !== 'object') return val
  delete val.__proto__
  delete val.constructor
  delete val.prototype
  return val
}

export const safeSetItem = (key, value) => {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return true
  } catch (err) {
    console.error('LocalStorage write error:', err)
    // Quota management: purge non-critical cache if full
    if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
      try {
        localStorage.removeItem(KEYS.STOCK_LOGS)
        const serialized = typeof value === 'string' ? value : JSON.stringify(value)
        localStorage.setItem(key, serialized)
        return true
      } catch {
        return false
      }
    }
    return false
  }
}

export const sanitizeText = (val, maxLen = 2000) => {
  if (typeof val !== 'string') return ''
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, maxLen)
}

export const sanitizeImageUrl = (val) => {
  if (typeof val !== 'string') return '/logo.png'
  const trimmed = val.trim()
  // Permitir Data URLs seguras de imágenes (WebP, JPEG, PNG, etc.)
  if (/^data:image\/(webp|jpeg|jpg|png|gif|svg\+xml);base64,/i.test(trimmed)) {
    return trimmed.slice(0, 500000)
  }
  // Permitir URLs web seguras o rutas relativas
  if (/^(https?:\/\/|\/)/i.test(trimmed)) {
    return trimmed.replace(/[<>"'`]/g, '').slice(0, 2000)
  }
  return '/logo.png'
}

export const normalizeProduct = (p) => {
  if (!p || typeof p !== 'object' || !p.id) return null
  const stockNum = typeof p.stock === 'number' ? p.stock : (parseInt(p.stock, 10) || 0)
  const priceNum = typeof p.price === 'number' ? p.price : (parseFloat(p.price) || 0)
  const offerRaw = p.offerPrice ?? p.priceOffer
  const offerNum = offerRaw && !isNaN(Number(offerRaw)) && Number(offerRaw) > 0 ? Number(offerRaw) : null

  let images = []
  if (Array.isArray(p.images) && p.images.length > 0) {
    images = p.images
      .filter((img) => typeof img === 'string' && img.trim() !== '')
      .map(sanitizeImageUrl)
  } else if (p.imageUrl && typeof p.imageUrl === 'string') {
    images = [sanitizeImageUrl(p.imageUrl)]
  }
  if (images.length === 0) {
    images = ['/logo.png']
  }

  return {
    ...p,
    id: String(p.id),
    name: sanitizeText(p.name || 'Prenda', 120),
    brand: sanitizeText(p.brand || 'Azkaban Indumentaria', 80),
    category: sanitizeText(p.category || 'buzos', 50),
    price: Math.max(0, priceNum),
    priceOffer: offerNum,
    offerPrice: offerNum,
    stock: Math.max(0, stockNum),
    active: p.active !== false,
    featured: Boolean(p.featured),
    badge: sanitizeText(p.badge || '', 40),
    description: sanitizeText(p.description || '', 2000),
    videoUrl: sanitizeText(p.videoUrl || '', 500),
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0
      ? p.sizes.map((s) => sanitizeText(String(s), 20)).filter(Boolean)
      : ['ÚNICO'],
    images: images,
    imageUrl: images[0] || '/logo.png',
  }
}

export const getStoredProducts = () => {
  try {
    const isInit = localStorage.getItem(KEYS.INITIALIZED)
    const raw = localStorage.getItem(KEYS.PRODUCTS)

    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeProduct).filter(Boolean)
      }
    }

    // Si nunca se inicializó, cargar semillas
    if (!isInit) {
      const initial = SEED_PRODUCTS.map(normalizeProduct).filter(Boolean)
      localStorage.setItem(KEYS.INITIALIZED, 'true')
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(initial))
      return initial
    }

    return []
  } catch (err) {
    console.error('Error leyendo productos desde localStorage:', err)
    return []
  }
}

export const saveStoredProducts = (products) => {
  try {
    const safeArray = (Array.isArray(products) ? products : []).map(normalizeProduct).filter(Boolean)
    safeSetItem(KEYS.INITIALIZED, 'true')
    safeSetItem(KEYS.PRODUCTS, safeArray)
    window.dispatchEvent(new Event('azkaban_products_updated'))
    return true
  } catch (err) {
    console.error('Error guardando productos en localStorage:', err)
    return false
  }
}

export const restoreFactoryProducts = () => {
  try {
    const factory = SEED_PRODUCTS.map(normalizeProduct).filter(Boolean)
    safeSetItem(KEYS.INITIALIZED, 'true')
    safeSetItem(KEYS.PRODUCTS, factory)
    window.dispatchEvent(new Event('azkaban_products_updated'))
    return factory
  } catch (err) {
    console.error('Error restaurando productos de fábrica:', err)
    return []
  }
}

// ==========================================================================
// 2. CATEGORÍAS
// ==========================================================================

export const getStoredCategories = () => {
  try {
    const raw = localStorage.getItem(KEYS.CATEGORIES)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Error leyendo categorías:', err)
  }
  return DEFAULT_CATEGORIES
}

export const saveStoredCategories = (categories) => {
  try {
    const rawArray = Array.isArray(categories) ? categories : DEFAULT_CATEGORIES
    const safeArray = rawArray.map((c) => {
      const clean = stripPrototypePollution(c)
      return {
        ...clean,
        id: sanitizeText(String(clean.id || ''), 50),
        name: sanitizeText(String(clean.name || ''), 80),
        slug: sanitizeText(String(clean.slug || ''), 60),
      }
    })
    safeSetItem(KEYS.CATEGORIES, safeArray)
    window.dispatchEvent(new Event('azkaban_categories_updated'))
    return true
  } catch (err) {
    console.error('Error guardando categorías:', err)
    return false
  }
}

// ==========================================================================
// 3. PEDIDOS / CRM
// ==========================================================================

export const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(KEYS.ORDERS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.warn('Error leyendo pedidos:', err)
  }
  return []
}

export const saveStoredOrders = (orders) => {
  try {
    const rawArray = Array.isArray(orders) ? orders : []
    const safeArray = rawArray.map((o) => stripPrototypePollution(o))
    safeSetItem(KEYS.ORDERS, safeArray)
    window.dispatchEvent(new Event('azkaban_orders_updated'))
    return true
  } catch (err) {
    console.error('Error guardando pedidos:', err)
    return false
  }
}

// ==========================================================================
// 4. CONFIGURACIÓN DE TIENDA
// ==========================================================================

export const getStoredConfig = () => {
  try {
    const raw = localStorage.getItem(KEYS.CONFIG)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        return {
          ...STORE_INFO,
          ...parsed,
        }
      }
    }
  } catch (err) {
    console.warn('Error leyendo configuración:', err)
  }
  return {
    ...STORE_INFO,
    phoneRaw: STORE_INFO.phoneRaw || '5491137934198',
    phoneDisplay: STORE_INFO.phoneDisplay || '+54 9 11 3793-4198',
    hours: STORE_INFO.hours || 'Lunes a Viernes de 10:00 a 20:00 hs',
    address: STORE_INFO.address || 'Dr. marcos zimmermann 3339, San Martín, Prov. Buenos Aires',
    shippingCarriersText: 'Andreani / Vía Cargo',
    andreaniAmbaHome: 7500,
    andreaniAmbaBranch: 5200,
    andreaniInteriorHome: 11800,
    andreaniInteriorBranch: 8900,
    viaCargoAgency: 9500,
    freeShippingThreshold: 120000,
    freeShippingEnabled: true,
  }
}

export const saveStoredConfig = (config) => {
  try {
    const cleanConfig = stripPrototypePollution(config)
    safeSetItem(KEYS.CONFIG, cleanConfig)
    window.dispatchEvent(new Event('azkaban_config_updated'))
    return true
  } catch (err) {
    console.error('Error guardando configuración:', err)
    return false
  }
}

// ==========================================================================
// 5. REGISTRO DE MOVIMIENTOS & VENTAS (STOCK LOGS)
// ==========================================================================

export const getStoredStockLogs = () => {
  try {
    const raw = localStorage.getItem(KEYS.STOCK_LOGS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.warn('Error leyendo registros de stock/ventas:', err)
  }
  return []
}

export const saveStoredStockLogs = (logs) => {
  try {
    const rawArray = Array.isArray(logs) ? logs : []
    const safeArray = rawArray.map((l) => stripPrototypePollution(l))
    safeSetItem(KEYS.STOCK_LOGS, safeArray)
    window.dispatchEvent(new Event('azkaban_stock_updated'))
    return true
  } catch (err) {
    console.error('Error guardando logs de stock:', err)
    return false
  }
}

export const addStoredStockLog = (entry) => {
  try {
    const current = getStoredStockLogs()
    const updated = [entry, ...current]
    saveStoredStockLogs(updated)
    return updated
  } catch (err) {
    console.error('Error agregando log de stock:', err)
    return []
  }
}
