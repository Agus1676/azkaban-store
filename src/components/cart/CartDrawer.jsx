import { useState } from 'react'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiTruck, FiUser, FiPhone, FiCreditCard } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/formatPrice'
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
    shippingMethod: 'Retiro en persona (San Martín)',
    city: '',
    address: '',
    paymentMethod: 'Transferencia Bancaria',
    notes: '',
  })

  if (!isOpen) return null

  const isDelivery = customer.shippingMethod.includes('Andreani') || customer.shippingMethod.includes('Vía Cargo')

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
      toast.error('Por favor indicá tu localidad o provincia para el despacho')
      return
    }

    checkoutWhatsApp(customer)
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

                <div className="form-field">
                  <label>Método de Entrega *</label>
                  <select
                    value={customer.shippingMethod}
                    onChange={(e) => setCustomer({ ...customer, shippingMethod: e.target.value })}
                  >
                    <option value="Retiro en persona (San Martín)">
                      🚶 Retiro gratis en San Martín (Dr. marcos zimmermann 3339)
                    </option>
                    <option value="Envío por Andreani">
                      📦 Envío por Andreani (A domicilio o sucursal)
                    </option>
                    <option value="Envío por Vía Cargo">
                      🚚 Envío por Vía Cargo (A terminal/agencia)
                    </option>
                  </select>
                </div>

                {isDelivery && (
                  <>
                    <div className="form-field">
                      <label>Localidad / Provincia / CP *</label>
                      <input
                        type="text"
                        required={isDelivery}
                        placeholder="Ej: Rosario, Santa Fe - CP 2000"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <label>Dirección de Entrega o Sucursal</label>
                      <input
                        type="text"
                        placeholder="Ej: Av. Pellegrini 1250 o Sucursal Andreani Centro"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      />
                    </div>
                  </>
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
                    <span>Subtotal:</span>
                    <strong>{formatPrice(totalPrice)}</strong>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total Estimado:</span>
                    <span className="total-highlight-price">{formatPrice(totalPrice)}</span>
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
