import { useState, useMemo } from 'react'
import {
  FiShoppingBag,
  FiSearch,
  FiTruck,
  FiPhone,
  FiPrinter,
  FiTrash2,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiExternalLink,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { formatPrice } from '../../utils/formatPrice'
import toast from 'react-hot-toast'

const ORDER_STATUSES = [
  'Pendiente',
  'Pago Confirmado',
  'En preparación',
  'Despachado por Andreani',
  'Despachado por Vía Cargo',
  'Listo para retirar en San Martín',
  'Entregado',
  'Cancelado',
]

const AdminOrdersTab = ({
  orders,
  storeConfig,
  onUpdateStatus,
  onUpdateTracking,
  onDeleteOrder,
  onOpenInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [trackingInputs, setTrackingInputs] = useState({})

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status
      if (statusFilter !== 'all' && o.status !== statusFilter) {
        return false
      }
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const idMatch = o.id?.toLowerCase().includes(q)
        const nameMatch = o.customer?.name?.toLowerCase().includes(q)
        const phoneMatch = o.customer?.phone?.toLowerCase().includes(q)
        const cityMatch = o.customer?.city?.toLowerCase().includes(q)
        const trackingMatch = o.trackingCode?.toLowerCase().includes(q)
        if (!idMatch && !nameMatch && !phoneMatch && !cityMatch && !trackingMatch) {
          return false
        }
      }
      return true
    })
  }, [orders, statusFilter, searchTerm])

  // Tracking code change
  const handleTrackingInputChange = (orderId, val) => {
    setTrackingInputs((prev) => ({ ...prev, [orderId]: val }))
  }

  const handleSaveTracking = (orderId) => {
    const code = trackingInputs[orderId] || ''
    onUpdateTracking(orderId, code.trim())
    toast.success(`Código de seguimiento guardado para #${orderId}`)
  }

  // Send WhatsApp message to customer with order status & tracking
  const handleSendWhatsAppNotification = (order) => {
    const rawPhone = order.customer?.phone?.replace(/\D/g, '')
    if (!rawPhone) {
      toast.error('Este pedido no tiene teléfono registrado')
      return
    }

    // Format phone with country code (Argentina 54 9)
    let fullPhone = rawPhone
    if (!fullPhone.startsWith('54')) {
      if (fullPhone.startsWith('9')) {
        fullPhone = `54${fullPhone}`
      } else if (fullPhone.startsWith('11') || fullPhone.length === 10) {
        fullPhone = `549${fullPhone}`
      } else {
        fullPhone = `549${fullPhone}`
      }
    }

    let text = `¡Hola ${order.customer?.name || ''}! 👋 Te escribimos desde *AzkabanStore* sobre tu pedido *#${order.id}*.\n\n`

    if (order.status?.includes('Despachado')) {
      text += `📦 *¡Tu paquete ya fue despachado!* 🚚\n`
      text += `• *Logística:* ${order.shippingMethod}\n`
      if (order.trackingCode) {
        text += `• *Código de Seguimiento:* *${order.trackingCode}*\n`
        text += `Podés consultar el estado ingresando este número en la web oficial del correo.\n`
      }
    } else if (order.status?.includes('Listo para retirar')) {
      text += `📍 *¡Tu pedido ya está listo para retirar!* 🎉\n`
      text += `Podés pasar por nuestro punto de retiro:\n`
      text += `🏢 *${storeConfig?.address || 'Dr. marcos zimmermann 3339, San Martín'}*\n`
      text += `⏰ *Horarios:* ${storeConfig?.hours || 'Lunes a Viernes de 10 a 20hs'}\n`
    } else if (order.status === 'Pago Confirmado') {
      text += `✅ *¡Pago confirmado exitosamente!* Estamos preparando tus prendas para el empaque y despacho.\n`
    } else {
      text += `El estado actual de tu pedido es: *${order.status || 'Pendiente'}*.\n`
    }

    text += `\n💰 *Total:* ${formatPrice(order.total)}\n`
    text += `¡Muchas gracias por confiar en AzkabanStore!`

    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`, '_blank')
  }

  // Quick WhatsApp chat with customer
  const handleChatCustomer = (phone) => {
    const rawPhone = phone?.replace(/\D/g, '')
    if (!rawPhone) return
    let fullPhone = rawPhone
    if (!fullPhone.startsWith('54')) {
      fullPhone = `549${fullPhone}`
    }
    window.open(`https://wa.me/${fullPhone}`, '_blank')
  }

  return (
    <div className="admin-content-card">
      {/* Header */}
      <div className="admin-content-card__header">
        <div>
          <h3>Gestión de Pedidos & Ventas ({orders.length} órdenes)</h3>
          <p>
            Controlá pagos, prepará pedidos, cargá números de seguimiento y avisá a tus clientes por WhatsApp.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por cliente, teléfono, código o tracking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-select-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados ({orders.length})</option>
            {ORDER_STATUSES.map((st) => {
              const count = orders.filter((o) => o.status === st).length
              return (
                <option key={st} value={st}>
                  {st} ({count})
                </option>
              )
            })}
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-container-list">
        {filteredOrders.length === 0 ? (
          <div className="admin-empty-table">
            <FiShoppingBag size={40} className="text-muted" />
            <h4>No hay pedidos registrados con este filtro</h4>
            <p>Los pedidos realizados por WhatsApp desde el carrito aparecerán en este registro.</p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const currentTracking =
              trackingInputs[ord.id] !== undefined
                ? trackingInputs[ord.id]
                : ord.trackingCode || ''

            const formattedDate = ord.date
              ? new Date(ord.date).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Fecha no registrada'

            return (
              <div key={ord.id} className="admin-order-card">
                {/* Order Top Bar */}
                <div className="order-card-topbar">
                  <div className="order-card-id-block">
                    <span className="order-card-badge-id">ORDEN #{ord.id}</span>
                    <span className="order-card-date">
                      <FiClock size={12} /> {formattedDate}
                    </span>
                  </div>

                  <div className="order-card-status-select-wrap">
                    <label className="text-xs text-muted">Estado del Pedido:</label>
                    <select
                      className={`order-status-dropdown order-status--${getStatusClass(
                        ord.status
                      )}`}
                      value={ord.status || 'Pendiente'}
                      onChange={(e) => onUpdateStatus(ord.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Order Grid: Customer / Shipping / Items */}
                <div className="order-card-grid">
                  {/* Col 1: Customer Details */}
                  <div className="order-info-column">
                    <h5 className="column-title">Datos del Comprador</h5>
                    <div className="customer-detail-item">
                      <strong>{ord.customer?.name || 'Cliente sin nombre'}</strong>
                    </div>

                    {ord.customer?.phone && (
                      <div className="customer-phone-row">
                        <FiPhone size={13} className="text-orange" />
                        <span>{ord.customer?.phone}</span>
                        <button
                          type="button"
                          className="btn-chat-inline"
                          onClick={() => handleChatCustomer(ord.customer.phone)}
                          title="Abrir chat en WhatsApp"
                        >
                          <FaWhatsapp size={14} /> Chat
                        </button>
                      </div>
                    )}

                    {ord.customer?.city && (
                      <div className="customer-location-item">
                        <span>📍 {ord.customer.city}</span>
                        {ord.customer.address && (
                          <span className="text-muted text-xs">
                            ({ord.customer.address})
                          </span>
                        )}
                      </div>
                    )}

                    <div className="order-payment-pill">
                      <span>Forma de Pago: <strong>{ord.paymentMethod}</strong></span>
                    </div>
                  </div>

                  {/* Col 2: Logistics & Tracking */}
                  <div className="order-info-column">
                    <h5 className="column-title">Logística & Despacho</h5>
                    <div className="shipping-method-tag">
                      <FiTruck size={14} />
                      <span>{ord.shippingMethod}</span>
                    </div>

                    {/* Tracking Code Input */}
                    <div className="tracking-code-block">
                      <label className="text-xs">
                        Código de Seguimiento (Andreani / Vía Cargo):
                      </label>
                      <div className="tracking-input-row">
                        <input
                          type="text"
                          placeholder="Ej: 36000049281..."
                          value={currentTracking}
                          onChange={(e) =>
                            handleTrackingInputChange(ord.id, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => handleSaveTracking(ord.id)}
                          title="Guardar código de seguimiento"
                        >
                          <FiCheck size={14} /> Guardar
                        </button>
                      </div>
                    </div>

                    {/* WhatsApp Tracking Notification Button */}
                    <button
                      type="button"
                      className="btn-whatsapp-notify"
                      onClick={() => handleSendWhatsAppNotification(ord)}
                    >
                      <FaWhatsapp size={15} />
                      <span>Enviar Notificación / Tracking</span>
                    </button>
                  </div>

                  {/* Col 3: Items & Totals */}
                  <div className="order-info-column order-items-column">
                    <h5 className="column-title">
                      Prendas Solicitadas ({ord.items?.length || 0})
                    </h5>
                    <div className="order-items-scroll">
                      {ord.items?.map((it, i) => (
                        <div key={i} className="order-item-line">
                          <div>
                            <strong>{it.qty}x</strong> {it.name}
                            <span className="item-size-tag">Talle: {it.size}</span>
                          </div>
                          <strong>{formatPrice(it.price * it.qty)}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="order-total-bar">
                      <span>Total Abonado:</span>
                      <strong className="order-grand-total">
                        {formatPrice(ord.total)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Order Footer Actions */}
                <div className="order-card-footer">
                  <div className="order-footer-left">
                    {ord.customer?.notes && (
                      <span className="order-customer-notes">
                        💬 <strong>Aclaraciones:</strong> {ord.customer.notes}
                      </span>
                    )}
                  </div>
                  <div className="order-footer-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => onOpenInvoice(ord)}
                      title="Imprimir remito oficial para el paquete"
                    >
                      <FiPrinter size={14} /> Remito de Despacho
                    </button>
                    <button
                      type="button"
                      className="btn-delete-order"
                      onClick={() => onDeleteOrder(ord.id)}
                      title="Eliminar este pedido"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function getStatusClass(status) {
  if (!status) return 'pending'
  const s = status.toLowerCase()
  if (s.includes('entregado')) return 'completed'
  if (s.includes('despachado') || s.includes('listo')) return 'shipping'
  if (s.includes('confirmado') || s.includes('preparación')) return 'active'
  if (s.includes('cancelado')) return 'cancelled'
  return 'pending'
}

export default AdminOrdersTab
