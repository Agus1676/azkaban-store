// Motor de cálculo y cotización de envíos Andreani Express para AzkabanStore
// Soporta zonificación nacional por Código Postal (CP) o selección directa de Provincia / Región.
// 100% configurable desde el Panel de Administración > Envíos / Configuración.

export const SHIPPING_ZONES = [
  {
    key: 'amba',
    name: 'CABA y Gran Buenos Aires (AMBA)',
    shortName: 'AMBA (CABA y GBA)',
    province: 'Buenos Aires (AMBA)',
    postalCodes: '1000 al 1899',
    estimatedDays: '24 a 48 hs hábiles',
    defaultHomePrice: 5900,
    defaultBranchPrice: 4600,
    badge: 'Más Rápido',
  },
  {
    key: 'bsas_interior',
    name: 'Buenos Aires Interior (Costa Atlántica / Sierras / Prov.)',
    shortName: 'Buenos Aires Interior',
    province: 'Buenos Aires (Interior)',
    postalCodes: '1900-1999, 2700-2999, 6000-8199',
    estimatedDays: '48 a 72 hs hábiles',
    defaultHomePrice: 7900,
    defaultBranchPrice: 6200,
    badge: 'Prov. Bs. As.',
  },
  {
    key: 'centro',
    name: 'Región Centro (Córdoba y Santa Fe)',
    shortName: 'Córdoba y Santa Fe',
    province: 'Córdoba / Santa Fe',
    postalCodes: '2000-2699, 3000-3099, 5000-5999',
    estimatedDays: '48 a 72 hs hábiles',
    defaultHomePrice: 8500,
    defaultBranchPrice: 6700,
    badge: 'Centro',
  },
  {
    key: 'cuyo_norte',
    name: 'Cuyo, NOA y NEA (Mendoza, Salta, Tucumán, Entre Ríos, etc.)',
    shortName: 'Cuyo, NOA y NEA',
    province: 'Cuyo / Norte / Litoral',
    postalCodes: '3100-4799, 5400-5799',
    estimatedDays: '3 a 5 días hábiles',
    defaultHomePrice: 9400,
    defaultBranchPrice: 7400,
    badge: 'Nacional',
  },
  {
    key: 'patagonia',
    name: 'Patagonia Argentina y Tierra del Fuego',
    shortName: 'Patagonia',
    province: 'Patagonia',
    postalCodes: '6300-6399, 8200-9499',
    estimatedDays: '4 a 6 días hábiles',
    defaultHomePrice: 11800,
    defaultBranchPrice: 9200,
    badge: 'Sur',
  },
]

export const DEFAULT_SHIPPING_CONFIG = {
  // Tarifas Andreani AMBA
  andreaniAmbaHome: 5900,
  andreaniAmbaBranch: 4600,

  // Tarifas Buenos Aires Interior
  andreaniBsasInteriorHome: 7900,
  andreaniBsasInteriorBranch: 6200,

  // Tarifas Región Centro (Córdoba / Santa Fe)
  andreaniCentroHome: 8500,
  andreaniCentroBranch: 6700,

  // Tarifas Cuyo & Norte
  andreaniCuyoNorteHome: 9400,
  andreaniCuyoNorteBranch: 7400,

  // Tarifas Patagonia
  andreaniPatagoniaHome: 11800,
  andreaniPatagoniaBranch: 9200,

  // Compatibilidad con configuración anterior (Interior general)
  andreaniInteriorHome: 8900,
  andreaniInteriorBranch: 6900,

  // Monto para Envío Gratis
  freeShippingEnabled: true,
  freeShippingMinAmount: 120000,
}

export const getShippingConfig = () => {
  try {
    const saved = localStorage.getItem('azkaban_store_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      const sc = parsed.shippingConfig || {}
      return {
        ...DEFAULT_SHIPPING_CONFIG,
        ...sc,
        andreaniAmbaHome: parsed.andreaniAmbaHome ?? sc.andreaniAmbaHome ?? DEFAULT_SHIPPING_CONFIG.andreaniAmbaHome,
        andreaniAmbaBranch: parsed.andreaniAmbaBranch ?? sc.andreaniAmbaBranch ?? DEFAULT_SHIPPING_CONFIG.andreaniAmbaBranch,
        andreaniBsasInteriorHome: parsed.andreaniBsasInteriorHome ?? sc.andreaniBsasInteriorHome ?? DEFAULT_SHIPPING_CONFIG.andreaniBsasInteriorHome,
        andreaniBsasInteriorBranch: parsed.andreaniBsasInteriorBranch ?? sc.andreaniBsasInteriorBranch ?? DEFAULT_SHIPPING_CONFIG.andreaniBsasInteriorBranch,
        andreaniCentroHome: parsed.andreaniCentroHome ?? sc.andreaniCentroHome ?? DEFAULT_SHIPPING_CONFIG.andreaniCentroHome,
        andreaniCentroBranch: parsed.andreaniCentroBranch ?? sc.andreaniCentroBranch ?? DEFAULT_SHIPPING_CONFIG.andreaniCentroBranch,
        andreaniCuyoNorteHome: parsed.andreaniCuyoNorteHome ?? sc.andreaniCuyoNorteHome ?? DEFAULT_SHIPPING_CONFIG.andreaniCuyoNorteHome,
        andreaniCuyoNorteBranch: parsed.andreaniCuyoNorteBranch ?? sc.andreaniCuyoNorteBranch ?? DEFAULT_SHIPPING_CONFIG.andreaniCuyoNorteBranch,
        andreaniPatagoniaHome: parsed.andreaniPatagoniaHome ?? sc.andreaniPatagoniaHome ?? DEFAULT_SHIPPING_CONFIG.andreaniPatagoniaHome,
        andreaniPatagoniaBranch: parsed.andreaniPatagoniaBranch ?? sc.andreaniPatagoniaBranch ?? DEFAULT_SHIPPING_CONFIG.andreaniPatagoniaBranch,
        andreaniInteriorHome: parsed.andreaniInteriorHome ?? sc.andreaniInteriorHome ?? DEFAULT_SHIPPING_CONFIG.andreaniInteriorHome,
        andreaniInteriorBranch: parsed.andreaniInteriorBranch ?? sc.andreaniInteriorBranch ?? DEFAULT_SHIPPING_CONFIG.andreaniInteriorBranch,
        freeShippingMinAmount: parsed.freeShippingThreshold ?? sc.freeShippingMinAmount ?? sc.freeShippingMinTotal ?? DEFAULT_SHIPPING_CONFIG.freeShippingMinAmount,
        freeShippingEnabled: parsed.freeShippingEnabled ?? sc.freeShippingEnabled ?? DEFAULT_SHIPPING_CONFIG.freeShippingEnabled,
      }
    }
  } catch (e) {
    console.warn('Error leyendo configuración de envíos:', e)
  }
  return DEFAULT_SHIPPING_CONFIG
}

/**
 * Resuelve la zona logística tanto por Código Postal como por clave de zona o nombre de provincia.
 * @param {string|number} input - Código postal (ej: 1650, '1650', 'B1650') o clave de zona ('amba', 'centro', etc.)
 */
export const resolveZoneByPostalCode = (input) => {
  if (!input) return null

  const str = String(input).trim().toLowerCase()

  // 1. Coincidencia directa por clave de zona
  const directMatch = SHIPPING_ZONES.find((z) => z.key === str)
  if (directMatch) {
    return {
      zoneKey: directMatch.key,
      zone: directMatch.shortName,
      location: directMatch.name,
      province: directMatch.province,
      isAmba: directMatch.key === 'amba',
      estimatedDays: directMatch.estimatedDays,
    }
  }

  // 2. Extraer dígitos numéricos del Código Postal
  const cleaned = str.replace(/\D/g, '')
  if (cleaned.length < 3) return null

  const num = parseInt(cleaned.slice(0, 4), 10)
  if (isNaN(num)) return null

  // CABA (1000 - 1499) y Gran Buenos Aires (1600 - 1899)
  if ((num >= 1000 && num <= 1499) || (num >= 1600 && num <= 1899)) {
    let location = 'CABA y Gran Buenos Aires (AMBA)'
    if (num >= 1650 && num <= 1659) location = 'San Martín / Tres de Febrero (AMBA)'
    else if (num >= 1000 && num <= 1499) location = 'Ciudad Autónoma de Buenos Aires (CABA)'
    else if (num >= 1600 && num <= 1649) location = 'Zona Norte GBA (AMBA)'
    else if (num >= 1700 && num <= 1799) location = 'Zona Oeste GBA (AMBA)'
    else if (num >= 1800 && num <= 1899) location = 'Zona Sur GBA (AMBA)'

    return {
      zoneKey: 'amba',
      zone: 'AMBA',
      location,
      province: 'Buenos Aires (AMBA)',
      isAmba: true,
      estimatedDays: '24 a 48 hs hábiles',
    }
  }

  // Buenos Aires Interior (1900-1999, 2700-2999, 6000-8199)
  if ((num >= 1900 && num <= 1999) || (num >= 2700 && num <= 2999) || (num >= 6000 && num <= 8199)) {
    return {
      zoneKey: 'bsas_interior',
      zone: 'Buenos Aires Interior',
      location: 'Buenos Aires (Interior / Costa Atlántica / Sierras)',
      province: 'Buenos Aires',
      isAmba: false,
      estimatedDays: '48 a 72 hs hábiles',
    }
  }

  // Centro: Santa Fe (2000-2699, 3000-3099) y Córdoba (5000-5999)
  if ((num >= 2000 && num <= 2699) || (num >= 3000 && num <= 3099) || (num >= 5000 && num <= 5999)) {
    const loc = (num >= 5000 && num <= 5999) ? 'Córdoba Capital y Prov.' : 'Santa Fe (Rosario y Prov.)'
    return {
      zoneKey: 'centro',
      zone: 'Región Centro',
      location: loc,
      province: (num >= 5000 && num <= 5999) ? 'Córdoba' : 'Santa Fe',
      isAmba: false,
      estimatedDays: '48 a 72 hs hábiles',
    }
  }

  // Patagonia: La Pampa, Neuquén, Río Negro, Chubut, Santa Cruz, Tierra del Fuego (6300-6399, 8200-9499)
  if ((num >= 6300 && num <= 6399) || (num >= 8200 && num <= 9499)) {
    return {
      zoneKey: 'patagonia',
      zone: 'Patagonia',
      location: 'Patagonia y Tierra del Fuego',
      province: 'Patagonia',
      isAmba: false,
      estimatedDays: '4 a 6 días hábiles',
    }
  }

  // Cuyo, NOA y NEA (3100-4799, 5400-5799 y resto del país)
  return {
    zoneKey: 'cuyo_norte',
    zone: 'Cuyo, NOA y NEA',
    location: 'Norte y Cuyo Argentino',
    province: 'Cuyo / Norte / Litoral',
    isAmba: false,
    estimatedDays: '3 a 5 días hábiles',
  }
}

/**
 * Calcula todas las cotizaciones disponibles para un CP o Zona y monto de compra.
 * @param {string|number} postalCodeOrZone - CP o clave de zona
 * @param {number} cartTotal - Subtotal de productos en el carrito
 * @param {object} customConfig - Configuración de tarifas opcional
 */
export const calculateShippingQuotes = (postalCodeOrZone, cartTotal = 0, customConfig = null) => {
  const cfg = customConfig || getShippingConfig()

  // Si no se provee CP o zona, usamos AMBA como referencia base para que el usuario siempre vea tarifas
  const isInputProvided = !!postalCodeOrZone && String(postalCodeOrZone).trim().length > 0
  const zoneInfo = isInputProvided
    ? resolveZoneByPostalCode(postalCodeOrZone)
    : resolveZoneByPostalCode('amba')

  if (!zoneInfo) {
    return {
      valid: false,
      error: 'Ingresá un código postal válido de 4 dígitos o seleccioná tu zona',
      quotes: [],
    }
  }

  const isFreeEligible =
    cfg.freeShippingEnabled &&
    cfg.freeShippingMinAmount > 0 &&
    cartTotal >= cfg.freeShippingMinAmount

  // Precios según la zona específica
  let homePrice = cfg.andreaniAmbaHome
  let branchPrice = cfg.andreaniAmbaBranch

  switch (zoneInfo.zoneKey) {
    case 'amba':
      homePrice = cfg.andreaniAmbaHome ?? 5900
      branchPrice = cfg.andreaniAmbaBranch ?? 4600
      break
    case 'bsas_interior':
      homePrice = cfg.andreaniBsasInteriorHome ?? cfg.andreaniInteriorHome ?? 7900
      branchPrice = cfg.andreaniBsasInteriorBranch ?? cfg.andreaniInteriorBranch ?? 6200
      break
    case 'centro':
      homePrice = cfg.andreaniCentroHome ?? cfg.andreaniInteriorHome ?? 8500
      branchPrice = cfg.andreaniCentroBranch ?? cfg.andreaniInteriorBranch ?? 6700
      break
    case 'cuyo_norte':
      homePrice = cfg.andreaniCuyoNorteHome ?? cfg.andreaniInteriorHome ?? 9400
      branchPrice = cfg.andreaniCuyoNorteBranch ?? cfg.andreaniInteriorBranch ?? 7400
      break
    case 'patagonia':
      homePrice = cfg.andreaniPatagoniaHome ?? cfg.andreaniInteriorHome ?? 11800
      branchPrice = cfg.andreaniPatagoniaBranch ?? cfg.andreaniInteriorBranch ?? 9200
      break
    default:
      homePrice = cfg.andreaniInteriorHome ?? 8900
      branchPrice = cfg.andreaniInteriorBranch ?? 6900
      break
  }

  const originalHomePrice = homePrice
  const originalBranchPrice = branchPrice

  if (isFreeEligible) {
    homePrice = 0
    branchPrice = 0
  }

  const quotes = [
    {
      id: 'andreani_home',
      carrier: 'Andreani Express',
      type: 'Domicilio',
      name: 'Andreani a Domicilio',
      zoneName: zoneInfo.location,
      zoneKey: zoneInfo.zoneKey,
      price: homePrice,
      originalPrice: originalHomePrice,
      isFree: isFreeEligible,
      estimatedDays: zoneInfo.estimatedDays,
      icon: '🏠',
      badge: 'En tu puerta',
      description: `Entrega en mano en tu domicilio (${zoneInfo.estimatedDays}).`,
    },
    {
      id: 'andreani_branch',
      carrier: 'Andreani Express',
      type: 'Sucursal',
      name: 'Andreani Retiro en Sucursal',
      zoneName: zoneInfo.location,
      zoneKey: zoneInfo.zoneKey,
      price: branchPrice,
      originalPrice: originalBranchPrice,
      isFree: isFreeEligible,
      estimatedDays: zoneInfo.estimatedDays,
      icon: '🏢',
      badge: 'Económico',
      description: `Retirás en la sucursal Andreani más cercana (${zoneInfo.estimatedDays}).`,
    },
    {
      id: 'pickup',
      carrier: 'AzkabanStore',
      type: 'Punto de Retiro',
      name: 'Retiro en San Martín (Gratis)',
      zoneName: 'San Martín, Buenos Aires',
      zoneKey: 'local',
      price: 0,
      originalPrice: 0,
      isFree: true,
      estimatedDays: 'Inmediato',
      icon: '🚶',
      badge: 'Sin Espera',
      description: 'Dr. marcos zimmermann 3339, San Martín. Sin costo de flete.',
    },
  ]

  return {
    valid: true,
    isDefaultZone: !isInputProvided,
    zoneInfo,
    isFreeEligible,
    freeShippingMinAmount: cfg.freeShippingMinAmount,
    amountNeededForFreeShipping: Math.max(0, cfg.freeShippingMinAmount - cartTotal),
    quotes,
  }
}
