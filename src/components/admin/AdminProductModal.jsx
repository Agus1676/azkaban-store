import { useState, useEffect, useRef } from 'react'
import {
  FiX,
  FiCheck,
  FiImage,
  FiTag,
  FiEye,
  FiVideo,
  FiPlayCircle,
  FiUploadCloud,
  FiTrash2,
  FiStar,
  FiPlus,
  FiLoader,
} from 'react-icons/fi'
import { CATEGORIES } from '../../data/seedProducts'
import { formatPrice } from '../../utils/formatPrice'
import { parseVideoUrl } from '../../utils/video'
import { compressImageFile } from '../../utils/imageOptimizer'
import toast from 'react-hot-toast'

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

const AdminProductModal = ({ isOpen, onClose, product, onSave, categories = [] }) => {
  const availableCategories = (categories && categories.length > 0 ? categories : CATEGORIES).filter(
    (c) => c.id !== 'todos' && c.active !== false
  )

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
    images: [],
    imageUrl: '',
    videoUrl: '',
    brand: 'Azkaban',
  })

  const [customSizeInput, setCustomSizeInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [isCompressing, setIsCompressing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (product) {
      const rawImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : (product.imageUrl ? [product.imageUrl] : [])

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
        images: rawImages,
        imageUrl: rawImages[0] || product.imageUrl || '',
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
        images: [],
        imageUrl: '',
        videoUrl: '',
        brand: 'Azkaban',
      })
    }
    setUrlInput('')
  }, [product, isOpen])

  if (!isOpen) return null

  // Category change handler
  const handleCategoryChange = (e) => {
    const slug = e.target.value
    const found = availableCategories.find((c) => c.id === slug)
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

  // Process files from PC / Mobile
  const handleProcessFiles = async (files) => {
    const fileArray = Array.from(files || []).filter((f) => f.type.startsWith('image/'))
    if (fileArray.length === 0) {
      toast.error('Por favor seleccioná archivos de imagen válidos (JPG, PNG, WEBP)')
      return
    }

    setIsCompressing(true)
    const toastId = toast.loading(`Procesando y optimizando ${fileArray.length} foto${fileArray.length > 1 ? 's' : ''}...`)

    try {
      const compressedList = []
      for (const file of fileArray) {
        const dataUrl = await compressImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 })
        compressedList.push(dataUrl)
      }

      setForm((prev) => {
        const nextImages = [...(prev.images || []), ...compressedList]
        return {
          ...prev,
          images: nextImages,
          imageUrl: nextImages[0] || prev.imageUrl,
        }
      })
      toast.success(`¡${compressedList.length} imagen${compressedList.length > 1 ? 'es' : ''} cargada con éxito!`, { id: toastId })
    } catch (err) {
      toast.error(err.message || 'Error al procesar las imágenes', { id: toastId })
    } finally {
      setIsCompressing(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // File Input Change
  const handleFileInputChange = (e) => {
    handleProcessFiles(e.target.files)
  }

  // Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer && e.dataTransfer.files) {
      handleProcessFiles(e.dataTransfer.files)
    }
  }

  // Add Image from URL
  const handleAddUrlImage = () => {
    const url = urlInput.trim()
    if (!url) return
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      toast.error('Ingresá una URL válida que empiece con https://')
      return
    }

    setForm((prev) => {
      const nextImages = [...(prev.images || []), url]
      return {
        ...prev,
        images: nextImages,
        imageUrl: nextImages[0] || url,
      }
    })
    setUrlInput('')
    toast.success('Imagen agregada desde URL')
  }

  // Remove an Image
  const handleRemoveImage = (indexToRemove) => {
    setForm((prev) => {
      const nextImages = (prev.images || []).filter((_, idx) => idx !== indexToRemove)
      return {
        ...prev,
        images: nextImages,
        imageUrl: nextImages[0] || '',
      }
    })
  }

  // Set an Image as Main / Cover
  const handleSetMainImage = (indexToMain) => {
    setForm((prev) => {
      const current = [...(prev.images || [])]
      const [selected] = current.splice(indexToMain, 1)
      const nextImages = [selected, ...current]
      return {
        ...prev,
        images: nextImages,
        imageUrl: selected,
      }
    })
    toast.success('Foto establecida como portada principal')
  }

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    const finalImages = form.images && form.images.length > 0
      ? form.images
      : (form.imageUrl ? [form.imageUrl] : ['/logo.png'])

    onSave({
      ...form,
      images: finalImages,
      imageUrl: finalImages[0] || '/logo.png',
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
  const currentImages = form.images && form.images.length > 0
    ? form.images
    : (form.imageUrl ? [form.imageUrl] : [])

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
                    {availableCategories.map((c) => (
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

            {/* Right Column: Image Uploader & Preview & Visibility Switches */}
            <div className="product-form-right">
              {/* Image Upload Zone */}
              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📸 Fotos de la Prenda ({currentImages.length})</span>
                  <span className="text-xs text-muted">Podés subir varias</span>
                </label>

                {/* File Upload Drop Area */}
                <div
                  className={`admin-upload-dropzone ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                  />
                  {isCompressing ? (
                    <div className="admin-upload-loading">
                      <FiLoader className="spin" size={26} />
                      <span>Optimizando y subiendo fotos...</span>
                    </div>
                  ) : (
                    <div className="admin-upload-prompt">
                      <FiUploadCloud size={30} className="text-orange" />
                      <strong>Hacé clic acá para subir fotos desde tu PC o Celular</strong>
                      <span className="text-xs text-muted">
                        o arrastrá y soltá las imágenes acá (JPG, PNG, WebP)
                      </span>
                    </div>
                  )}
                </div>

                {/* Gallery of Uploaded Photos */}
                {currentImages.length > 0 && (
                  <div className="admin-photo-gallery">
                    <span className="text-xs text-muted" style={{ fontWeight: 600 }}>
                      Fotos cargadas (La primera es la portada de la tienda):
                    </span>
                    <div className="admin-photo-grid">
                      {currentImages.map((img, idx) => (
                        <div key={idx} className={`admin-photo-thumb ${idx === 0 ? 'is-main' : ''}`}>
                          <img
                            src={img}
                            alt={`Foto ${idx + 1}`}
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = '/logo.png'
                            }}
                          />
                          {idx === 0 && <span className="admin-photo-main-badge">Portada</span>}
                          <div className="admin-photo-actions">
                            {idx !== 0 && (
                              <button
                                type="button"
                                className="admin-photo-action-btn make-main"
                                title="Hacer foto principal"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSetMainImage(idx)
                                }}
                              >
                                <FiStar size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              className="admin-photo-action-btn delete"
                              title="Eliminar foto"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveImage(idx)
                              }}
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional URL Adder */}
                <div className="admin-url-add-box" style={{ marginTop: '12px' }}>
                  <span className="text-xs text-muted">O agregá una foto mediante link URL:</span>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... o enlace de foto"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddUrlImage()
                        }
                      }}
                      style={{ fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={handleAddUrlImage}
                      style={{ whiteSpace: 'nowrap', padding: '0 12px' }}
                    >
                      <FiPlus size={14} /> Agregar
                    </button>
                  </div>
                </div>
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
                      onClick={() => {
                        setForm((prev) => {
                          const nextImages = [...(prev.images || []), p.url]
                          return {
                            ...prev,
                            images: nextImages,
                            imageUrl: nextImages[0] || p.url,
                          }
                        })
                        toast.success(`Foto ${p.label} agregada`)
                      }}
                    >
                      + {p.label}
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
                  placeholder="https://youtube.com/shorts/... o Instagram Reel, TikTok, MP4"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                />
                <span className="text-xs text-muted" style={{ display: 'block', marginTop: '4px', lineHeight: 1.4 }}>
                  Permite a tus clientes ver la prenda en movimiento y caída real. Soporta YouTube, YouTube Shorts, Reels de Instagram, TikTok o .mp4.
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
            <button type="submit" className="btn-primary" disabled={isCompressing}>
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
