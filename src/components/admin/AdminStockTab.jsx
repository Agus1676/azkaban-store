import { useState, useMemo } from 'react'
import {
  FiArchive,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiSearch,
  FiPackage,
  FiHome,
  FiAlertTriangle,
  FiX,
  FiCheck,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { addStoredStockLog } from '../../services/storeDb'

const AdminStockTab = ({ products = [], onAdjustStock, onSetStock }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Inline edit state
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  // Restock Modal
  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [restockProduct, setRestockProduct] = useState('')
  const [restockQty, setRestockQty] = useState(5)

  // Counter Sale Modal
  const [isSaleOpen, setIsSaleOpen] = useState(false)
  const [saleProduct, setSaleProduct] = useState('')
  const [saleQty, setSaleQty] = useState(1)
  const [saleCustomer, setSaleCustomer] = useState('')
  const [salePayment, setSalePayment] = useState('efectivo')

  const totalProducts = products.length
  const totalUnits = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0)
  const lowStockCount = products.filter((p) => {
    const s = Number(p.stock) || 0
    return s > 0 && s <= 2
  }).length
  const outOfStockCount = products.filter((p) => (Number(p.stock) || 0) <= 0).length

  // Categories list
  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category).filter(Boolean))]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const nameMatch = p.name?.toLowerCase().includes(q)
        const brandMatch = p.brand?.toLowerCase().includes(q)
        if (!nameMatch && !brandMatch) return false
      }

      if (categoryFilter !== 'all' && p.category !== categoryFilter) {
        return false
      }

      const s = Number(p.stock) || 0
      if (statusFilter === 'available' && s <= 2) return false
      if (statusFilter === 'low' && (s <= 0 || s > 2)) return false
      if (statusFilter === 'out' && s > 0) return false

      return true
    })
  }, [products, searchTerm, statusFilter, categoryFilter])

  // Handle inline stock update
  const handleEditStockSubmit = (productId) => {
    const val = parseInt(editValue, 10)
    if (isNaN(val) || val < 0) {
      toast.error('Por favor ingresá un número válido mayor o igual a 0')
      return
    }
    onSetStock(productId, val)
    addStoredStockLog({
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      productId,
      productName: products.find((p) => p.id === productId)?.name || 'Prenda',
      type: 'ajuste_manual',
      qty: val,
      note: `Ajuste manual directo a ${val} un.`,
    })
    setEditingId(null)
    toast.success('Stock actualizado correctamente')
  }

  // Handle Restock Submit
  const handleRestockSubmit = (e) => {
    e.preventDefault()
    if (!restockProduct) {
      toast.error('Seleccioná un producto para reponer')
      return
    }
    const qty = parseInt(restockQty, 10)
    if (!qty || qty <= 0) {
      toast.error('Ingresá una cantidad válida')
      return
    }

    onAdjustStock(restockProduct, qty)
    const prod = products.find((p) => p.id === restockProduct)
    addStoredStockLog({
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      productId: restockProduct,
      productName: prod?.name || 'Prenda',
      type: 'reposicion',
      qty: qty,
      note: `Ingreso de stock (+${qty} un.)`,
    })

    toast.success(`Se ingresaron ${qty} unidades a ${prod?.name || 'producto'}`)
    setIsRestockOpen(false)
    setRestockProduct('')
    setRestockQty(5)
  }

  // Handle Counter Sale Submit
  const handleSaleSubmit = (e) => {
    e.preventDefault()
    if (!saleProduct) {
      toast.error('Seleccioná un producto vendido')
      return
    }
    const qty = parseInt(saleQty, 10)
    if (!qty || qty <= 0) {
      toast.error('Ingresá una cantidad válida')
      return
    }

    const prod = products.find((p) => p.id === saleProduct)
    const currentStock = Number(prod?.stock) || 0

    if (qty > currentStock) {
      toast.error(`Stock insuficiente. Solo hay ${currentStock} unidades disponibles.`)
      return
    }

    onAdjustStock(saleProduct, -qty)
    const unitPrice = prod?.offerPrice || prod?.priceOffer || prod?.price || 0
    const totalAmount = unitPrice * qty

    addStoredStockLog({
      id: `sale-${Date.now()}`,
      date: new Date().toISOString(),
      productId: saleProduct,
      productName: prod?.name || 'Prenda',
      type: 'venta_fisica',
      qty: -qty,
      customerName: saleCustomer.trim() || 'Cliente Mostrador',
      paymentMethod: salePayment,
      unitPrice,
      totalAmount,
      note: `Venta mostrador (${saleCustomer.trim() || 'Cliente'}), pago: ${salePayment}`,
    })

    toast.success(`Venta registrada: -$${totalAmount.toLocaleString('es-AR')} (-${qty} un.)`)
    setIsSaleOpen(false)
    setSaleProduct('')
    setSaleQty(1)
    setSaleCustomer('')
  }

  return (
    <div className="sm">
      {/* Header matching Screenshot 3 */}
      <header className="sm__header">
        <div>
          <h1 className="sm__title">
            <FiArchive /> Control de Stock e Inventario
          </h1>
          <p className="sm__subtitle">
            Gestioná el inventario real en local, registrá salidas de mostrador y controlá alertas de reposición.
          </p>
        </div>

        <div className="sm__actions">
          <button className="btn-outline-white" onClick={() => setIsRestockOpen(true)}>
            <FiPlus /> Ingresar Stock
          </button>
          <button className="btn-black-primary" onClick={() => setIsSaleOpen(true)}>
            <FiShoppingBag /> Registrar Venta Mostrador
          </button>
        </div>
      </header>

      {/* 4 KPI Cards with Left Border Accent (Screenshot 3) */}
      <div className="sm__stats">
        <div className="sm__stat sm__stat--total">
          <span className="sm__stat-title">
            <FiPackage /> Total Productos
          </span>
          <span className="sm__stat-value">{totalProducts}</span>
        </div>

        <div className="sm__stat sm__stat--available">
          <span className="sm__stat-title">
            <FiHome /> Unidades Totales en Stock
          </span>
          <span className="sm__stat-value">
            {totalUnits} <small style={{ fontSize: '0.88rem', fontWeight: 600 }}>un.</small>
          </span>
        </div>

        <div className="sm__stat sm__stat--low">
          <span className="sm__stat-title">
            <FiAlertTriangle /> Stock Bajo / Por Reponer
          </span>
          <span className="sm__stat-value">{lowStockCount}</span>
        </div>

        <div className="sm__stat sm__stat--out">
          <span className="sm__stat-title">
            <FiX /> Sin Stock (Agotados)
          </span>
          <span className="sm__stat-value">{outOfStockCount}</span>
        </div>
      </div>

      {/* Stock Alert Banner */}
      {lowStockCount > 0 && (
        <div className="sm__alert-box">
          <div className="sm__alert-content">
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div>
              <p className="sm__alert-title">
                Atención: Hay {lowStockCount} prenda{lowStockCount > 1 ? 's' : ''} con stock crítico por agotarse.
              </p>
              <p className="sm__alert-desc">
                Revisá el listado y hacé reposición para no pausar las ventas en la tienda online.
              </p>
            </div>
          </div>
          <button
            className="btn-outline-white"
            style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            onClick={() => setStatusFilter(statusFilter === 'low' ? 'all' : 'low')}
          >
            {statusFilter === 'low' ? 'Mostrar Todos' : 'Ver productos con stock bajo'}
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="pm__toolbar">
        <div className="pm__search">
          <FiSearch className="pm__search-icon" />
          <input
            type="text"
            className="pm__search-input"
            placeholder="Buscar por nombre o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="pm__filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="available">🟢 Con Stock Disponible</option>
          <option value="low">🟡 Stock Bajo (Alerta)</option>
          <option value="out">🔴 Agotados</option>
        </select>

        <select
          className="pm__filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Table matching Screenshot 3 */}
      <div className="pm__table-wrap">
        <table className="pm__table">
          <thead>
            <tr>
              <th>Producto / Marca</th>
              <th>Categoría</th>
              <th>📦 Stock Disponible</th>
              <th>🔔 Alerta Mínima</th>
              <th>Estado</th>
              <th style={{ textAlign: 'center' }}>Ajuste Rápido</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const stock = Number(product.stock) || 0
              const isEditing = editingId === product.id

              return (
                <tr key={product.id}>
                  {/* Thumbnail and Title */}
                  <td>
                    <div className="pm__product-cell">
                      <img
                        src={product.images?.[0] || product.imageUrl || '/logo.png'}
                        alt={product.name}
                        className="pm__product-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = '/logo.png'
                        }}
                      />
                      <div>
                        <span className="pm__product-name">{product.name}</span>
                        <span className="pm__product-brand">
                          {product.brand || 'Azkaban Indumentaria'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 500 }}>
                      {product.category || 'Indumentaria'}
                    </span>
                  </td>

                  {/* Stock Quantity Cell (Click to inline edit) */}
                  <td>
                    {isEditing ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEditStockSubmit(product.id)}
                          autoFocus
                          min="0"
                          style={{
                            width: '64px',
                            height: '32px',
                            padding: '4px 8px',
                            border: '1px solid #0f172a',
                            borderRadius: '6px',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                          }}
                        />
                        <button
                          className="btn-icon-square"
                          onClick={() => handleEditStockSubmit(product.id)}
                          title="Guardar"
                        >
                          <FiCheck size={14} color="#16a34a" />
                        </button>
                        <button
                          className="btn-icon-square"
                          onClick={() => setEditingId(null)}
                          title="Cancelar"
                        >
                          <FiX size={14} color="#dc2626" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingId(product.id)
                          setEditValue(stock)
                        }}
                        title="Hacé clic para editar la cantidad directamente"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          background: stock > 2 ? '#dcfce7' : stock > 0 ? '#fef3c7' : '#fee2e2',
                          color: stock > 2 ? '#15803d' : stock > 0 ? '#b45309' : '#dc2626',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        📦 {stock} un.
                      </div>
                    )}
                  </td>

                  {/* Minimum alert */}
                  <td>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Mín: 3 un.
                    </span>
                  </td>

                  {/* Estado Badge */}
                  <td>
                    {stock > 2 && <span className="badge-status-active">🟢 En Stock</span>}
                    {stock > 0 && stock <= 2 && (
                      <span className="badge-status-offer" style={{ background: '#fef3c7', color: '#b45309' }}>
                        🟡 Stock Bajo
                      </span>
                    )}
                    {stock <= 0 && <span className="badge-status-paused">🔴 Agotado</span>}
                  </td>

                  {/* Action Steppers */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <button
                        className="btn-icon-square"
                        onClick={() => onAdjustStock(product.id, -1)}
                        disabled={stock <= 0}
                        title="Descontar 1 unidad"
                      >
                        <FiMinus size={12} />
                      </button>
                      <button
                        className="btn-icon-square"
                        onClick={() => onAdjustStock(product.id, 1)}
                        title="Agregar 1 unidad"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Restock Modal */}
      {isRestockOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsRestockOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>+ Ingresar Stock a Prenda</h3>
            <p>Seleccioná la prenda y la cantidad de unidades que ingresaron del taller o proveedor.</p>

            <form onSubmit={handleRestockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="pf__form-group">
                <label>Prenda a Reponer</label>
                <select
                  value={restockProduct}
                  onChange={(e) => setRestockProduct(e.target.value)}
                  required
                >
                  <option value="">Seleccionar prenda...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock actual: {p.stock || 0} un.)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pf__form-group">
                <label>Cantidad de Unidades a Sumar (+)</label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-outline-white" onClick={() => setIsRestockOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-black-primary">
                  Confirmar Ingreso de Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Counter Sale Modal */}
      {isSaleOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsSaleOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>🛒 Registrar Venta de Mostrador</h3>
            <p>Descontá el stock al instante y registrá la venta en el reporte de facturación.</p>

            <form onSubmit={handleSaleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="pf__form-group">
                <label>Prenda Vendida</label>
                <select
                  value={saleProduct}
                  onChange={(e) => setSaleProduct(e.target.value)}
                  required
                >
                  <option value="">Seleccionar prenda...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={(p.stock || 0) <= 0}>
                      {p.name} - Stock: {p.stock || 0} un. - ${Number(p.offerPrice || p.priceOffer || p.price || 0).toLocaleString('es-AR')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pf__form-group">
                <label>Cantidad Vendida</label>
                <input
                  type="number"
                  min="1"
                  value={saleQty}
                  onChange={(e) => setSaleQty(e.target.value)}
                  required
                />
              </div>

              <div className="pf__form-group">
                <label>Nombre del Cliente (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Martín Rodríguez"
                  value={saleCustomer}
                  onChange={(e) => setSaleCustomer(e.target.value)}
                />
              </div>

              <div className="pf__form-group">
                <label>Medio de Pago</label>
                <select
                  value={salePayment}
                  onChange={(e) => setSalePayment(e.target.value)}
                >
                  <option value="efectivo">Efectivo en Mostrador</option>
                  <option value="transferencia">Transferencia Bancaria / QR</option>
                  <option value="cuenta_dni">Cuenta DNI</option>
                  <option value="mercado_pago">Mercado Pago / Tarjeta</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-outline-white" onClick={() => setIsSaleOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-black-primary">
                  Registrar Salida &amp; Facturación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminStockTab
