import { useState } from 'react'
import { FiShoppingBag, FiCheck } from 'react-icons/fi'
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
    <article className="product-card" onClick={() => onOpenDetail(product)}>
      {/* Product Image */}
      <div className="product-card__media">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/logo.jpg'
          }}
        />

        {product.badge && (
          <span className="product-card__badge">{product.badge}</span>
        )}

        {isOutOfStock && (
          <div className="product-card__stock-out">
            <span>Agotado</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-card__info">
        {product.brand && (
          <span className="product-card__brand">{product.brand}</span>
        )}

        <h3 className="product-card__title" title={product.name}>
          {product.name}
        </h3>

        {/* Sizes Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="product-card__sizes" onClick={(e) => e.stopPropagation()}>
            <span className="sizes-title">Talles:</span>
            <div className="sizes-list">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="product-card__pricing">
          <span className="current-price">{formatPrice(price)}</span>
          {product.priceOffer && (
            <span className="old-price">{formatPrice(product.price)}</span>
          )}
        </div>
        <span className="payment-hint">Efectivo o Transferencia</span>

        {/* Action Buttons */}
        <div className="product-card__actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`btn-add-cart ${addedAnim ? 'btn-add-cart--added' : ''}`}
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
          >
            {addedAnim ? (
              <>
                <FiCheck size={15} />
                <span>Agregado</span>
              </>
            ) : (
              <>
                <FiShoppingBag size={15} />
                <span>Agregar</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-wa-inquire"
            onClick={handleWhatsApp}
            title="Consultar por WhatsApp"
            aria-label="WhatsApp"
          >
            <FaWhatsapp size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
