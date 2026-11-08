import { useState } from 'react'
import { FiShoppingBag, FiEye, FiCheck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import { generateProductInquiryLink } from '../../utils/whatsapp'
import './ProductCard.css'

const ProductCard = ({ product, onOpenDetail }) => {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Único'
  )
  const [addedAnim, setAddedAnim] = useState(false)

  const handleQuickAdd = (e) => {
    e.stopPropagation()
    addToCart(product, 1, selectedSize)
    setAddedAnim(true)
    setTimeout(() => setAddedAnim(false), 1200)
  }

  const handleWhatsApp = (e) => {
    e.stopPropagation()
    const url = generateProductInquiryLink(product, selectedSize)
    window.open(url, '_blank')
  }

  const price = product.priceOffer || product.price || 0
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0

  return (
    <div className={`product-card ${isOutOfStock ? 'product-card--out' : ''}`} onClick={() => onOpenDetail(product)}>
      {/* Image & Badges */}
      <div className="product-card__image-box">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/logo.jpg'
          }}
        />

        {product.badge && (
          <span className="product-card__badge">{product.badge}</span>
        )}

        {product.brand && (
          <span className="product-card__brand-pill">{product.brand}</span>
        )}

        {isOutOfStock && (
          <div className="out-of-stock-overlay">
            <span>SIN STOCK</span>
          </div>
        )}

        <button
          className="product-card__quick-view"
          onClick={(e) => {
            e.stopPropagation()
            onOpenDetail(product)
          }}
          aria-label="Ver detalle"
        >
          <FiEye size={18} />
        </button>
      </div>

      {/* Info */}
      <div className="product-card__body">
        <span className="product-card__category">{product.categoryName || 'Indumentaria'}</span>
        <h3 className="product-card__name" title={product.name}>
          {product.name}
        </h3>

        {/* Sizes Selector Chips */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="product-card__sizes" onClick={(e) => e.stopPropagation()}>
            <span className="sizes-label">Talles:</span>
            <div className="sizes-chips">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-chip ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Stock info */}
        <div className="product-card__price-row">
          <div className="price-tag">
            <span className="price-current">{formatPrice(price)}</span>
            {product.priceOffer && (
              <span className="price-original">{formatPrice(product.price)}</span>
            )}
          </div>
          <span className="stock-hint">
            {typeof product.stock === 'number' && product.stock <= 3 && product.stock > 0
              ? `¡Últimas ${product.stock} un.!`
              : 'En Stock'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="product-card__footer" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`btn-card-add ${addedAnim ? 'btn-card-add--success' : ''}`}
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
          >
            {addedAnim ? (
              <>
                <FiCheck size={16} />
                <span>¡Sumado!</span>
              </>
            ) : (
              <>
                <FiShoppingBag size={16} />
                <span>Agregar</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-card-wa"
            onClick={handleWhatsApp}
            title="Consultar por WhatsApp"
          >
            <FaWhatsapp size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
