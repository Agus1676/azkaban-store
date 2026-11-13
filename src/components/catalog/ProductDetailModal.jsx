import { useState, useEffect } from 'react'
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
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import { generateProductInquiryLink } from '../../utils/whatsapp'
import { parseVideoUrl } from '../../utils/video'
import { getReturnPolicy, RETURN_POLICY_PATH } from '../../data/policies'
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
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Único'
  )
  const [quantity, setQuantity] = useState(1)
  const video = parseVideoUrl(product?.videoUrl)
  const [view, setView] = useState(initialView === 'video' && video ? 'video' : 'photo')
  const [policyOpen, setPolicyOpen] = useState(false)
  const returnPolicy = getReturnPolicy()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!product) return null

  const price = product.priceOffer || product.price || 0
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize)
    onClose()
  }

  const handleWhatsApp = () => {
    const url = generateProductInquiryLink(product, selectedSize)
    window.open(url, '_blank')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar ventana">
          <FiX size={20} />
        </button>

        <div className="modal-layout">
          {/* Media: Foto / Video */}
          <div className="modal-media-col">
            <div className={`modal-media ${view === 'video' && video?.vertical ? 'modal-media--vertical' : ''}`}>
              {view === 'video' && video ? (
                <ProductVideo video={video} title={product.name} />
              ) : (
                <>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="modal-img"
                    onError={(e) => { e.target.src = '/logo.png' }}
                  />
                  {product.badge && <span className="modal-tag">{product.badge}</span>}
                </>
              )}
            </div>

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

          {/* Info */}
          <div className="modal-content">
            <div className="modal-heading">
              {product.brand && <span className="modal-brand-label">{product.brand}</span>}
              <h2 className="modal-prod-title">{product.name}</h2>
              <span className="modal-cat-label">{product.categoryName || 'Indumentaria'}</span>
            </div>

            <div className="modal-pricing-row">
              <span className="modal-current-price">{formatPrice(price)}</span>
              {product.priceOffer && (
                <span className="modal-old-price">{formatPrice(product.price)}</span>
              )}
              <span className={`modal-stock-indicator ${isOutOfStock ? 'is-out' : ''}`}>
                {isOutOfStock ? 'Agotado' : `Stock disponible: ${product.stock} un.`}
              </span>
            </div>

            <p className="modal-payment-note">
              💳 Pago por transferencia bancaria, Mercado Pago o efectivo al retirar.
            </p>

            {/* Description */}
            {product.description && (
              <div className="modal-desc-box">
                <h4>Descripción de la prenda:</h4>
                <p>{product.description}</p>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="modal-sizes-container">
                <h4>Seleccionar Talle:</h4>
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

            {/* Quantity */}
            <div className="modal-qty-container">
              <h4>Cantidad:</h4>
              <div className="modal-qty-selector">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Restar"
                >
                  <FiMinus size={14} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  disabled={quantity >= (product.stock || 99)}
                  aria-label="Sumar"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="modal-cta-buttons">
              <button
                type="button"
                className="btn-primary modal-cta-add"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <FiShoppingBag size={18} />
                <span>Agregar al Carrito</span>
              </button>

              <button
                type="button"
                className="btn-whatsapp modal-cta-wa"
                onClick={handleWhatsApp}
              >
                <FaWhatsapp size={18} />
                <span>Consultar por WhatsApp</span>
              </button>
            </div>

            {/* Assurances */}
            <div className="modal-assurances">
              <div className="assurance-card">
                <FiTruck className="assurance-icon" />
                <span>Envíos Andreani &amp; Vía Cargo</span>
              </div>
              <div className="assurance-card">
                <FiMapPin className="assurance-icon" />
                <span>Retiro en San Martín</span>
              </div>
              <div className="assurance-card">
                <FiAward className="assurance-icon" />
                <span>Prendas 100% calidad</span>
              </div>
            </div>

            {/* Return policy */}
            <div className={`modal-policy ${policyOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="modal-policy__toggle"
                onClick={() => setPolicyOpen(!policyOpen)}
                aria-expanded={policyOpen}
              >
                <span className="modal-policy__title">
                  <FiRefreshCw size={15} /> Cambios y devoluciones
                </span>
                <FiChevronDown size={16} className="modal-policy__chevron" />
              </button>
              {policyOpen && (
                <div className="modal-policy__body">
                  <ul>
                    {returnPolicy.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <Link to={RETURN_POLICY_PATH} onClick={onClose} className="modal-policy__link">
                    Ver condiciones completas →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal
