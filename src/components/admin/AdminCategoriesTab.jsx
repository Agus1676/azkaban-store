import { useState } from 'react'
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiTag,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiFolder,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { DEFAULT_CATEGORIES } from '../../data/categories'

const AdminCategoriesTab = ({ categories, onSaveCategories, products }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    active: true,
  })

  // Contar prendas por categoría
  const getProductCount = (slug) => {
    if (slug === 'todos') return products.length
    return products.filter((p) => {
      const cat = (p.category || '').toLowerCase()
      const catName = (p.categoryName || '').toLowerCase()
      const target = slug.toLowerCase()
      return (
        cat === target ||
        catName.includes(target) ||
        (target === 'bermudas' && cat.includes('bermuda')) ||
        (target === 'buzos' && cat.includes('buzo'))
      )
    }).length
  }

  const handleOpenNew = () => {
    setEditingCat(null)
    setFormData({
      name: '',
      slug: '',
      active: true,
    })
    setIsEditing(true)
  }

  const handleOpenEdit = (cat) => {
    setEditingCat(cat)
    setFormData({
      name: cat.name,
      slug: cat.slug || cat.id,
      active: cat.active !== false,
    })
    setIsEditing(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const trimmedName = formData.name.trim()
    if (!trimmedName) {
      toast.error('El nombre de la categoría es requerido')
      return
    }

    const generatedSlug =
      formData.slug.trim().toLowerCase().replace(/\s+/g, '-') ||
      trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '-')

    if (editingCat) {
      // Editar existente
      const updated = categories.map((c) =>
        c.id === editingCat.id
          ? {
              ...c,
              name: trimmedName,
              slug: generatedSlug,
              active: formData.active,
            }
          : c
      )
      onSaveCategories(updated)
      toast.success(`Categoría "${trimmedName}" actualizada`)
    } else {
      // Crear nueva
      const newCat = {
        id: generatedSlug,
        slug: generatedSlug,
        name: trimmedName,
        active: formData.active,
      }
      onSaveCategories([...categories, newCat])
      toast.success(`Categoría "${trimmedName}" creada con éxito`)
    }

    setIsEditing(false)
  }

  const handleDelete = (catId) => {
    if (catId === 'todos') {
      toast.error('No se puede eliminar la categoría principal')
      return
    }

    const count = getProductCount(catId)
    if (count > 0) {
      if (
        !window.confirm(
          `Esta categoría tiene ${count} prendas asociadas. ¿Estás seguro de que deseás eliminarla?`
        )
      ) {
        return
      }
    } else {
      if (!window.confirm('¿Deseás eliminar esta categoría?')) return
    }

    const updated = categories.filter((c) => c.id !== catId)
    onSaveCategories(updated)
    toast.success('Categoría eliminada')
  }

  const handleToggleActive = (catId) => {
    if (catId === 'todos') return
    const updated = categories.map((c) =>
      c.id === catId ? { ...c, active: c.active === false } : c
    )
    onSaveCategories(updated)
  }

  const handleRestoreDefaults = () => {
    if (window.confirm('¿Restaurar las categorías iniciales por defecto?')) {
      onSaveCategories(DEFAULT_CATEGORIES)
      toast.success('Categorías por defecto restauradas')
    }
  }

  return (
    <div className="admin-content-card">
      {/* Header */}
      <div className="admin-content-card__header">
        <div>
          <h3>Gestión de Categorías ({categories.length})</h3>
          <p>
            Creá, renombrá y organizá las colecciones de indumentaria. Se sincronizan en vivo en el catálogo y menú.
          </p>
        </div>
        <div className="header-buttons">
          <button className="btn-secondary" onClick={handleRestoreDefaults} title="Restaurar de fábrica">
            <FiRefreshCw size={15} />
            <span>Restaurar</span>
          </button>
          <button className="btn-primary" onClick={handleOpenNew}>
            <FiPlus size={16} />
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      {/* Categories Grid / Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>#</th>
              <th>Colección / Categoría</th>
              <th>Identificador (Slug URL)</th>
              <th style={{ width: '130px', textAlign: 'center' }}>Prendas en Stock</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Estado</th>
              <th style={{ width: '110px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => {
              const count = getProductCount(cat.slug || cat.id)
              const isTodos = cat.id === 'todos'

              return (
                <tr
                  key={cat.id}
                  className={`table-row ${cat.active === false ? 'row-inactive' : ''}`}
                >
                  <td style={{ textAlign: 'center', color: '#94a3b8', fontWeight: '700', fontSize: '0.8rem' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiFolder style={{ color: '#ff5500', flexShrink: 0 }} size={16} />
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                        {cat.name}
                      </strong>
                      {isTodos && (
                        <span className="table-badge" style={{ marginLeft: '6px' }}>
                          TODOS
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <code style={{ fontSize: '0.8rem', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontFamily: 'monospace' }}>
                      {cat.slug || cat.id}
                    </code>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge-count-pill">
                      {count} {count === 1 ? 'prenda' : 'prendas'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {!isTodos ? (
                      <button
                        type="button"
                        className={`btn-table-icon ${cat.active !== false ? 'btn-icon-active' : 'btn-icon-inactive'}`}
                        onClick={() => handleToggleActive(cat.id)}
                        title={cat.active !== false ? 'Ocultar categoría' : 'Mostrar categoría'}
                      >
                        {cat.active !== false ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Fija</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions-row" style={{ justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn-table-icon"
                        onClick={() => handleOpenEdit(cat)}
                        title="Editar categoría"
                      >
                        <FiEdit size={15} />
                      </button>
                      {!isTodos && (
                        <button
                          type="button"
                          className="btn-table-icon btn-icon-danger"
                          onClick={() => handleDelete(cat.id)}
                          title="Eliminar categoría"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva / Editar Categoría */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="admin-product-modal" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-header__title">
                <FiTag className="text-orange" size={20} />
                <h3>{editingCat ? 'Editar Categoría' : 'Nueva Categoría de Indumentaria'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsEditing(false)}>
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-product-form" style={{ padding: '24px' }}>
              <div className="form-group">
                <label>Nombre de la Categoría *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Buzos & Hoodies, Camperas, Bermudas..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Identificador URL (Slug opcional)</label>
                <input
                  type="text"
                  placeholder="ej: buzos-hoodies"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                <span className="field-hint">
                  Dirección web: /catalogo?category={formData.slug || 'nombre'}
                </span>
              </div>

              <label className="switch-row" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>Categoría Activa</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Visible en el menú desplegable y filtros</span>
                </div>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
              </label>

              <div className="admin-modal-actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  <FiCheck size={16} />
                  <span>{editingCat ? 'Guardar Cambios' : 'Crear Categoría'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategoriesTab
