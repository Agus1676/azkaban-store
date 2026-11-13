import { useState, useMemo, useEffect } from 'react'
import {
  FiX,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiTruck,
  FiUser,
  FiPhone,
  FiCreditCard,
  FiMapPin,
  FiCheckCircle,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import { calculateShippingQuotes, resolveZoneByPostalCode } from '../../utils/shipping'
import toast from 'react-hot-toast'
import './CartDrawer.css'

const CartDrawer = () => {
  const {
    cart,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    checkoutWhatsApp,
  } = useCart()

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    paymentMethod: 'Transferencia Bancaria',
    notes: '',
  })

  const [postalCode, setPostalCode] = useState('')
  const [selectedQuoteId, setSelectedQuoteId] = useState('pickup')

  // Calcular cotizaciones de Andreani en base al CP ingresado y el subtotal
  const shippingCalculation = useMemo(() => {
    if (!postalCode || postalCode.trim().length < 3) return null
    return calculateShippingQuotes(postalCode, totalPrice)
  }, [postalCode, totalPrice])

  const availableQuotes = shippingCalculation?.quotes || [
    {
      id: 'pickup',
      carrier: 'AzkabanStore',
      type: 'Punto de Retiro',
      name: 'Retiro en San Martín (Gratis)',
      price: 0,
      isFree: true,
      estimatedDays: 'Inmediato',
      icon: '🚶',
      description: 'Dr. marcos zimmermann 3339, San Martín.',
    },
    {
      id: 'andreani_home',
      carrier: 'Andreani',
      type: 'Domicilio',
      name: 'Andreani a Domicilio',
      price: 5900,
      isFree: false,
      estimatedDays: '24 a 72 hs hábiles',
      icon: '📦',
      description: 'Ingresá tu código postal para cotizar exacto a tu ciudad.',
    },
  ]

  const activeQuote =
    availableQuotes.find((q) => q.id === selectedQuoteId) || availableQuotes[0]

  const shippingCost = Number(activeQuote?.price) || 0
  const finalTotal = totalPrice + shippingCost

  if (!isOpen) return null

  const isDelivery = activeQuote.id !== 'pickup'

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()

    if (cart.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }

    if (!customer.name.trim()) {
      toast.error('Por favor ingresá tu nombre completo')
      return
    }

    if (!customer.phone.trim()) {
      toast.error('Por favor ingresá tu teléfono o WhatsApp')
      return
    }

    if (isDelivery && !customer.city.trim()) {
      toast.error('Por favor indicá tu localidad y provincia para el despacho')
      return
    }

    if (isDelivery && activeQuote.type === 'Domicilio' && !customer.address.trim()) {
      toast.error('Por favor ingresá la dirección de entrega de tu domicilio')
      return
    }

    checkoutWhatsApp(
      {
        ...customer,
        shippingMethod: activeQuote.name,
      },
      {
        ...activeQuote,
        postalCode: postalCode.trim(),
      }
    )
  }

  return (
    <div className="cart-overlay" onClick={() => setIsOpen(false)}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <FiShoppingBag size={20} className="text-orange" />
            <div>
              <h3>Tu Carrito</h3>
              <span>{totalItems} {totalItems === 1 ? 'prenda' : 'prendas'}</span>
            </div>
          </div>
          <button className="cart-close-btn" onClick={() => setIsOpen(false)} aria-label="Cerrar">
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <FiShoppingBag size={48} className="empty-bag-icon" />
              <h4>Tu carrito está vacío</h4>
              <p>Mirá nuestro catálogo y sumá las prendas que más te gusten.</p>
              <button className="btn-primary" onClick={() => setIsOpen(false)}>
                Ver Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="cart-items-group">
                {cart.map((item) => {
                  const unitPrice = item.product.priceOffer || item.product.price || 0
                  return (
                    <div key={item.cartItemId} className="cart-row">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="cart-row-img"
                        onError={(e) => { e.target.src = '/logo.jpg' }}
                      />
                      <div className="cart-row-details">
                        <h4 className="cart-row-title">{item.product.name}</h4>
                        <span className="cart-row-size">
                          Talle: <strong>{item.selectedSize}</strong>
                        </span>
                        <span className="cart-row-price">{formatPrice(unitPrice)}</span>

                        <div className="cart-row-bottom">
                          <div className="cart-stepper">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              aria-label="Menos"
                            >
                              <FiMinus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              aria-label="Más"
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="cart-remove-btn"
                            onClick={() => removeFromCart(item.cartItemId)}
                            title="Eliminar prenda"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Order Form */}
              <form className="cart-order-form" onSubmit={handleCheckoutSubmit}>
                <h4 className="order-form-title">
                  <FiUser size={16} /> Datos para el Pedido
                </h4>

                <div className="form-field">
                  <label>Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Lucas Martínez"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 11 3456 7890"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  />
                </div>

                {/* Métodos de Entrega & Cotizador Andreani */}
                <div className="cart-shipping-section">
                  <label className="shipping-section-label">
                    <FiTruck className="text-orange" size={16} />
                    <span>Método de Entrega & Envíos</span>
                  </label>

                  {/* Postal code input for automatic Andreani rate resolution */}
                  <div className="cart-cp-box">
                    <div className="cart-cp-input-row">
                      <FiMapPin size={15} className="cart-cp-icon" />
                      <input
                        type="text"
                        maxLength="5"
                        placeholder="Ingresá tu CP (ej: 1650, 1425, 2000)"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                        className="cart-cp-input"
                      />
                    </div>
                    {shippingCalculation?.zoneInfo && (
                      <div className="cart-cp-zone-tag">
                        <span>📍 {shippingCalculation.zoneInfo.location}</span>
                        <span className="cart-zone-badge">{shippingCalculation.zoneInfo.zone}</span>
                      </div>
                    )}
                  </div>

                  {/* Free shipping banner / progress if applicable */}
                  {shippingCalculation?.isFreeEligible ? (
                    <div className="cart-free-shipping-pill">
                      🎉 ¡Felicidades! Tenés <strong>ENVÍO ANDREANI GRATIS</strong> en este pedido.
                    </div>
                  ) : shippingCalculation?.amountNeededForFreeShipping > 0 && shippingCalculation?.amountNeededForFreeShipping < 60000 ? (
                    <div className="cart-free-shipping-hint">
                      💡 ¡Sumá {formatPrice(shippingCalculation.amountNeededForFreeShipping)} más para tener <strong>Envío Andreani Gratis</strong>!
                    </div>
                  ) : null}

                  {/* Shipping Options Selector Cards */}
                  <div className="cart-shipping-cards">
                    {availableQuotes.map((q) => {
                      const isSelected = selectedQuoteId === q.id
                      return (
                        <div
                          key={q.id}
                          className={`cart-shipping-card ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedQuoteId(q.id)}
                        >
                          <div className="cart-shipping-card-left">
                            <input
                              type="radio"
                              name="shipping_quote"
                              checked={isSelected}
                              onChange={() => setSelectedQuoteId(q.id)}
                            />
                            <div>
                              <div className="cart-shipping-card-name">
                                <span>{q.icon}</span>
                                <strong>{q.name}</strong>
                              </div>
                              <span className="cart-shipping-card-desc">{q.description}</span>
                              {q.estimatedDays && (
                                <span className="cart-shipping-card-eta">
                                  ⏱️ {q.estimatedDays}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="cart-shipping-card-price">
                            {q.price === 0 ? (
                              <span className="free-price-badge">GRATIS</span>
                            ) : (
                              <strong>{formatPrice(q.price)}</strong>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {isDelivery && (
                  <div className="cart-delivery-details">
                    <div className="form-field">
                      <label>Localidad y Provincia *</label>
                      <input
                        type="text"
                        required={isDelivery}
                        placeholder={
                          shippingCalculation?.zoneInfo
                            ? `Ej: ${shippingCalculation.zoneInfo.province}`
                            : 'Ej: Rosario, Santa Fe'
                        }
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <label>
                        {activeQuote.type === 'Sucursal'
                          ? 'Sucursal Andreani preferida (Opcional)'
                          : 'Dirección de Entrega (Calle y Número) *'}
                      </label>
                      <input
                        type="text"
                        required={isDelivery && activeQuote.type === 'Domicilio'}
                        placeholder={
                          activeQuote.type === 'Sucursal'
                            ? 'Ej: Sucursal San Martín o Centro'
                            : 'Ej: Av. San Martín 1540 2do B'
                        }
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="form-field">
                  <label>Forma de Pago</label>
                  <select
                    value={customer.paymentMethod}
                    onChange={(e) => setCustomer({ ...customer, paymentMethod: e.target.value })}
                  >
                    <option value="Transferencia Bancaria">💳 Transferencia Bancaria</option>
                    <option value="Efectivo al retirar">💵 Efectivo al retirar (San Martín)</option>
                    <option value="Mercado Pago">📱 Mercado Pago</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Aclaraciones (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Horarios de entrega, preferencias..."
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  />
                </div>

                {/* Subtotal & Total Box */}
                <div className="cart-summary-box">
                  <div className="summary-row">
                    <span>Subtotal Prendas:</span>
                    <strong>{formatPrice(totalPrice)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Envío ({activeQuote.name}):</span>
                    <strong className={shippingCost === 0 ? 'text-green' : ''}>
                      {shippingCost === 0 ? '¡GRATIS!' : formatPrice(shippingCost)}
                    </strong>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total Final:</span>
                    <span className="total-highlight-price">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <button type="submit" className="btn-whatsapp checkout-btn">
                  <FaWhatsapp size={19} />
                  <span>Finalizar Pedido por WhatsApp</span>
                </button>
                <p className="checkout-disclaimer">
                  Se abrirá WhatsApp con el resumen de tu pedido para coordinar pago y entrega directamente.
                </p>
              </form>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}

export default CartDrawer
