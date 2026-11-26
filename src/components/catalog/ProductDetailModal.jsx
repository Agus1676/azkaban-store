import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FiX,
  FiShoppingBag,
  FiTruck,
  FiMapPin,
  FiAward,
  FiPlus,
  FiMinus,
  FiImage,
  FiPlay,
  FiRefreshCw,
  FiChevronDown,
  FiCheck,
  FiHelpCircle,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import { generateProductBuyLink, generateProductInquiryLink } from '../../utils/whatsapp'
import { parseVideoUrl } from '../../utils/video'
import { getReturnPolicy, RETURN_POLICY_PATH } from '../../data/policies'
import { calculateShippingQuotes, SHIPPING_ZONES } from '../../utils/shipping'
import { updatePageSEO, createProductSchema } from '../../utils/seo'
import './ProductDetailModal.css'

const ProductVideo = ({ video, title }) => {
  if (video.type === 'file') {
    return (
      <video
        className="modal-video-file"
        src={video.src}
        controls
        playsInline
        preload="metadata"
      />
    )
  }
  return (
    <iframe
      className="modal-video-frame"
      src={video.src}
      title={`Video de ${title}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
    />
  )
}

const ProductDetailModal = ({ product, onClose, initialView = 'photo' }) => {
  const { addToCart, shippingPreference } = useCart()
  const modalScrollRef = useRef(null)

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Único'
  )
  const [quantity, setQuantity] = useState(1)
  const video = parseVideoUrl(product?.videoUrl)
  const [view, setView] = useState(initialView === 'video' && video ? 'video' : 'photo')
  const [policyOpen, setPolicyOpen] = useState(false)
  const returnPolicy = getReturnPolicy()

  // Delivery selection: 'home' | 'branch' | 'pickup'
  const [shippingMode, setShippingMode] = useState(
    shippingPreference?.quoteId === 'pickup'
      ? 'pickup'
      : shippingPreference?.quoteId === 'andreani_branch'
      ? 'branch'
      : 'home'
  )
  const [selectedZoneKey, setSelectedZoneKey] = useState(shippingPreference?.zoneKey || 'amba')
  const [postalCode, setPostalCode] = useState(shippingPreference?.postalCode || '')
  const [showCpInput, setShowCpInput] = useState(false)

  const allImages = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : (product?.imageUrl ? [product.imageUrl] : ['/logo.png'])
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    setActiveImageIndex(0)
    // Garantizar que el modal siempre abra desde arriba
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0
    }
  }, [product])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // SEO dinámico y Rich Snippet JSON-LD
  useEffect(() => {
    if (product) {
      updatePageSEO({
        title: `${product.name} | AzkabanStore`,
        description: product.description || `Comprá ${product.name} en AzkabanStore. Indumentaria deportiva y urbana con envíos a todo el país.`,
        canonical: `https://www.azkabanstore.com.ar/catalogo?category=${product.category || 'todos'}`,
        image: product.imageUrl,
        schemaJson: createProductSchema(product),
      })
    }
    return () => {
      updatePageSEO({ schemaJson: null })
    }
  }, [product])

  const price = product.priceOffer || product.price || 0
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0
  const itemSubtotal = price * quantity

  // Cotizaciones dinámicas según zona/CP y subtotal
  const shippingCalculation = useMemo(() => {
    const input = (postalCode && postalCode.trim().length >= 3) ? postalCode.trim() : selectedZoneKey
    return calculateShippingQuotes(input, itemSubtotal)
  }, [postalCode, selectedZoneKey, itemSubtotal])

  // Sincronizar zona detectada por CP
  useEffect(() => {
    if (shippingCalculation?.zoneInfo?.zoneKey && shippingCalculation.zoneInfo.zoneKey !== selectedZoneKey) {
      setSelectedZoneKey(shippingCalculation.zoneInfo.zoneKey)
    }
  }, [shippingCalculation?.zoneInfo?.zoneKey])

  const homeQuote = shippingCalculation?.quotes?.find((q) => q.id === 'andreani_home')
  const branchQuote = shippingCalculation?.quotes?.find((q) => q.id === 'andreani_branch')
  const pickupQuote = shippingCalculation?.quotes?.find((q) => q.id === 'pickup')

  // Determinar cotización activa
  const activeQuote = useMemo(() => {
    if (shippingMode === 'pickup') {
      return (
        pickupQuote || {
          id: 'pickup',
          carrier: 'AzkabanStore',
          type: 'Punto de Retiro',
          name: 'Retiro en San Martín',
          zoneName: 'San Martín, Buenos Aires',
          price: 0,
          isFree: true,
          estimatedDays: 'Inmediato',
          icon: '🚶',
        }
      )
    }
    if (shippingMode === 'branch') {
      return (
        branchQuote || {
          id: 'andreani_branch',
          name: 'Andreani Retiro en Sucursal',
          price: 4600,
          icon: '🏢',
          estimatedDays: '24 a 48 hs',
        }
      )
    }
    return (
      homeQuote || {
        id: 'andreani_home',
        name: 'Andreani a Domicilio',
        price: 5900,
        icon: '🏠',
        estimatedDays: '24 a 48 hs',
      }
    )
  }, [shippingMode, homeQuote, branchQuote, pickupQuote])

  const shippingCost = Number(activeQuote?.price) || 0
  const grandTotal = itemSubtotal + shippingCost

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, {
      zoneKey: selectedZoneKey,
      postalCode: postalCode.trim(),
      quoteId: activeQuote.id,
    })
    onClose()
  }

  const handleDirectBuyWhatsApp = () => {
    const url = generateProductBuyLink(product, selectedSize, quantity, activeQuote)
    window.open(url, '_blank')
  }

  const handleGeneralInquiry = () => {
    const url = generateProductInquiryLink(product, selectedSize)
    window.open(url, '_blank')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Botón Cerrar (X) con espacio protegido */}
        <button className="modal-close" onClick={onClose} aria-label="Cerrar ventana">
          <FiX size={18} />
        </button>

        <div className="modal-layout" ref={modalScrollRef}>
          {/* Columna Izquierda: Foto / Video */}
          <div className="modal-media-col">
            <div className={`modal-media ${view === 'video' && video?.vertical ? 'modal-media--vertical' : ''}`}>
              {view === 'video' && video ? (
                <ProductVideo video={video} title={product.name} />
              ) : (
                <>
                  <img
                    src={allImages[activeImageIndex] || product.imageUrl || '/logo.png'}
                    alt={product.name}
                    className="modal-img"
                    onError={(e) => { e.target.src = '/logo.png' }}
                  />
                  {product.badge && <span className="modal-tag">{product.badge}</span>}
                </>
              )}
            </div>

            {/* Miniaturas de galería */}
            {allImages.length > 1 && (
              <div className="modal-thumbs-row">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`modal-thumb-btn ${idx === activeImageIndex && view === 'photo' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveImageIndex(idx)
                      setView('photo')
                    }}
                    aria-label={`Ver foto ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      onError={(e) => { e.target.src = '/logo.png' }}
                    />
                  </button>
                ))}
              </div>
            )}

            {video && (
              <div className="modal-media-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === 'photo'}
                  className={`modal-media-tab ${view === 'photo' ? 'active' : ''}`}
                  onClick={() => setView('photo')}
                >
                  <FiImage size={15} /> Foto
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === 'video'}
                  className={`modal-media-tab ${view === 'video' ? 'active' : ''}`}
                  onClick={() => setView('video')}
                >
                  <FiPlay size={15} /> Ver video
                </button>
              </div>
            )}
          </div>

          {/* Columna Derecha: Información & Compra Inmediata */}
          <div className="modal-content">
            {/* Cabecera del Producto */}
            <div className="modal-heading">
              <div className="modal-heading-top">
                {product.brand && <span className="modal-brand-label">{product.brand}</span>}
                <span className="modal-cat-label">{product.categoryName || 'Indumentaria'}</span>
              </div>
              <h2 className="modal-prod-title">{product.name}</h2>
              <div className="modal-pricing-row">
                <span className="modal-current-price">{formatPrice(price)}</span>
                {product.priceOffer && (
                  <span className="modal-old-price">{formatPrice(product.price)}</span>
                )}
                <span className={`modal-stock-indicator ${isOutOfStock ? 'is-out' : ''}`}>
                  {isOutOfStock ? 'Agotado' : `Stock: ${product.stock} un.`}
                </span>
              </div>
            </div>

            {/* Fila compacta: Talles y Cantidad */}
            <div className="modal-selectors-bar">
              {product.sizes && product.sizes.length > 0 && (
                <div className="modal-sizes-compact">
                  <span className="modal-bar-label">Talle:</span>
                  <div className="modal-sizes-group">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`modal-size-chip ${selectedSize === s ? 'active' : ''}`}
                        onClick={() => setSelectedSize(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-qty-compact">
                <span className="modal-bar-label">Cant:</span>
                <div className="modal-qty-selector">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Restar"
                  >
                    <FiMinus size={12} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    disabled={quantity >= (product.stock || 99)}
                    aria-label="Sumar"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE ENTREGA Y ENVÍO (COMPACTA, MODERNA Y ELEGANTE) */}
            <div className="modal-shipping-block">
              <div className="modal-shipping-block__header">
                <div className="modal-shipping-title">
                  <FiTruck size={15} className="text-orange" />
                  <span>Entrega &amp; Envío</span>
                </div>

                {/* Selector de Zona / Región */}
                <div className="modal-zone-inline">
                  <FiMapPin size={13} className="text-orange" />
                  <select
                    value={selectedZoneKey}
                    onChange={(e) => {
                      setSelectedZoneKey(e.target.value)
                      setPostalCode('')
                    }}
                    className="modal-zone-select-clean"
                    title="Seleccioná tu zona"
                  >
                    {SHIPPING_ZONES.map((z) => (
                      <option key={z.key} value={z.key}>
                        {z.shortName}
                      </option>
                    ))}
                  </select>

                  {!showCpInput ? (
                    <button
                      type="button"
                      className="btn-toggle-cp"
                      onClick={() => setShowCpInput(true)}
                    >
                      O CP
                    </button>
                  ) : (
                    <input
                      type="text"
                      maxLength="5"
                      placeholder="CP (1650)"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                      className="modal-cp-input-inline"
                    />
                  )}
                </div>
              </div>

              {/* 3 Opciones de entrega claras y táctiles */}
              <div className="modal-shipping-options-grid">
                {/* 1. Domicilio */}
                <button
                  type="button"
                  className={`shipping-opt-card ${shippingMode === 'home' ? 'active' : ''}`}
                  onClick={() => setShippingMode('home')}
                >
                  <div className="opt-card-top">
                    <span className="opt-card-icon">🏠</span>
                    <strong className="opt-card-name">A Domicilio</strong>
                  </div>
                  <span className="opt-card-eta">{homeQuote?.estimatedDays || '24 a 48 hs'}</span>
                  <span className="opt-card-price">
                    {homeQuote?.price === 0 ? '¡GRATIS!' : `+${formatPrice(homeQuote?.price || 5900)}`}
                  </span>
                </button>

                {/* 2. Sucursal Andreani */}
                <button
                  type="button"
                  className={`shipping-opt-card ${shippingMode === 'branch' ? 'active' : ''}`}
                  onClick={() => setShippingMode('branch')}
                >
                  <div className="opt-card-top">
                    <span className="opt-card-icon">🏢</span>
                    <strong className="opt-card-name">En Sucursal</strong>
                  </div>
                  <span className="opt-card-eta">{branchQuote?.estimatedDays || '24 a 48 hs'}</span>
                  <span className="opt-card-price">
                    {branchQuote?.price === 0 ? '¡GRATIS!' : `+${formatPrice(branchQuote?.price || 4600)}`}
                  </span>
                </button>

                {/* 3. Retiro en San Martín */}
                <button
                  type="button"
                  className={`shipping-opt-card ${shippingMode === 'pickup' ? 'active' : ''}`}
                  onClick={() => setShippingMode('pickup')}
                >
                  <div className="opt-card-top">
                    <span className="opt-card-icon">🚶</span>
                    <strong className="opt-card-name">Retiro Local</strong>
                  </div>
                  <span className="opt-card-eta">San Martín</span>
                  <span className="opt-card-price opt-card-price--free">GRATIS</span>
                </button>
              </div>
            </div>

            {/* BANNER DE TOTAL FINAL SUMADO */}
            <div className="modal-total-banner">
              <div className="total-banner-left">
                <span className="total-calc-breakdown">
                  Prenda ({formatPrice(itemSubtotal)}) + Flete ({activeQuote.price === 0 ? 'Gratis' : formatPrice(activeQuote.price)})
                </span>
                <span className="total-banner-label">TOTAL A ABONAR:</span>
              </div>
              <div className="total-banner-price">
                {formatPrice(grandTotal)}
              </div>
            </div>

            {/* BOTONES DE COMPRA Y CARRITO */}
            <div className="modal-cta-buttons">
              <button
                type="button"
                className="btn-whatsapp modal-cta-wa"
                onClick={handleDirectBuyWhatsApp}
                disabled={isOutOfStock}
              >
                <FaWhatsapp size={19} />
                <span>Comprar por WhatsApp • {formatPrice(grandTotal)}</span>
              </button>

              <button
                type="button"
                className="btn-primary modal-cta-add"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <FiShoppingBag size={17} />
                <span>Agregar al Carrito</span>
              </button>
            </div>

            {/* Link de consulta directa & badges */}
            <div className="modal-footer-strip">
              <button
                type="button"
                className="modal-inquiry-link"
                onClick={handleGeneralInquiry}
              >
                <FiHelpCircle size={13} /> ¿Dudas con talle o tela? Consultá acá
              </button>

              <div className="modal-assurances-clean">
                <span>🚚 Andreani Express</span>
                <span>•</span>
                <span>📍 Retiro en San Martín</span>
                <span>•</span>
                <span>🔒 Garantía 7 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal
