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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
          <FiX size={24} />
        </button>

        <div className="modal-grid">
          {/* Image Column */}
          <div className="modal-image-col">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="modal-image"
              onError={(e) => {
                e.target.src = '/logo.jpg'
              }}
            />
            {product.badge && (
              <span className="modal-badge">{product.badge}</span>
            )}
          </div>

          {/* Details Column */}
          <div className="modal-details-col">
            <div className="modal-header">
              {product.brand && <span className="modal-brand">{product.brand}</span>}
              <h2 className="modal-title">{product.name}</h2>
              <span className="modal-category">{product.categoryName || 'Indumentaria'}</span>
            </div>

            <div className="modal-price-box">
              <span className="modal-price">{formatPrice(price)}</span>
              {product.priceOffer && (
                <span className="modal-price-old">{formatPrice(product.price)}</span>
              )}
              <span className="modal-stock-status">
                {isOutOfStock ? '❌ Agotado' : `✅ En Stock (${product.stock} un. disponibles)`}
              </span>
            </div>

            {/* Description */}
            <div className="modal-description">
              <h4>Descripción:</h4>
              <p>{product.description || 'Prenda de alta calidad con excelente confección y materiales de primera línea.'}</p>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="modal-sizes-box">
                <h4>Seleccioná tu Talle:</h4>
                <div className="modal-sizes-list">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`modal-size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="modal-qty-box">
              <h4>Cantidad:</h4>
              <div className="modal-qty-control">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <FiMinus size={16} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  disabled={quantity >= (product.stock || 99)}
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="modal-actions">
              <button
                type="button"
                className="btn-primary modal-btn-add"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <FiShoppingBag size={20} />
                <span>Agregar al Carrito</span>
              </button>

              <button
                type="button"
                className="btn-whatsapp modal-btn-wa"
                onClick={handleWhatsApp}
              >
                <FaWhatsapp size={20} />
                <span>Comprar por WhatsApp</span>
              </button>
            </div>

            {/* Store Highlights */}
            <div className="modal-trust-pills">
              <div className="trust-pill">
                <FiTruck className="text-orange" />
                <span>Envíos Andreani & Vía Cargo</span>
              </div>
              <div className="trust-pill">
                <FiMapPin className="text-orange" />
                <span>Retiro en San Martín</span>
              </div>
              <div className="trust-pill">
                <FiShield className="text-orange" />
                <span>Calidad Garantizada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal
