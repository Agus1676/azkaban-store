// Motor de cálculo y cotización de envíos Andreani y Vía Cargo para AzkabanStore
// Permite cotizar automáticamente según el Código Postal (CP) de Argentina
// y se configura de forma 100% personalizada desde el Panel Admin > Envíos / Configuración.

export const DEFAULT_SHIPPING_CONFIG = {
  // Tarifas Andreani AMBA (CABA y Gran Buenos Aires)
  andreaniAmbaHome: 5900,
  andreaniAmbaBranch: 4600,

  // Tarifas Andreani Interior de Buenos Aires y Provincias
  andreaniInteriorHome: 8900,
  andreaniInteriorBranch: 6900,

  // Vía Cargo Encomienda a Terminal
  viaCargoTerminal: 7500,

  // Monto para Envío Gratis (si el total del carrito lo supera, Andreani queda en $0)
  freeShippingEnabled: true,
  freeShippingMinAmount: 120000,

  // Configuración opcional de Contrato Corporativo Andreani API
  andreaniApiEnabled: false,
  andreaniContractNumber: '',
  andreaniCustomerCode: '',
  andreaniUsername: '',
  andreaniPassword: '',
}

export const getShippingConfig = () => {
  try {
    const saved = localStorage.getItem('azkaban_store_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.shippingConfig) {
        return { ...DEFAULT_SHIPPING_CONFIG, ...parsed.shippingConfig }
      }
    }
  } catch (e) {
    console.warn('Error leyendo configuración de envíos:', e)
  }
  return DEFAULT_SHIPPING_CONFIG
}

/**
 * Identifica la zona logística de Argentina a partir del Código Postal (CP)
 * @param {string|number} rawCp - Código postal de 4 dígitos o alfanumérico CPA (ej: 1650 o B1650)
 */
export const resolveZoneByPostalCode = (rawCp) => {
  if (!rawCp) return null

  // Extraer sólo los números del código postal
  const cleaned = String(rawCp).replace(/\D/g, '')
  if (cleaned.length < 3) return null

  const num = parseInt(cleaned.slice(0, 4), 10)
  if (isNaN(num)) return null

  // CABA (1000 - 1499)
  if (num >= 1000 && num <= 1499) {
    return {
      zone: 'AMBA',
      location: 'Ciudad Autónoma de Buenos Aires (CABA)',
      province: 'Capital Federal',
      isAmba: true,
      estimatedDays: '24 a 48 hs hábiles',
    }
  }

  // Gran Buenos Aires / Primer y Segundo Cordón (1600 - 1899)
  if (num >= 1600 && num <= 1899) {
    let partido = 'Gran Buenos Aires (GBA)'
    if (num >= 1650 && num <= 1659) partido = 'San Martín / Tres de Febrero (Cercanía)'
    if (num >= 1600 && num <= 1649) partido = 'Zona Norte GBA (Vicente López, San Isidro, Tigre)'
    if (num >= 1700 && num <= 1799) partido = 'Zona Oeste GBA (Morón, Ramos Mejía, Merlo)'
    if (num >= 1800 && num <= 1899) partido = 'Zona Sur GBA (Avellaneda, Lanús, Quilmes)'

    return {
      zone: 'AMBA',
      location: partido,
      province: 'Buenos Aires (GBA)',
      isAmba: true,
      estimatedDays: '24 a 48 hs hábiles',
    }
  }

  // Buenos Aires Provincia Interior (1900 - 1999, 2700 - 2999, 6000 - 8999)
  if (
    (num >= 1900 && num <= 1999) ||
    (num >= 2700 && num <= 2999) ||
    (num >= 6000 && num <= 8199)
  ) {
    return {
      zone: 'BSAS_INTERIOR',
      location: 'Buenos Aires (Interior / Costa Atlántica / Sierras)',
      province: 'Buenos Aires',
      isAmba: false,
      estimatedDays: '48 a 72 hs hábiles',
    }
  }

  // Santa Fe (2000 - 2699, 3000 - 3099)
  if (num >= 2000 && num <= 2699) {
    return {
      zone: 'CENTRO',
      location: 'Santa Fe (Rosario y alrededores)',
      province: 'Santa Fe',
      isAmba: false,
      estimatedDays: '48 a 72 hs hábiles',
    }
  }

  // Córdoba (5000 - 5999)
  if (num >= 5000 && num <= 5999) {
    return {
      zone: 'CENTRO',
      location: 'Córdoba Capital & Prov.',
      province: 'Córdoba',
      isAmba: false,
      estimatedDays: '48 a 72 hs hábiles',
    }
  }

  // Entre Ríos / Corrientes / Misiones / Chaco / Formosa (3100 - 3799)
  if (num >= 3100 && num <= 3799) {
    return {
      zone: 'LITORAL_NEA',
      location: 'Litoral & NEA',
      province: 'Litoral / NEA',
      isAmba: false,
      estimatedDays: '3 a 5 días hábiles',
    }
  }

  // Cuyo: Mendoza, San Juan, San Luis (5400 - 5799)
  if (num >= 5400 && num <= 5799) {
    return {
      zone: 'CUYO',
      location: 'Cuyo (Mendoza / San Juan / San Luis)',
      province: 'Cuyo',
      isAmba: false,
      estimatedDays: '3 a 5 días hábiles',
    }
  }

  // NOA: Salta, Jujuy, Tucumán, Catamarca, La Rioja, Sgo. del Estero (4000 - 4799)
  if (num >= 4000 && num <= 4799) {
    return {
      zone: 'NOA',
      location: 'Noroeste Argentino (NOA)',
      province: 'NOA',
      isAmba: false,
      estimatedDays: '3 a 5 días hábiles',
    }
  }

  // Patagonia: La Pampa, Neuquén, Río Negro, Chubut, Santa Cruz, T. del Fuego (8200 - 9499)
  if (num >= 8200 && num <= 9499) {
    return {
      zone: 'PATAGONIA',
      location: 'Patagonia Argentina',
      province: 'Patagonia',
      isAmba: false,
      estimatedDays: '4 a 6 días hábiles',
    }
  }

  // Resto o Genérico nacional
  return {
    zone: 'INTERIOR_NACIONAL',
    location: 'Interior del País',
    province: 'Nacional',
    isAmba: false,
    estimatedDays: '3 a 5 días hábiles',
  }
}

/**
 * Calcula todas las opciones de envío disponibles para un CP y monto de compra
 * @param {string|number} postalCode - CP del cliente
 * @param {number} cartTotal - Subtotal de productos en el carrito
 * @param {object} customConfig - Configuración de tarifas (opcional)
 */
export const calculateShippingQuotes = (postalCode, cartTotal = 0, customConfig = null) => {
  const cfg = customConfig || getShippingConfig()
  const zoneInfo = resolveZoneByPostalCode(postalCode)

  if (!zoneInfo) {
    return {
      valid: false,
      error: 'Ingresá un código postal válido de 4 dígitos (ej: 1650, 1425, 2000, 5000)',
      quotes: [],
    }
  }

  const isFreeEligible =
    cfg.freeShippingEnabled &&
    cfg.freeShippingMinAmount > 0 &&
    cartTotal >= cfg.freeShippingMinAmount

  let homePrice = zoneInfo.isAmba ? cfg.andreaniAmbaHome : cfg.andreaniInteriorHome
  let branchPrice = zoneInfo.isAmba ? cfg.andreaniAmbaBranch : cfg.andreaniInteriorBranch
  let viaCargoPrice = cfg.viaCargoTerminal

  if (isFreeEligible) {
    homePrice = 0
    branchPrice = 0
  }

  const quotes = [
    {
      id: 'andreani_home',
      carrier: 'Andreani',
      type: 'Domicilio',
      name: 'Andreani a Domicilio',
      price: homePrice,
      originalPrice: zoneInfo.isAmba ? cfg.andreaniAmbaHome : cfg.andreaniInteriorHome,
      isFree: isFreeEligible,
      estimatedDays: zoneInfo.estimatedDays,
      icon: '📦',
      description: 'Llega directo a la puerta de tu domicilio con seguimiento online.',
    },
    {
      id: 'andreani_branch',
      carrier: 'Andreani',
      type: 'Sucursal',
      name: 'Andreani Retiro en Sucursal',
      price: branchPrice,
      originalPrice: zoneInfo.isAmba ? cfg.andreaniAmbaBranch : cfg.andreaniInteriorBranch,
      isFree: isFreeEligible,
      estimatedDays: zoneInfo.estimatedDays,
      icon: '🏢',
      description: 'Retirá en la sucursal Andreani más cercana con tu DNI.',
    },
    {
      id: 'via_cargo',
      carrier: 'Vía Cargo',
      type: 'Terminal',
      name: 'Vía Cargo a Terminal / Agencia',
      price: viaCargoPrice,
      originalPrice: viaCargoPrice,
      isFree: false,
      estimatedDays: '3 a 5 días hábiles',
      icon: '🚚',
      description: 'Retiro en agencia o terminal de micros oficial Vía Cargo.',
    },
    {
      id: 'pickup',
      carrier: 'AzkabanStore',
      type: 'Punto de Retiro',
      name: 'Retiro en Punto San Martín (Gratis)',
      price: 0,
      originalPrice: 0,
      isFree: true,
      estimatedDays: 'Inmediato (Coordinar por WhatsApp)',
      icon: '🚶',
      description: 'Dr. marcos zimmermann 3339, San Martín. Sin costo de envío.',
    },
  ]

  return {
    valid: true,
    zoneInfo,
    isFreeEligible,
    freeShippingMinAmount: cfg.freeShippingMinAmount,
    amountNeededForFreeShipping: Math.max(0, cfg.freeShippingMinAmount - cartTotal),
    quotes,
  }
}
