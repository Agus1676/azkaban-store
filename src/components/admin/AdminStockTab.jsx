import { useState } from 'react'
import { FiBox, FiSearch, FiAlertTriangle, FiCheck, FiFilter } from 'react-icons/fi'
import { formatPrice } from '../../utils/formatPrice'

const AdminStockTab = ({ products, onSetStock, onAdjustStock }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [onlyCritical, setOnlyCritical] = useState(false)

  const filteredProducts = products.filter((p) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      if (!p.name?.toLowerCase().includes(q) && !p.brand?.toLowerCase().includes(q)) {
        return false
      }
    }
    if (onlyCritical && (Number(p.stock) || 0) > 2) {
      return false
    }
    return true
  })

  // Stock stats
  const totalUnits = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0)
  const outOfStockCount = products.filter((p) => (Number(p.stock) || 0) <= 0).length
  const lowStockCount = products.filter((p) => {
    const s = Number(p.stock) || 0
    return s > 0 && s <= 2
  }).length

  return (
    <div className="admin-content-card">
      {/* Header */}
      <div className="admin-content-card__header">
        <div>
          <h3>Control Rápido de Stock & Inventario</h3>
          <p>
            Revisá y reponé unidades físicas con un solo clic sin necesidad de abrir el formulario.
          </p>
        </div>
      </div>

      {/* Stock KPI strip */}
      <div className="stock-kpi-strip">
        <div className="stock-kpi-item">
          <span className="text-xs text-muted">Unidades Físicas Totales</span>
          <strong className="stock-kpi-number">{totalUnits} un.</strong>
        </div>
        <div className="stock-kpi-item">
          <span className="text-xs text-muted">Stock Saludable (&gt;2)</span>
          <strong className="stock-kpi-number text-green">
            {products.length - outOfStockCount - lowStockCount} prendas
          </strong>
        </div>
        <div className="stock-kpi-item">
          <span className="text-xs text-muted">Stock Bajo (1 a 2 un.)</span>
          <strong className="stock-kpi-number text-yellow">{lowStockCount} prendas</strong>
        </div>
        <div className="stock-kpi-item">
          <span className="text-xs text-muted">Agotadas (0 un.)</span>
          <strong className="stock-kpi-number text-red">{outOfStockCount} prendas</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar prenda para ajustar stock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <label className="critical-stock-toggle">
          <input
            type="checkbox"
            checked={onlyCritical}
            onChange={(e) => setOnlyCritical(e.target.checked)}
          />
          <FiAlertTriangle className="text-orange" size={15} />
          <span>Ver solo stock bajo o agotado (≤ 2 un.)</span>
        </label>
      </div>

      {/* Quick Stock Table */}
      <div className="admin-table-container">
        <table className="admin-table stock-quick-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Foto</th>
              <th>Prenda / Categoría</th>
              <th>Precio</th>
              <th>Talles</th>
              <th style={{ width: '130px', textAlign: 'center' }}>Estado</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Unidades</th>
              <th style={{ width: '220px', textAlign: 'right' }}>Reposición Rápida</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => {
              const stock = Number(prod.stock) || 0
              const isZero = stock <= 0
              const isLow = stock > 0 && stock <= 2

              return (
                <tr key={prod.id} className="table-row">
                  <td>
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="table-product-img"
                      onError={(e) => {
                        e.target.src = '/logo.jpg'
                      }}
                    />
                  </td>
                  <td>
                    <strong className="table-product-name">{prod.name}</strong>
                    <div className="text-xs text-muted">
                      {prod.brand || 'Azkaban'} • {prod.categoryName || prod.category}
                    </div>
                  </td>
                  <td>
                    <strong>{formatPrice(prod.priceOffer || prod.price)}</strong>
                  </td>
                  <td>
                    <div className="table-sizes-row">
                      {Array.isArray(prod.sizes) && prod.sizes.map((s) => (
                        <span key={s} className="table-size-pill">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {isZero ? (
                      <span className="stock-pill stock-pill--zero">Agotado</span>
                    ) : isLow ? (
                      <span className="stock-pill stock-pill--low">Bajo Stock</span>
                    ) : (
                      <span className="stock-pill stock-pill--ok">Disponible</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="stock-input-field-wrap">
                      <input
                        type="number"
                        min="0"
                        className="stock-direct-input"
                        value={stock}
                        onChange={(e) => onSetStock(prod.id, Math.max(0, Number(e.target.value) || 0))}
                      />
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="quick-reposition-btns">
                      <button
                        type="button"
                        className="btn-quick-stock"
                        onClick={() => onAdjustStock(prod.id, -1)}
                        disabled={stock <= 0}
                        title="Restar 1"
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        className="btn-quick-stock btn-quick-stock--add"
                        onClick={() => onAdjustStock(prod.id, +1)}
                        title="Sumar 1"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        className="btn-quick-stock btn-quick-stock--add"
                        onClick={() => onAdjustStock(prod.id, +5)}
                        title="Sumar 5"
                      >
                        +5
                      </button>
                      <button
                        type="button"
                        className="btn-quick-stock btn-quick-stock--add"
                        onClick={() => onAdjustStock(prod.id, +10)}
                        title="Sumar 10"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminStockTab
