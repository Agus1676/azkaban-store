/**
 * MOTOR DE SEO DINÁMICO AZKABANSTORE (10,000% GOOGLE READY)
 * Gestiona title, meta description, canonical, OpenGraph y JSON-LD dinámicos
 */

export const updatePageSEO = ({
  title,
  description,
  canonical,
  image = 'https://www.azkabanstore.com.ar/logo.png',
  schemaJson = null,
}) => {
  // 1. Title
  if (title) {
    document.title = title
  }

  // Helper para meta tags
  const setMeta = (nameAttr, nameVal, content) => {
    if (!content) return
    let meta = document.querySelector(`meta[${nameAttr}="${nameVal}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute(nameAttr, nameVal)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  // 2. Standard Meta Description
  if (description) {
    setMeta('name', 'description', description)
    setMeta('property', 'og:description', description)
    setMeta('name', 'twitter:description', description)
  }

  // 3. OpenGraph Title
  if (title) {
    setMeta('property', 'og:title', title)
    setMeta('name', 'twitter:title', title)
  }

  // 4. Image
  if (image) {
    setMeta('property', 'og:image', image)
    setMeta('name', 'twitter:image', image)
  }

  // 5. Canonical Link
  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', canonical)
    setMeta('property', 'og:url', canonical)
  }

  // 6. JSON-LD Dynamic Rich Snippet
  const SCRIPT_ID = 'azkaban-dynamic-schema-ld'
  let existingScript = document.getElementById(SCRIPT_ID)
  if (schemaJson) {
    if (!existingScript) {
      existingScript = document.createElement('script')
      existingScript.id = SCRIPT_ID
      existingScript.type = 'application/ld+json'
      document.head.appendChild(existingScript)
    }
    existingScript.textContent = JSON.stringify(schemaJson)
  } else if (existingScript) {
    existingScript.remove()
  }
}

/**
 * Genera Schema.org para productos individuales (Google Shopping / Rich Snippets)
 */
export const createProductSchema = (product) => {
  if (!product) return null
  const price = product.priceOffer || product.price || 0
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.imageUrl || 'https://www.azkabanstore.com.ar/logo.png'],
    description: product.description || `Prenda de indumentaria deportiva y urbana ${product.name} en AzkabanStore.`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Azkaban Indumentaria',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.azkabanstore.com.ar/catalogo?product=${product.id}`,
      priceCurrency: 'ARS',
      price: price,
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: isOutOfStock
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'AzkabanStore',
      },
    },
  }
}
