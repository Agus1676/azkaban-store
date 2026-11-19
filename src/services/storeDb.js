import { SEED_PRODUCTS, STORE_INFO } from '../data/seedProducts'
import { DEFAULT_CATEGORIES } from '../data/categories'

// Keys
const KEYS = {
  INITIALIZED: 'azkaban_db_initialized',
  PRODUCTS: 'azkaban_products',
  CATEGORIES: 'azkaban_categories',
  ORDERS: 'azkaban_orders',
  CONFIG: 'azkaban_store_config',
}

/**
 * ROCK-SOLID DATABASE SERVICE (Previene el error de Emiliano Custom Shop)
 * - Nunca resucita productos eliminados si la base de datos ya fue inicializada.
 * - Validación defensiva de esquemas.
 * - Eventos reactivos sincronizados para actualización instantánea en toda la app.
 */

// ==========================================================================
// 1. PRODUCTOS
// ==========================================================================

export const getStoredProducts = () => {
  try {
    const isInit = localStorage.getItem(KEYS.INITIALIZED)
    const raw = localStorage.getItem(KEYS.PRODUCTS)

    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }

    // Si nunca se inicializó, cargar semillas
    if (!isInit) {
      localStorage.setItem(KEYS.INITIALIZED, 'true')
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS))
      return SEED_PRODUCTS
    }

    return []
  } catch (err) {
    console.error('Error leyendo productos desde localStorage:', err)
    return SEED_PRODUCTS
  }
}

export const saveStoredProducts = (products) => {
  try {
    const safeArray = Array.isArray(products) ? products : []
    localStorage.setItem(KEYS.INITIALIZED, 'true')
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(safeArray))
    window.dispatchEvent(new Event('azkaban_products_updated'))
    return true
  } catch (err) {
    console.error('Error guardando productos en localStorage:', err)
    return false
  }
}

export const restoreFactoryProducts = () => {
  try {
    localStorage.setItem(KEYS.INITIALIZED, 'true')
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS))
    window.dispatchEvent(new Event('azkaban_products_updated'))
    return SEED_PRODUCTS
  } catch (err) {
    console.error('Error restaurando productos de fábrica:', err)
    return SEED_PRODUCTS
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
    const safeArray = Array.isArray(categories) ? categories : DEFAULT_CATEGORIES
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(safeArray))
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
    const safeArray = Array.isArray(orders) ? orders : []
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(safeArray))
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
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config))
    window.dispatchEvent(new Event('azkaban_config_updated'))
    return true
  } catch (err) {
    console.error('Error guardando configuración:', err)
    return false
  }
}
