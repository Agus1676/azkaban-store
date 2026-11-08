import { useState } from 'react'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiTruck, FiMapPin, FiUser, FiPhone, FiDollarSign } from 'react-icons/fi'
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
    shippingMethod: 'Retiro en San Martín (Dr. marcos zimmermann 3339)',
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
      toast.error('Por favor ingresá tu número de teléfono / WhatsApp')
      return
    }

    if (isDelivery && !customer.city.trim()) {
      toast.error('Por favor ingresá tu localidad o provincia para el despacho')
      return
    }

    checkoutWhatsApp(customer)
  }

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsOpen(false)}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-header__title">
            <FiShoppingBag className="icon-cart text-orange" />
            <div>
              <h3>Tu Carrito</h3>
              <span>{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</span>
            </div>
          </div>
          <button
            className="cart-drawer-close"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar carrito"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-drawer-empty">
              <div className="empty-cart-icon">🛒</div>
              <h4>Tu carrito está vacío</h4>
              <p>Mirá nuestro catálogo y sumá tus prendas favoritas para armar tu pedido.</p>
              <button
                className="btn-primary"
                onClick={() => setIsOpen(false)}
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="cart-items-list">
                {cart.map((item) => {
                  const unitPrice = item.product.priceOffer || item.product.price || 0
                  return (
                    <div key={item.cartItemId} className="cart-item">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="cart-item__image"
                        onError={(e) => {
                          e.target.src = '/logo.jpg'
                        }}
                      />
                      <div className="cart-item__details">
                        <h4 className="cart-item__name">{item.product.name}</h4>
                        <div className="cart-item__size-badge">
                          Talle: <strong>{item.selectedSize}</strong>
                        </div>
                        <div className="cart-item__price">
                          {formatPrice(unitPrice)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="cart-item__actions">
                          <div className="cart-qty-control">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              aria-label="Disminuir"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              aria-label="Aumentar"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>

                          <button
                            className="cart-item__remove"
                            onClick={() => removeFromCart(item.cartItemId)}
                            title="Eliminar producto"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Order Form */}
              <form className="cart-checkout-form" onSubmit={handleCheckoutSubmit}>
                <h4 className="form-section-title">
                  <FiUser className="text-orange" /> Datos para el Pedido
                </h4>

                <div className="form-group">
                  <label>Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Martín Rodríguez"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 11 3456 7890"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Método de Entrega *</label>
                  <select
                    value={customer.shippingMethod}
                    onChange={(e) => setCustomer({ ...customer, shippingMethod: e.target.value })}
                  >
                    <option value="Retiro en San Martín (Dr. marcos zimmermann 3339)">
                      🚶 Retiro en persona (San Martín - Sin cargo)
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
                    <div className="form-group">
                      <label>Localidad / Provincia / CP *</label>
                      <input
                        type="text"
                        required={isDelivery}
                        placeholder="Ej: Córdoba Capital - CP 5000"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Dirección de Entrega / Sucursal deseada</label>
                      <input
                        type="text"
                        placeholder="Ej: San Martín 450 piso 2B o Sucursal Andreani Centro"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Forma de Pago Preferida</label>
                  <select
                    value={customer.paymentMethod}
                    onChange={(e) => setCustomer({ ...customer, paymentMethod: e.target.value })}
                  >
                    <option value="Transferencia Bancaria">💳 Transferencia Bancaria</option>
                    <option value="Efectivo al retirar">💵 Efectivo al retirar (San Martín)</option>
                    <option value="Mercado Pago">📱 Mercado Pago (Dinero en cuenta o tarjetas)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Notas adicionales (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Aclaraciones de talles, horarios, etc."
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  />
                </div>

                {/* Total and Submit */}
                <div className="cart-total-box">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <strong>{formatPrice(totalPrice)}</strong>
                  </div>
                  <div className="total-row total-highlight">
                    <span>Total Estimado:</span>
                    <span className="total-number">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <button type="submit" className="btn-primary btn-checkout-whatsapp">
                  <FaWhatsapp size={20} />
                  <span>FINALIZAR PEDIDO POR WHATSAPP</span>
                </button>
                <p className="checkout-hint">
                  Al hacer click se abrirá WhatsApp con el detalle completo de tu pedido para coordinar pago y entrega directamente.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartDrawer
