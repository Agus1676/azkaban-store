import { useState, useMemo } from 'react'
import {
  FiPlus,
  FiSearch,
  FiTrendingUp,
  FiRefreshCw,
  FiEdit,
  FiCopy,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiStar,
  FiFilter,
  FiVideo,
} from 'react-icons/fi'
import { CATEGORIES } from '../../data/seedProducts'
import { formatPrice } from '../../utils/formatPrice'

const AdminProductsTab = ({
  products,
  onOpenNewProduct,
  onOpenEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  onToggleActive,
  onToggleFeatured,
  onAdjustStock,
  onOpenBulkPrice,
  onRestoreTreinta,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [selectedStockFilter, setSelectedStockFilter] = useState('all') // 'all' | 'in_stock' | 'out_of_stock'
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all') // 'all' | 'active' | 'inactive'
  const [sortBy, setSortBy] = useState('newest') // 'newest' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc' | 'name'

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase()
          const nameMatch = p.name?.toLowerCase().includes(q)
          const brandMatch = p.brand?.toLowerCase().includes(q)
          const descMatch = p.description?.toLowerCase().includes(q)
          if (!nameMatch && !brandMatch && !descMatch) return false
        }
        // Category
        if (selectedCategory !== 'todos' && p.category !== selectedCategory) {
          return false
        }
        // Stock
        if (selectedStockFilter === 'in_stock' && (Number(p.stock) || 0) <= 0) return false
        if (selectedStockFilter === 'out_of_stock' && (Number(p.stock) || 0) > 0) return false
        // Status
        if (selectedStatusFilter === 'active' && p.active === false) return false
        if (selectedStatusFilter === 'inactive' && p.active !== false) return false

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return (a.priceOffer || a.price || 0) - (b.priceOffer || b.price || 0)
        }
        if (sortBy === 'price_desc') {
          return (b.priceOffer || b.price || 0) - (a.priceOffer || a.price || 0)
        }
        if (sortBy === 'stock_asc') {
          return (Number(a.stock) || 0) - (Number(b.stock) || 0)
        }
        if (sortBy === 'stock_desc') {
          return (Number(b.stock) || 0) - (Number(a.stock) || 0)
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name)
        }
        return 0 // newest (default array order)
      })
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedStockFilter,
    selectedStatusFilter,
    sortBy,
  ])

  return (
    <div className="admin-content-card">
      {/* Header */}
      <div className="admin-content-card__header">
        <div>
          <h3>Catálogo de Indumentaria ({products.length} prendas)</h3>
          <p>
            Administrá prendas, precios, talles, fotografías y disponibilidad del stock.
          </p>
        </div>
        <div className="header-buttons">
          <button className="btn-secondary" onClick={onOpenBulkPrice} title="Ajuste masivo de precios">
            <FiTrendingUp size={16} />
            <span>Ajuste Masivo (%)</span>
          </button>
          <button className="btn-secondary" onClick={onRestoreTreinta} title="Restaurar prendas de Treinta">
            <FiRefreshCw size={16} />
            <span>Recargar Treinta</span>
          </button>
          <button className="btn-primary" onClick={onOpenNewProduct}>
            <FiPlus size={16} />
            <span>Nueva Prenda</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        {/* Search */}
        <div className="admin-search-wrap">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>

        {/* Category selector */}
        <div className="filter-select-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <div className="filter-select-wrap">
          <select
            value={selectedStockFilter}
            onChange={(e) => setSelectedStockFilter(e.target.value)}
          >
            <option value="all">Todo el stock</option>
            <option value="in_stock">Con stock disponible</option>
            <option value="out_of_stock">Agotados (0 un.)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-select-wrap">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Solo Activos</option>
            <option value="inactive">Solo Pausados</option>
          </select>
        </div>

        {/* Sort selector */}
        <div className="filter-select-wrap">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Más recientes</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
            <option value="stock_asc">Menor stock primero</option>
            <option value="stock_desc">Mayor stock primero</option>
            <option value="name">Nombre: A - Z</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-container">
        {filteredProducts.length === 0 ? (
          <div className="admin-empty-table">
            <FiFilter size={36} className="text-muted" />
            <h4>No se encontraron prendas con los filtros aplicados</h4>
            <p>Probá cambiando los términos de búsqueda o los filtros seleccionados.</p>
            <button
              className="btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('todos')
                setSelectedStockFilter('all')
                setSelectedStatusFilter('all')
              }}
            >
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Foto</th>
                <th>Nombre / Marca</th>
                <th>Categoría</th>
                <th>Precio Actual</th>
                <th>Talles</th>
                <th style={{ width: '130px' }}>Stock</th>
                <th style={{ width: '70px', textAlign: 'center' }}>Home ⭐</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Visible</th>
                <th style={{ width: '140px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => {
                const stockNum = Number(prod.stock) || 0
                const isOutOfStock = stockNum <= 0

                return (
                  <tr
                    key={prod.id}
                    className={`table-row ${prod.active === false ? 'row-inactive' : ''}`}
                  >
                    {/* Thumbnail */}
                    <td>
                      <div className="table-thumb-wrap">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="table-product-img"
                          onError={(e) => {
                            e.target.src = '/logo.jpg'
                          }}
                        />
                      </div>
                    </td>

                    {/* Name & Brand */}
                    <td>
                      <div className="table-name-col">
                        <strong className="table-product-name">{prod.name}</strong>
                        <div className="table-meta-row">
                          <span className="table-product-brand">
                            {prod.brand || 'Azkaban'}
                          </span>
                          {prod.badge && (
                            <span className="table-badge">{prod.badge}</span>
                          )}
                          {prod.videoUrl && (
                            <span
                              className="table-badge"
                              style={{
                                background: 'rgba(255, 85, 0, 0.15)',
                                color: '#ff5500',
                                borderColor: 'rgba(255, 85, 0, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}
                              title="Prenda con video interactivo"
                            >
                              <FiVideo size={11} style={{ marginRight: 4 }} /> Video
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="table-category-tag">
                        {prod.categoryName || prod.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      <div className="table-price-col">
                        <strong className="table-price">
                          {formatPrice(prod.priceOffer || prod.price)}
                        </strong>
                        {prod.priceOffer && (
                          <span className="table-price-old">
                            {formatPrice(prod.price)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Sizes */}
                    <td>
                      <div className="table-sizes-row">
                        {Array.isArray(prod.sizes) && prod.sizes.length > 0 ? (
                          prod.sizes.map((s) => (
                            <span key={s} className="table-size-pill">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="table-size-pill">Único</span>
                        )}
                      </div>
                    </td>

                    {/* Stock stepper */}
                    <td>
                      <div className="table-stock-stepper">
                        <button
                          type="button"
                          className="stock-step-btn"
                          onClick={() => onAdjustStock(prod.id, -1)}
                          disabled={stockNum <= 0}
                          title="Restar 1"
                        >
                          -
                        </button>
                        <span
                          className={`stock-count-badge ${
                            isOutOfStock
                              ? 'stock-badge--zero'
                              : stockNum <= 2
                              ? 'stock-badge--low'
                              : ''
                          }`}
                        >
                          {stockNum} un.
                        </span>
                        <button
                          type="button"
                          className="stock-step-btn"
                          onClick={() => onAdjustStock(prod.id, +1)}
                          title="Sumar 1"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Featured toggle */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className={`star-toggle-btn ${prod.featured ? 'active' : ''}`}
                        onClick={() => onToggleFeatured(prod.id)}
                        title={prod.featured ? 'Quitar de destacados' : 'Destacar en Home'}
                      >
                        <FiStar size={17} />
                      </button>
                    </td>

                    {/* Active toggle */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className={`visibility-toggle-btn ${
                          prod.active !== false ? 'active' : 'inactive'
                        }`}
                        onClick={() => onToggleActive(prod.id)}
                        title={
                          prod.active !== false ? 'Pausar prenda' : 'Activar prenda'
                        }
                      >
                        {prod.active !== false ? <FiEye size={17} /> : <FiEyeOff size={17} />}
                      </button>
                    </td>

                    {/* Actions: Edit, Duplicate, Delete */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions-group">
                        <button
                          type="button"
                          className="table-action-btn"
                          onClick={() => onOpenEditProduct(prod)}
                          title="Editar prenda"
                        >
                          <FiEdit size={15} />
                        </button>
                        <button
                          type="button"
                          className="table-action-btn"
                          onClick={() => onDuplicateProduct(prod)}
                          title="Duplicar prenda"
                        >
                          <FiCopy size={15} />
                        </button>
                        <button
                          type="button"
                          className="table-action-btn table-action-btn--delete"
                          onClick={() => onDeleteProduct(prod.id)}
                          title="Eliminar prenda"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Footer info */}
      <div className="admin-table-footer">
        <span>
          Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> prendas
        </span>
        <span className="text-xs text-muted">
          Los cambios se guardan y reflejan instantáneamente en toda la tienda.
        </span>
      </div>
    </div>
  )
}

export default AdminProductsTab
