import { useState, useEffect } from 'react'
import { FiX, FiShoppingBag, FiTruck, FiMapPin, FiShield, FiPlus, FiMinus } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import { generateProductInquiryLink } from '../../utils/whatsapp'
import './ProductDetailModal.css'

const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Único'
  )
  const [quantity, setQuantity] = useState(1)

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
          {/* Media */}
          <div className="modal-media">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="modal-img"
              onError={(e) => { e.target.src = '/logo.jpg' }}
            />
            {product.badge && <span className="modal-tag">{product.badge}</span>}
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
              <span className="modal-stock-indicator">
                {isOutOfStock ? 'Agotado' : `Stock disponible: ${product.stock} un.`}
              </span>
            </div>

            <p className="modal-payment-note">
              💳 Pago por transferencia bancaria, Mercado Pago o efectivo al retirar.
            </p>

            {/* Description */}
            <div className="modal-desc-box">
              <h4>Descripción de la prenda:</h4>
              <p>{product.description}</p>
            </div>

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
                >
                  <FiMinus size={14} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  disabled={quantity >= (product.stock || 99)}
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
                <span>Envíos Andreani & Vía Cargo</span>
              </div>
              <div className="assurance-card">
                <FiMapPin className="assurance-icon" />
                <span>Retiro en San Martín</span>
              </div>
              <div className="assurance-card">
                <FiShield className="assurance-icon" />
                <span>Prenda 100% Original</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal
