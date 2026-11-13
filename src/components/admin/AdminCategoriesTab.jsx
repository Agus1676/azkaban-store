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

const EMOJI_OPTIONS = ['🧥', '🩳', '👕', '⚽', '🏃', '👖', '🔥', '🧢', '👟', '🎒', '⚡', '⭐']

const AdminCategoriesTab = ({ categories, onSaveCategories, products }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    emoji: '👕',
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
      emoji: '👕',
      active: true,
    })
    setIsEditing(true)
  }

  const handleOpenEdit = (cat) => {
    setEditingCat(cat)
    setFormData({
      name: cat.name,
      slug: cat.slug || cat.id,
      emoji: cat.emoji || '👕',
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
              emoji: formData.emoji,
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
        emoji: formData.emoji,
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
            Creá, renombrá y organizá las categorías de indumentaria. Se reflejan al instante en el menú desplegable y en el catálogo.
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
              <th style={{ width: '60px' }}>Icono</th>
              <th>Nombre de la Categoría</th>
              <th>Identificador (Slug)</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Prendas</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Visible</th>
              <th style={{ width: '140px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const count = getProductCount(cat.slug || cat.id)
              const isTodos = cat.id === 'todos'

              return (
                <tr
                  key={cat.id}
                  className={`table-row ${cat.active === false ? 'row-inactive' : ''}`}
                >
                  <td style={{ fontSize: '1.4rem', textAlign: 'center' }}>
                    {cat.emoji || '👕'}
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                      {cat.name}
                    </strong>
                    {isTodos && (
                      <span className="table-badge" style={{ marginLeft: '8px' }}>
                        PRINCIPAL
                      </span>
                    )}
                  </td>
                  <td>
                    <code style={{ fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
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
                        {cat.active !== false ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                      </button>
                    ) : (
                      <span className="text-xs text-muted">Fija</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions-row" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn-table-icon"
                        onClick={() => handleOpenEdit(cat)}
                        title="Editar categoría"
                      >
                        <FiEdit size={16} />
                      </button>
                      {!isTodos && (
                        <button
                          type="button"
                          className="btn-table-icon btn-icon-danger"
                          onClick={() => handleDelete(cat.id)}
                          title="Eliminar categoría"
                        >
                          <FiTrash2 size={16} />
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
          <div className="admin-product-modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-header__title">
                <FiTag className="text-orange" size={20} />
                <h3>{editingCat ? 'Editar Categoría' : 'Nueva Categoría de Indumentaria'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsEditing(false)}>
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-product-form" style={{ padding: '20px' }}>
              <div className="form-group">
                <label>Nombre de la Categoría *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Buzos & Hoodies, Camperas Puffer, Gorras..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Emoji / Icono representativo</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji: em })}
                      style={{
                        fontSize: '1.2rem',
                        padding: '6px 10px',
                        border: formData.emoji === em ? '1.5px solid #ff5500' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        background: formData.emoji === em ? 'rgba(255, 85, 0, 0.2)' : '#181924',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Identificador de URL (Slug opcional)</label>
                <input
                  type="text"
                  placeholder="ej: camperas-puffer"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                <span className="text-xs text-muted" style={{ marginTop: '4px', display: 'block' }}>
                  Aparece en la dirección web: /catalogo?category={formData.slug || 'nombre'}
                </span>
              </div>

              <label className="switch-row" style={{ marginTop: '12px' }}>
                <div>
                  <strong>Categoría Activa</strong>
                  <span className="text-xs text-muted">Visible en el menú desplegable y filtros</span>
                </div>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
              </label>

              <div className="admin-modal-actions" style={{ marginTop: '20px' }}>
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
