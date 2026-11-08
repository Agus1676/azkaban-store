import { FiPrinter, FiX, FiCheck } from 'react-icons/fi'
import { formatPrice } from '../../utils/formatPrice'

const AdminOrderInvoiceModal = ({ isOpen, onClose, order, storeConfig }) => {
  if (!isOpen || !order) return null

  const handlePrint = () => {
    window.print()
  }

  const orderDate = order.date ? new Date(order.date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : 'Fecha no registrada'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="invoice-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Actions bar (hidden in print) */}
        <div className="invoice-top-actions no-print">
          <button className="btn-secondary btn-sm" onClick={onClose}>
            <FiX size={16} /> Cerrar
          </button>
          <button className="btn-primary btn-sm" onClick={handlePrint}>
            <FiPrinter size={16} /> Imprimir Remito de Despacho
          </button>
        </div>

        {/* Printable Sheet */}
        <div className="invoice-sheet" id="printable-invoice">
          {/* Header */}
          <div className="invoice-header">
            <div className="invoice-brand">
              <img src="/logo.png" alt="AzkabanStore" className="invoice-logo" />
              <div>
                <h2 className="invoice-title">AZKABANSTORE</h2>
                <span className="invoice-subtitle">INDUMENTARIA DEPORTIVA Y URBANA</span>
                <p className="invoice-meta-text">
                  Dr. marcos zimmermann 3339 • San Martín, Prov. Buenos Aires<br />
                  WhatsApp: {storeConfig?.phoneDisplay || '+54 9 11 3793-4198'} • {storeConfig?.email || 'azkabanstoreonline@gmail.com'}
                </p>
              </div>
            </div>

            <div className="invoice-order-badge">
              <span className="invoice-badge-label">ORDEN DE PEDIDO</span>
              <strong className="invoice-order-num">#{order.id}</strong>
              <span className="invoice-date">{orderDate}</span>
              <div className="invoice-status-tag">{order.status || 'Pendiente'}</div>
            </div>
          </div>

          <div className="invoice-divider" />

          {/* Customer & Shipping Details */}
          <div className="invoice-parties-grid">
            <div className="invoice-party-box">
              <h4 className="invoice-section-title">DATOS DEL DESTINATARIO:</h4>
              <p className="invoice-detail-row">
                <strong>Nombre:</strong> {order.customer?.name || 'Cliente'}
              </p>
              <p className="invoice-detail-row">
                <strong>Teléfono:</strong> {order.customer?.phone || 'No indicado'}
              </p>
              {order.customer?.city && (
                <p className="invoice-detail-row">
                  <strong>Localidad / CP:</strong> {order.customer.city}
                </p>
              )}
              {order.customer?.address && (
                <p className="invoice-detail-row">
                  <strong>Dirección de Entrega:</strong> {order.customer.address}
                </p>
              )}
            </div>

            <div className="invoice-party-box">
              <h4 className="invoice-section-title">LOGÍSTICA & PAGO:</h4>
              <p className="invoice-detail-row">
                <strong>Método de Entrega:</strong> {order.shippingMethod}
              </p>
              {order.trackingCode && (
                <p className="invoice-detail-row">
                  <strong>Código de Guía:</strong> <span className="tracking-highlight">{order.trackingCode}</span>
                </p>
              )}
              <p className="invoice-detail-row">
                <strong>Medio de Pago:</strong> {order.paymentMethod}
              </p>
              {order.customer?.notes && (
                <p className="invoice-detail-row">
                  <strong>Notas:</strong> {order.customer.notes}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th>Ítem / Prenda</th>
                <th style={{ textAlign: 'center' }}>Talle</th>
                <th style={{ textAlign: 'center' }}>Cant.</th>
                <th style={{ textAlign: 'right' }}>Precio Unit.</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((it, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{it.name}</strong>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="table-size-pill">{it.size || 'Único'}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>{it.qty}</td>
                  <td style={{ textAlign: 'right' }}>{formatPrice(it.price)}</td>
                  <td style={{ textAlign: 'right' }}>{formatPrice(it.price * it.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Row */}
          <div className="invoice-totals-box">
            <div className="invoice-total-line">
              <span>TOTAL PEDIDO:</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          </div>

          {/* Footer note for Andreani / Via Cargo */}
          <div className="invoice-footer-note">
            <p>
              Comprobante oficial de despacho y empaque • AzkabanStore San Martín.<br />
              Gracias por tu compra. Ante cualquier consulta podés comunicarte vía WhatsApp al {storeConfig?.phoneDisplay || '+54 9 11 3793-4198'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderInvoiceModal
