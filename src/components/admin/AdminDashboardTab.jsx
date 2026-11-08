import { FiDollarSign, FiShoppingBag, FiBox, FiAlertTriangle, FiPlus, FiTrendingUp, FiDownload, FiExternalLink, FiClock, FiTruck, FiCheckCircle } from 'react-icons/fi'
import { formatPrice } from '../../utils/formatPrice'

const AdminDashboardTab = ({
  products,
  orders,
  onNavigateTab,
  onOpenNewProduct,
  onOpenBulkPrice,
  onExportBackup,
}) => {
  // Calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelado')
    .reduce((sum, o) => sum + (o.total || 0), 0)

  const pendingOrders = orders.filter(
    (o) => o.status === 'Pendiente' || o.status === 'Pago Confirmado' || o.status === 'En preparación'
  )

  const dispatchedOrders = orders.filter(
    (o) => o.status?.includes('Despachado') || o.status?.includes('Listo')
  )

  const totalStockUnits = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0)
  const activeProducts = products.filter((p) => p.active !== false)
  const lowStockProducts = products.filter((p) => (Number(p.stock) || 0) <= 2 && p.active !== false)
  const outOfStockProducts = products.filter((p) => (Number(p.stock) || 0) <= 0 && p.active !== false)

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="admin-dashboard-view">
      {/* KPI Stats Grid */}
      <div className="dashboard-kpis">
        <div className="kpi-card kpi-card--primary">
          <div className="kpi-icon">
            <FiDollarSign size={24} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Ventas Registradas</span>
            <span className="kpi-value">{formatPrice(totalRevenue)}</span>
            <span className="kpi-sub">
              {orders.length} {orders.length === 1 ? 'pedido total' : 'pedidos totales'}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--orders">
            <FiShoppingBag size={24} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Pedidos Por Despachar</span>
            <span className="kpi-value">{pendingOrders.length}</span>
            <span className="kpi-sub">
              {dispatchedOrders.length} en camino / listos
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--box">
            <FiBox size={24} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Prendas en Catálogo</span>
            <span className="kpi-value">{activeProducts.length}</span>
            <span className="kpi-sub">
              {totalStockUnits} unidades físicas en stock
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-card--alert">
          <div className="kpi-icon kpi-icon--alert">
            <FiAlertTriangle size={24} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Stock Crítico (≤ 2 un.)</span>
            <span className="kpi-value">{lowStockProducts.length}</span>
            <span className="kpi-sub">
              {outOfStockProducts.length} prendas agotadas
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="dashboard-quick-actions">
        <h4 className="quick-actions-title">Acciones Operativas Rápidas</h4>
        <div className="quick-actions-btns">
          <button className="btn-primary" onClick={onOpenNewProduct}>
            <FiPlus size={16} />
            <span>Nueva Prenda</span>
          </button>
          <button className="btn-secondary" onClick={onOpenBulkPrice}>
            <FiTrendingUp size={16} />
            <span>Aumento Masivo de Precios (%)</span>
          </button>
          <button className="btn-secondary" onClick={() => onNavigateTab('stock')}>
            <FiBox size={16} />
            <span>Control Rápido de Stock</span>
          </button>
          <button className="btn-secondary" onClick={onExportBackup}>
            <FiDownload size={16} />
            <span>Descargar Copia JSON</span>
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-secondary btn-store-link">
            <FiExternalLink size={16} />
            <span>Ver Tienda Online</span>
          </a>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Stock Alerts */}
      <div className="dashboard-columns-grid">
        {/* Left: Recent Orders */}
        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h4>Últimos Pedidos Recibidos</h4>
              <p>Seguimiento de compras y envíos por WhatsApp</p>
            </div>
            <button
              className="dashboard-panel__link-btn"
              onClick={() => onNavigateTab('orders')}
            >
              Ver todos ({orders.length}) →
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="dashboard-empty-box">
              <FiClock size={32} className="text-muted" />
              <p>Todavía no hay pedidos registrados.</p>
              <span className="text-xs text-muted">
                Los pedidos generados por los clientes en el carrito se registrarán automáticamente acá.
              </span>
            </div>
          ) : (
            <div className="dashboard-orders-list">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="dashboard-order-row">
                  <div className="order-row-main">
                    <div className="order-id-badge">#{ord.id}</div>
                    <div className="order-customer-info">
                      <strong>{ord.customer?.name || 'Cliente sin nombre'}</strong>
                      <span className="order-row-sub">
                        {ord.items?.length || 0} prendas • {ord.shippingMethod}
                      </span>
                    </div>
                  </div>
                  <div className="order-row-status-col">
                    <span className={`status-pill status-pill--${getStatusColor(ord.status)}`}>
                      {ord.status || 'Pendiente'}
                    </span>
                    <strong className="order-row-price">{formatPrice(ord.total || 0)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Low Stock Alerts */}
        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h4>Alertas de Reposición</h4>
              <p>Prendas con stock agotado o menor a 3 unidades</p>
            </div>
            <button
              className="dashboard-panel__link-btn"
              onClick={() => onNavigateTab('stock')}
            >
              Gestionar Stock →
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="dashboard-empty-box">
              <FiCheckCircle size={32} className="text-green" />
              <p>¡Inventario al día! Todas las prendas cuentan con stock suficiente.</p>
            </div>
          ) : (
            <div className="dashboard-stock-alerts-list">
              {lowStockProducts.slice(0, 6).map((prod) => (
                <div key={prod.id} className="dashboard-stock-item">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="stock-item-thumb"
                    onError={(e) => {
                      e.target.src = '/logo.jpg'
                    }}
                  />
                  <div className="stock-item-info">
                    <strong>{prod.name}</strong>
                    <span className="text-xs text-muted">
                      {prod.brand || 'Azkaban'} • {prod.categoryName || prod.category}
                    </span>
                  </div>
                  <div className="stock-item-badge">
                    {Number(prod.stock) === 0 ? (
                      <span className="stock-pill stock-pill--zero">Agotado</span>
                    ) : (
                      <span className="stock-pill stock-pill--low">{prod.stock} un.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status) {
  if (!status) return 'pending'
  const s = status.toLowerCase()
  if (s.includes('entregado')) return 'completed'
  if (s.includes('despachado') || s.includes('listo')) return 'shipping'
  if (s.includes('confirmado') || s.includes('preparación')) return 'active'
  if (s.includes('cancelado')) return 'cancelled'
  return 'pending'
}

export default AdminDashboardTab
