import { useState, useEffect } from 'react'
import { FiX, FiCheck, FiImage, FiTag, FiEye, FiVideo, FiPlayCircle } from 'react-icons/fi'
import { CATEGORIES } from '../../data/seedProducts'
import { formatPrice } from '../../utils/formatPrice'
import { parseVideoUrl } from '../../utils/video'

const PRESET_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'ÚNICO']
const PRESET_BADGES = [
  'NUEVO',
  'HOT DROP',
  'TOP VENTAS',
  'OFERTA',
  'SEMI FRIZA',
  '100% ALGODÓN',
  'CALIDAD AAA',
  'EDICIÓN 2026',
]

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Buzo BMW', url: 'https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/15ffd48e-5c68-5587-abc7-3799a6224d1c.jpeg' },
  { label: 'Buzo Jordan', url: 'https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/770125ad-51c9-5266-a213-a1c3fc6bd468.jpeg' },
  { label: 'Bermuda BMW', url: 'https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/0889407e-03b0-53f3-9af0-01523b5c12de.jpeg' },
  { label: 'Hoodie Negro', url: 'https://cdn.treinta.co/web-app/inventory/d10954fe-e7d4-5aa5-986b-d1211ef07d28/6c5fcc88-8047-5596-9bc2-270de9b2a0e8.jpeg' },
]

const AdminProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    category: 'buzos',
    categoryName: 'Buzos & Hoodies',
    price: 35000,
    priceOffer: '',
    stock: 5,
    active: true,
    featured: false,
    badge: 'NUEVO',
    description: '',
    sizes: ['S', 'M', 'L', 'XL'],
    imageUrl: '',
    videoUrl: '',
    brand: 'Azkaban',
  })

  const [customSizeInput, setCustomSizeInput] = useState('')

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        category: product.category || 'buzos',
        categoryName: product.categoryName || 'Buzos & Hoodies',
        price: product.price || 0,
        priceOffer: product.priceOffer || '',
        stock: typeof product.stock === 'number' ? product.stock : 1,
        active: product.active !== false,
        featured: !!product.featured,
        badge: product.badge || '',
        description: product.description || '',
        sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : ['ÚNICO'],
        imageUrl: product.imageUrl || '',
        videoUrl: product.videoUrl || '',
        brand: product.brand || 'Azkaban',
      })
    } else {
      setForm({
        name: '',
        category: 'buzos',
        categoryName: 'Buzos & Hoodies',
        price: 35000,
        priceOffer: '',
        stock: 5,
        active: true,
        featured: false,
        badge: 'NUEVO',
        description: '',
        sizes: ['S', 'M', 'L', 'XL'],
        imageUrl: '',
        videoUrl: '',
        brand: 'Azkaban',
      })
    }
  }, [product, isOpen])

  if (!isOpen) return null

  // Category change handler
  const handleCategoryChange = (e) => {
    const slug = e.target.value
    const found = CATEGORIES.find((c) => c.id === slug)
    setForm({
      ...form,
      category: slug,
      categoryName: found ? found.name : slug,
    })
  }

  // Toggle size chip
  const toggleSize = (sz) => {
    if (form.sizes.includes(sz)) {
      setForm({ ...form, sizes: form.sizes.filter((s) => s !== sz) })
    } else {
      setForm({ ...form, sizes: [...form.sizes, sz] })
    }
  }

  // Add custom size
  const handleAddCustomSize = (e) => {
    e.preventDefault()
    const val = customSizeInput.trim().toUpperCase()
    if (val && !form.sizes.includes(val)) {
      setForm({ ...form, sizes: [...form.sizes, val] })
      setCustomSizeInput('')
    }
  }

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      sizes: form.sizes.length > 0 ? form.sizes : ['ÚNICO'],
      price: Number(form.price) || 0,
      priceOffer: form.priceOffer ? Number(form.priceOffer) : null,
      stock: Number(form.stock) || 0,
      videoUrl: form.videoUrl?.trim() || null,
    })
  }

  // Calculate discount percentage
  const discountPercent =
    form.priceOffer && form.price && Number(form.priceOffer) < Number(form.price)
      ? Math.round((1 - Number(form.priceOffer) / Number(form.price)) * 100)
      : null

  const parsedVideo = parseVideoUrl(form.videoUrl)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-header__title">
            <FiTag className="text-orange" size={20} />
            <h3>{product ? 'Editar Prenda' : 'Nueva Prenda para el Catálogo'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-product-form">
          <div className="product-form-layout">
            {/* Left Column: Info & Details */}
            <div className="product-form-left">
              {/* Name */}
              <div className="form-group">
                <label>Nombre de la Prenda *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: BUZO BMW MOTORSPORT CON CIERRE"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Category & Brand */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Categoría *</label>
                  <select value={form.category} onChange={handleCategoryChange}>
                    {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Marca / Fabricante</label>
                  <input
                    type="text"
                    placeholder="Ej: Nike, Jordan, BMW, Adidas..."
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Precio Normal ($ ARS) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    placeholder="35000"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Precio Oferta ($)
                    {discountPercent && (
                      <span className="discount-tag-badge">-{discountPercent}% OFF</span>
                    )}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="Opcional"
                    value={form.priceOffer}
                    onChange={(e) => setForm({ ...form, priceOffer: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Stock (Unidades) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>

              {/* Sizes Selection */}
              <div className="form-group">
                <label>Talles Disponibles *</label>
                <div className="sizes-chips-picker">
                  {PRESET_SIZES.map((sz) => {
                    const isSelected = form.sizes.includes(sz)
                    return (
                      <button
                        key={sz}
                        type="button"
                        className={`size-chip-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => toggleSize(sz)}
                      >
                        {sz}
                      </button>
                    )
                  })}
                </div>

                {/* Add custom size */}
                <div className="add-custom-size-row">
                  <input
                    type="text"
                    placeholder="Otro talle (ej: 42, XXL, 2)..."
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={handleAddCustomSize}
                  >
                    + Agregar Talle
                  </button>
                </div>
              </div>

              {/* Badge selector */}
              <div className="form-group">
                <label>Insignia / Badge Promocional (Opcional)</label>
                <div className="badges-chips-picker">
                  {PRESET_BADGES.map((b) => (
                    <button
                      key={b}
                      type="button"
                      className={`badge-chip-btn ${form.badge === b ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, badge: form.badge === b ? '' : b })}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="O escribí un badge personalizado..."
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  style={{ marginTop: '8px' }}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Descripción y Especificaciones de la Prenda</label>
                <textarea
                  rows="3"
                  placeholder="Detalles sobre tipo de tela (friza invisible, algodón 100%), calce, bolsillo, cierre..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            {/* Right Column: Image Preview & Visibility Switches */}
            <div className="product-form-right">
              {/* Image Preview Box */}
              <div className="form-group">
                <label>Foto de la Prenda (URL)</label>
                <div className="image-preview-card">
                  <img
                    src={form.imageUrl || '/logo.jpg'}
                    alt="Vista previa"
                    className="image-preview-img"
                    onError={(e) => {
                      e.target.src = '/logo.jpg'
                    }}
                  />
                  {form.badge && (
                    <span className="image-preview-badge">{form.badge}</span>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  style={{ marginTop: '8px' }}
                />
              </div>

              {/* Preset helper buttons */}
              <div className="image-presets-box">
                <span className="text-xs text-muted">Fotos de muestra rápidas:</span>
                <div className="image-preset-btns">
                  {SAMPLE_IMAGE_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className="btn-preset-thumb"
                      onClick={() => setForm({ ...form, imageUrl: p.url })}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video URL Input */}
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiVideo className="text-orange" />
                  <span>Video de la Prenda (Opcional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/shorts/... o Instagram Reel, TikTok, Drive, MP4"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                />
                <span className="text-xs text-muted" style={{ display: 'block', marginTop: '4px', lineHeight: 1.4 }}>
                  Permite a tus clientes ver la prenda en movimiento y caída real. Soporta YouTube, YouTube Shorts, Reels de Instagram, TikTok, Google Drive o archivo .mp4.
                </span>
                {form.videoUrl && (
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {parsedVideo ? (
                      <span style={{ color: '#25d366', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <FiPlayCircle /> Link reconocido ({parsedVideo.type.toUpperCase()})
                      </span>
                    ) : (
                      <span style={{ color: '#ff9800', fontWeight: 500 }}>
                        ⚠ Verificá que el link sea público y comience con https://
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Visibility and Featured Switches */}
              <div className="form-switches-box">
                <label className="switch-row">
                  <div>
                    <strong>Prenda Activa</strong>
                    <span className="text-xs text-muted">Visible para los clientes en la tienda</span>
                  </div>
                  <input
                    type="checkbox"
                    className="switch-input"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  />
                </label>

                <label className="switch-row">
                  <div>
                    <strong>Destacar en la Home ⭐</strong>
                    <span className="text-xs text-muted">Aparece en carruseles y sección de tendencias</span>
                  </div>
                  <input
                    type="checkbox"
                    className="switch-input"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="admin-modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              <FiCheck size={16} />
              <span>{product ? 'Guardar Cambios' : 'Publicar Prenda'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminProductModal
