import { useState } from 'react'
import {
  FiPlus,
  FiEdit2,
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

const AdminCategoriesTab = ({ categories = [], onSaveCategories, products = [] }) => {
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
    <div className="pm">
      {/* Header */}
      <div className="pm__header">
        <div>
          <h2 className="pm__title">Gestor de Categorías</h2>
          <p className="pm__subtitle">
            {categories.length} categorías configuradas en la tienda
          </p>
        </div>

        <div className="pm__header-actions">
          <button className="btn-outline-white" onClick={handleRestoreDefaults} title="Restaurar de fábrica">
            <FiRefreshCw /> Restaurar
          </button>
          <button className="btn-black-primary" onClick={handleOpenNew}>
            <FiPlus /> Nueva Categoría
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="pm__table-wrap">
        <table className="pm__table">
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>#</th>
              <th>Colección / Categoría</th>
              <th>Identificador (Slug)</th>
              <th style={{ textAlign: 'center' }}>Prendas</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => {
              const count = getProductCount(cat.slug || cat.id)
              const isTodos = cat.id === 'todos'

              return (
                <tr key={cat.id}>
                  <td style={{ textAlign: 'center', color: '#94a3b8', fontWeight: '700', fontSize: '0.8rem' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiFolder style={{ color: '#0f172a', flexShrink: 0 }} size={16} />
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                        {cat.name}
                      </strong>
                      {isTodos && (
                        <span className="badge-category-cyan" style={{ marginLeft: '6px' }}>
                          TODOS
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <code style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                      {cat.slug || cat.id}
                    </code>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        background: count > 0 ? '#f1f5f9' : '#fef2f2',
                        color: count > 0 ? '#0f172a' : '#dc2626',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      {count} {count === 1 ? 'prenda' : 'prendas'}
                    </span>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <span className={cat.active !== false ? 'badge-status-active' : 'badge-status-paused'}>
                      {cat.active !== false ? 'Activo' : 'Pausado'}
                    </span>
                  </td>

                  <td>
                    <div className="pm__actions" style={{ justifyContent: 'center' }}>
                      {!isTodos && (
                        <>
                          <button
                            className="btn-icon-square"
                            onClick={() => handleToggleActive(cat.id)}
                            title={cat.active !== false ? 'Pausar en catálogo' : 'Activar en catálogo'}
                          >
                            {cat.active !== false ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                          </button>
                          <button
                            className="btn-icon-square"
                            onClick={() => handleOpenEdit(cat)}
                            title="Editar categoría"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            className="btn-icon-square btn-icon-square--danger"
                            onClick={() => handleDelete(cat.id)}
                            title="Eliminar categoría"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Category Edit / Create Modal */}
      {isEditing && (
        <div className="admin-modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCat ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            <p>Ingresá los datos de la colección para organizarla en el catálogo.</p>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="pf__form-group">
                <label>Nombre de la Categoría *</label>
                <input
                  type="text"
                  placeholder="Ej: Conjuntos Rústicos"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="pf__form-group">
                <label>Identificador URL (Slug opcional)</label>
                <input
                  type="text"
                  placeholder="ej: conjuntos-rusticos"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="cat-active" style={{ fontSize: '0.86rem', color: '#0f172a', cursor: 'pointer' }}>
                  Categoría visible en la navegación y catálogo
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-outline-white" onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-black-primary">
                  {editingCat ? 'Guardar Cambios' : 'Crear Categoría'}
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
