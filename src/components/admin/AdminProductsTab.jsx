import { useState, useMemo } from 'react'
import {
  FiPlus,
  FiMinus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiTag,
  FiTrendingUp,
  FiDownload,
  FiUpload,
  FiRefreshCw,
} from 'react-icons/fi'
import { formatPrice } from '../../utils/formatPrice'

const AdminProductsTab = ({
  products = [],
  categories = [],
  onOpenNewProduct,
  onOpenEditProduct,
  onDeleteProduct,
  onToggleActive,
  onAdjustStock,
  onOpenBulkPrice,
  onExportBackup,
  onRestoreTreinta,
}) => {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const activeCount = products.filter((p) => p.active !== false).length

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase()
        const nameMatch = p.name?.toLowerCase().includes(q)
        const brandMatch = p.brand?.toLowerCase().includes(q)
        const descMatch = p.description?.toLowerCase().includes(q)
        if (!nameMatch && !brandMatch && !descMatch) return false
      }

      // Category filter
      if (filterCategory && filterCategory !== 'all') {
        if (p.category !== filterCategory && p.categoryId !== filterCategory) return false
      }

      // Status filter
      if (filterStatus === 'active' && p.active === false) return false
      if (filterStatus === 'paused' && p.active !== false) return false

      return true
    })
  }, [products, search, filterCategory, filterStatus])

  return (
    <div className="pm">
      {/* Header matching Jokers Screenshot 2 */}
      <div className="pm__header">
        <div>
          <h2 className="pm__title">Gestor de Prendas &amp; Catálogo</h2>
          <p className="pm__subtitle">
            {products.length} productos en catálogo ({activeCount} activos)
          </p>
        </div>

        <div className="pm__header-actions">
          <button className="btn-outline-white" onClick={onExportBackup} title="Descargar archivo JSON de respaldo">
            <FiDownload /> Backup JSON
          </button>
          <button className="btn-outline-white" onClick={onRestoreTreinta} title="Recargar las prendas oficiales de Treinta">
            <FiRefreshCw /> Recargar Treinta
          </button>
          <button className="btn-outline-white" onClick={onOpenBulkPrice} title="Ajuste masivo de precios por porcentaje">
            <FiTrendingUp /> Aumento Masivo (%)
          </button>
          <button className="btn-black-primary" onClick={onOpenNewProduct}>
            <FiPlus /> Cargar Nueva Prenda
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="pm__toolbar">
        <div className="pm__search">
          <FiSearch className="pm__search-icon" />
          <input
            type="text"
            className="pm__search-input"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="pm__filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Todas las Categorías</option>
          {categories.map((c) => (
            <option key={c.id || c.name} value={c.id || c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="pm__filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos los Estados</option>
          <option value="active">Solo Activos</option>
          <option value="paused">Solo Pausados</option>
        </select>
      </div>

      {/* Table matching Screenshot 2 */}
      <div className="pm__table-wrap">
        <table className="pm__table">
          <thead>
            <tr>
              <th>Producto / Marca</th>
              <th>Categoría</th>
              <th>Precio al Público</th>
              <th>Stock Total</th>
              <th>Estado / Oferta</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const stock = Number(product.stock) || 0
                const isOffer = Boolean(product.offerPrice || product.onSale)
                const finalPrice = product.offerPrice || product.priceOffer || product.price

                return (
                  <tr key={product.id}>
                    {/* Product Cell */}
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

                    {/* Category Pill (Cyan #e0f2fe, text #0284c7) */}
                    <td>
                      <span className="badge-category-cyan">
                        {product.category || 'Indumentaria'}
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      {isOffer && product.price ? (
                        <div>
                          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                            {formatPrice(finalPrice)}
                          </span>
                          <br />
                          <span style={{ fontSize: '0.74rem', textDecoration: 'line-through', color: '#94a3b8' }}>
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                          {formatPrice(finalPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock Stepper */}
                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          className="btn-icon-square"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => onAdjustStock(product.id, -1)}
                          disabled={stock <= 0}
                          title="Descontar 1 unidad"
                        >
                          <FiMinus size={11} />
                        </button>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '58px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            background: stock > 2 ? '#dcfce7' : stock > 0 ? '#fef3c7' : '#fee2e2',
                            color: stock > 2 ? '#15803d' : stock > 0 ? '#b45309' : '#dc2626',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                          }}
                        >
                          {stock} un.
                        </span>

                        <button
                          className="btn-icon-square"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => onAdjustStock(product.id, 1)}
                          title="Sumar 1 unidad"
                        >
                          <FiPlus size={11} />
                        </button>
                      </div>
                    </td>

                    {/* Status / Offer Badges */}
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span className={product.active !== false ? 'badge-status-active' : 'badge-status-paused'}>
                          {product.active !== false ? 'Activo' : 'Pausado'}
                        </span>
                        {isOffer && (
                          <span className="badge-status-offer">
                            <FiTag size={10} /> OFERTA
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="pm__actions" style={{ justifyContent: 'center' }}>
                        <button
                          className="btn-icon-square"
                          onClick={() => onToggleActive(product.id)}
                          title={product.active !== false ? 'Pausar producto' : 'Activar producto'}
                        >
                          {product.active !== false ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                        </button>
                        <button
                          className="btn-icon-square"
                          onClick={() => onOpenEditProduct(product)}
                          title="Editar producto"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          className="btn-icon-square btn-icon-square--danger"
                          onClick={() => onDeleteProduct(product.id)}
                          title="Eliminar producto"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No se encontraron productos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProductsTab
