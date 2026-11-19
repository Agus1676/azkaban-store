import { FiPackage, FiEye, FiAlertTriangle, FiXCircle, FiPlus, FiTrendingUp, FiArchive, FiDownload } from 'react-icons/fi'

const AdminDashboardTab = ({
  products = [],
  orders = [],
  onNavigateTab,
  onOpenNewProduct,
  onOpenBulkPrice,
  onExportBackup,
}) => {
  const activeProducts = products.filter((p) => p.active !== false)
  const lowStockProducts = products.filter((p) => {
    const qty = Number(p.stock) || 0
    return qty > 0 && qty <= 2
  })
  const outOfStockProducts = products.filter((p) => (Number(p.stock) || 0) <= 0)

  const stats = [
    { icon: <FiPackage />, label: 'Total Productos', value: products.length, color: 'accent' },
    { icon: <FiEye />, label: 'Activos', value: activeProducts.length, color: 'success' },
    { icon: <FiAlertTriangle />, label: 'Stock Bajo', value: lowStockProducts.length, color: 'warning' },
    { icon: <FiXCircle />, label: 'Agotados', value: outOfStockProducts.length, color: 'danger' },
  ]

  return (
    <div className="dashboard">
      <h2 className="dashboard__title">Dashboard</h2>
      <p className="dashboard__subtitle">Resumen general del catálogo e inventario</p>

      {/* 4 Stat Cards matching Jokers Screenshot 1 */}
      <div className="dashboard__stats">
        {stats.map((stat, i) => (
          <div key={i} className={`dashboard__stat dashboard__stat--${stat.color}`}>
            <div className="dashboard__stat-icon">{stat.icon}</div>
            <div>
              <span className="dashboard__stat-value">{stat.value}</span>
              <span className="dashboard__stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Alerts section */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="dashboard__section">
          <h3>⚠️ Alertas de Inventario</h3>
          <div className="dashboard__list">
            {outOfStockProducts.map((p) => (
              <div key={p.id} className="dashboard__list-item" style={{ borderLeft: '4px solid #ef4444' }}>
                <img
                  src={p.images?.[0] || p.imageUrl || '/logo.png'}
                  alt={p.name}
                  className="dashboard__list-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = '/logo.png'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.category || 'Indumentaria'}</div>
                </div>
                <span className="badge-status-paused" style={{ background: '#fee2e2', color: '#dc2626' }}>
                  Agotado (0 un.)
                </span>
                <button
                  className="btn-outline-white"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  onClick={() => onNavigateTab('stock')}
                >
                  Reponer
                </button>
              </div>
            ))}

            {lowStockProducts.map((p) => (
              <div key={p.id} className="dashboard__list-item" style={{ borderLeft: '4px solid #f59e0b' }}>
                <img
                  src={p.images?.[0] || p.imageUrl || '/logo.png'}
                  alt={p.name}
                  className="dashboard__list-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = '/logo.png'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.category || 'Indumentaria'}</div>
                </div>
                <span className="badge-status-offer" style={{ background: '#fef3c7', color: '#b45309' }}>
                  Quedan {p.stock} un.
                </span>
                <button
                  className="btn-outline-white"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  onClick={() => onNavigateTab('stock')}
                >
                  Ajustar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Operative Actions */}
      <div className="dashboard__section">
        <h3>⚡ Acciones Operativas Rápidas</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          <button className="btn-black-primary" onClick={onOpenNewProduct}>
            <FiPlus size={16} /> Cargar Nueva Prenda
          </button>
          <button className="btn-outline-white" onClick={onOpenBulkPrice}>
            <FiTrendingUp size={16} /> Aumento Masivo de Precios (%)
          </button>
          <button className="btn-outline-white" onClick={() => onNavigateTab('stock')}>
            <FiArchive size={16} /> Control Rápido de Stock
          </button>
          <button className="btn-outline-white" onClick={onExportBackup}>
            <FiDownload size={16} /> Descargar Copia JSON
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardTab
