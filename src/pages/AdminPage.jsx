import { useState, useEffect } from 'react'
import {
  FiShield,
  FiBox,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiShoppingBag,
  FiSettings,
  FiDollarSign,
  FiAlertCircle,
  FiCheck,
  FiLock,
  FiLogOut,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiEye,
  FiEyeOff,
  FiTruck,
  FiUser,
  FiPhone,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { SEED_PRODUCTS, STORE_INFO, CATEGORIES } from '../data/seedProducts'
import { formatPrice } from '../utils/formatPrice'
import toast from 'react-hot-toast'
import './AdminPage.css'

const getStoredProducts = () => {
  try {
    const saved = localStorage.getItem('azkaban_products')
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn(e)
  }
  return SEED_PRODUCTS
}

const getStoredOrders = () => {
  try {
    const saved = localStorage.getItem('azkaban_orders')
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn(e)
  }
  return []
}

const getStoredConfig = () => {
  try {
    const saved = localStorage.getItem('azkaban_store_config')
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn(e)
  }
  return STORE_INFO
}

const AdminPage = () => {
  const { isAdmin, login, logout, changePassword } = useAuth()
  const [passwordInput, setPasswordInput] = useState('')
  const [activeTab, setActiveTab] = useState('products') // 'products', 'orders', 'categories', 'settings'

  // Data states
  const [products, setProducts] = useState(getStoredProducts)
  const [orders, setOrders] = useState(getStoredOrders)
  const [storeConfig, setStoreConfig] = useState(getStoredConfig)

  // Product modal state
  const [editingProduct, setEditingProduct] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'buzos',
    categoryName: 'Buzos',
    price: 35000,
    priceOffer: '',
    stock: 5,
    active: true,
    featured: false,
    badge: '',
    description: '',
    sizes: 'S, M, L, XL',
    imageUrl: '',
    brand: '',
  })

  // Settings state
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')

  useEffect(() => {
    localStorage.setItem('azkaban_products', JSON.stringify(products))
    window.dispatchEvent(new Event('azkaban_products_updated'))
  }, [products])

  useEffect(() => {
    localStorage.setItem('azkaban_orders', JSON.stringify(orders))
    window.dispatchEvent(new Event('azkaban_orders_updated'))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('azkaban_store_config', JSON.stringify(storeConfig))
    window.dispatchEvent(new Event('azkaban_config_updated'))
  }, [storeConfig])

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault()
    const res = login(passwordInput)
    if (res.success) {
      toast.success('¡Bienvenido al Panel Administrador!')
      setPasswordInput('')
    } else {
      toast.error(res.error || 'Contraseña incorrecta')
    }
  }

  // Open modal for new product
  const handleOpenNewProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: '',
      category: 'buzos',
      categoryName: 'Buzos',
      price: 35000,
      priceOffer: '',
      stock: 5,
      active: true,
      featured: false,
      badge: 'NUEVO',
      description: '',
      sizes: 'S, M, L, XL',
      imageUrl: '',
      brand: 'Azkaban',
    })
    setIsFormOpen(true)
  }

  // Open modal for editing
  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod)
    setProductForm({
      name: prod.name,
      category: prod.category || 'buzos',
      categoryName: prod.categoryName || 'Buzos',
      price: prod.price || 0,
      priceOffer: prod.priceOffer || '',
      stock: typeof prod.stock === 'number' ? prod.stock : 1,
      active: prod.active !== false,
      featured: !!prod.featured,
      badge: prod.badge || '',
      description: prod.description || '',
      sizes: Array.isArray(prod.sizes) ? prod.sizes.join(', ') : 'S, M, L',
      imageUrl: prod.imageUrl || '',
      brand: prod.brand || '',
    })
    setIsFormOpen(true)
  }

  // Save product (Add or Edit)
  const handleSaveProduct = (e) => {
    e.preventDefault()
    if (!productForm.name.trim()) {
      toast.error('El nombre del producto es obligatorio')
      return
    }

    const sizesArr = productForm.sizes
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)

    const priceNum = Number(productForm.price) || 0
    const priceOfferNum = productForm.priceOffer ? Number(productForm.priceOffer) : null

    if (editingProduct) {
      // Update existing
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: productForm.name.trim(),
                category: productForm.category,
                categoryName: productForm.categoryName,
                price: priceNum,
                priceOffer: priceOfferNum,
                stock: Number(productForm.stock) || 0,
                active: productForm.active,
                featured: productForm.featured,
                badge: productForm.badge.trim(),
                description: productForm.description.trim(),
                sizes: sizesArr.length > 0 ? sizesArr : ['ÚNICO'],
                imageUrl: productForm.imageUrl.trim() || p.imageUrl,
                brand: productForm.brand.trim(),
              }
            : p
        )
      )
      toast.success('Producto actualizado con éxito')
    } else {
      // Add new
      const newProd = {
        id: `azk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: productForm.name.trim(),
        category: productForm.category,
        categoryName: productForm.categoryName,
        price: priceNum,
        priceOffer: priceOfferNum,
        stock: Number(productForm.stock) || 0,
        active: productForm.active,
        featured: productForm.featured,
        badge: productForm.badge.trim(),
        description: productForm.description.trim(),
        sizes: sizesArr.length > 0 ? sizesArr : ['ÚNICO'],
        imageUrl: productForm.imageUrl.trim() || '/logo.jpg',
        brand: productForm.brand.trim() || 'Azkaban',
      }
      setProducts((prev) => [newProd, ...prev])
      toast.success('Nuevo producto agregado al catálogo')
    }

    setIsFormOpen(false)
  }

  // Delete product
  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este producto?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Producto eliminado')
    }
  }

  // Quick toggle active
  const handleToggleActive = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    )
  }

  // Quick stock change
  const handleStockAdjust = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p
      )
    )
  }

  // Change order status
  const handleOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
    toast.success(`Pedido #${orderId} marcado como: ${newStatus}`)
  }

  // Delete order
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('¿Eliminar este pedido del registro?')) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
    }
  }

  // Restore seed products
  const handleRestoreDefaults = () => {
    if (window.confirm('¿Deseas restaurar los 12 productos oficiales de Treinta? Se sobreescribirán los cambios.')) {
      setProducts(SEED_PRODUCTS)
      toast.success('Productos de Treinta restaurados')
    }
  }

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      products,
      orders,
      storeConfig,
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `azkabanstore_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    toast.success('Copia de seguridad descargada')
  }

  // Import JSON backup
  const handleImportBackup = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products)
        }
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders)
        }
        if (data.storeConfig) {
          setStoreConfig(data.storeConfig)
        }
        toast.success('¡Copia de seguridad restaurada correctamente!')
      } catch (err) {
        toast.error('Archivo de respaldo inválido')
      }
    }
    reader.readAsText(file)
  }

  // Password change handler
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault()
    const res = changePassword(currentPass, newPass)
    if (res.success) {
      toast.success('Contraseña cambiada exitosamente')
      setCurrentPass('')
      setNewPass('')
    } else {
      toast.error(res.error || 'Error al cambiar contraseña')
    }
  }

  // Metrics
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0)
  const lowStockCount = products.filter((p) => p.stock <= 2 && p.active !== false).length
  const totalOrdersAmount = orders.reduce((acc, o) => acc + (o.total || 0), 0)

  // If not logged in, show lock screen
  if (!isAdmin) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-login-icon">
            <FiShield size={32} />
          </div>
          <h2>Panel de Control Azkaban</h2>
          <p>Ingresá tu contraseña de administrador para gestionar productos, pedidos y configuración.</p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="login-input-group">
              <FiLock className="login-input-icon" />
              <input
                type="password"
                placeholder="Contraseña de admin"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary btn-login-submit">
              Ingresar al Panel
            </button>
          </form>
          <span className="login-hint">Contraseña por defecto: <code>admin</code> o <code>azkaban2026</code></span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Top Bar */}
        <div className="admin-topbar">
          <div className="admin-topbar__title">
            <FiShield className="text-orange" size={28} />
            <div>
              <h2>Panel de Administración</h2>
              <span>AzkabanStore Oficial</span>
            </div>
          </div>

          <div className="admin-topbar__actions">
            <button className="btn-secondary btn-sm" onClick={handleExportBackup} title="Exportar Backup">
              <FiDownload /> Backup
            </button>
            <label className="btn-secondary btn-sm" title="Importar Backup" style={{ cursor: 'pointer' }}>
              <FiUpload /> Restaurar
              <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
            </label>
            <button className="btn-secondary btn-sm btn-logout" onClick={logout}>
              <FiLogOut /> Salir
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon--box">
              <FiBox />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Productos</span>
              <span className="stat-value">{products.length}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon--stock">
              <FiRefreshCw />
            </div>
            <div className="stat-info">
              <span className="stat-label">Unidades en Stock</span>
              <span className="stat-value">{totalStock}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon--alert">
              <FiAlertCircle />
            </div>
            <div className="stat-info">
              <span className="stat-label">Poco Stock (≤2)</span>
              <span className="stat-value">{lowStockCount}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon--orders">
              <FiShoppingBag />
            </div>
            <div className="stat-info">
              <span className="stat-label">Pedidos Recibidos</span>
              <span className="stat-value">{orders.length}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FiBox /> Productos ({products.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FiShoppingBag /> Pedidos & Ventas ({orders.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings /> Configuración de Tienda
          </button>
        </div>

        {/* TAB 1: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="admin-content-card">
            <div className="admin-content-card__header">
              <div>
                <h3>Gestión de Productos</h3>
                <p>Agregá, editá precios, talles y stock de las prendas del catálogo.</p>
              </div>
              <div className="header-buttons">
                <button className="btn-secondary" onClick={handleRestoreDefaults}>
                  <FiRefreshCw /> Recargar Treinta
                </button>
                <button className="btn-primary" onClick={handleOpenNewProduct}>
                  <FiPlus /> Nuevo Producto
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nombre / Marca</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Talles</th>
                    <th>Stock</th>
                    <th>Visible</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id} className={prod.active === false ? 'row-inactive' : ''}>
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
                        <span className="table-product-brand">{prod.brand || 'Azkaban'}</span>
                        {prod.badge && <span className="table-badge">{prod.badge}</span>}
                      </td>
                      <td>
                        <span className="table-category-tag">{prod.categoryName || prod.category}</span>
                      </td>
                      <td>
                        <strong className="table-price">{formatPrice(prod.price)}</strong>
                        {prod.priceOffer && (
                          <span className="table-price-old">{formatPrice(prod.priceOffer)}</span>
                        )}
                      </td>
                      <td>
                        <div className="table-sizes-list">
                          {Array.isArray(prod.sizes) &&
                            prod.sizes.map((s) => (
                              <span key={s} className="size-tag">
                                {s}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td>
                        <div className="table-stock-control">
                          <button
                            onClick={() => handleStockAdjust(prod.id, -1)}
                            className="stock-btn"
                          >
                            -
                          </button>
                          <span className={`stock-number ${prod.stock <= 2 ? 'stock-low' : ''}`}>
                            {prod.stock || 0}
                          </span>
                          <button
                            onClick={() => handleStockAdjust(prod.id, 1)}
                            className="stock-btn"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          className={`btn-toggle-eye ${prod.active !== false ? 'active' : ''}`}
                          onClick={() => handleToggleActive(prod.id)}
                          title={prod.active !== false ? 'Ocultar producto' : 'Hacer visible'}
                        >
                          {prod.active !== false ? <FiEye /> : <FiEyeOff />}
                        </button>
                      </td>
                      <td>
                        <div className="table-action-btns">
                          <button
                            className="action-btn-edit"
                            onClick={() => handleOpenEditProduct(prod)}
                            title="Editar"
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="action-btn-del"
                            onClick={() => handleDeleteProduct(prod.id)}
                            title="Eliminar"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="admin-content-card">
            <div className="admin-content-card__header">
              <div>
                <h3>Registro de Pedidos</h3>
                <p>Pedidos enviados por clientes a través del carrito a WhatsApp.</p>
              </div>
              <span className="total-sales-tag">
                Ventas Registradas: <strong>{formatPrice(totalOrdersAmount)}</strong>
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="admin-empty-state">
                <FiShoppingBag size={48} className="text-muted" />
                <h4>No hay pedidos registrados todavía</h4>
                <p>Cuando los clientes completen el carrito y lo manden por WhatsApp aparecerán acá.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((ord) => (
                  <div key={ord.id} className="order-card">
                    <div className="order-card__header">
                      <div>
                        <span className="order-id">#{ord.id}</span>
                        <span className="order-date">
                          {new Date(ord.date).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="order-header-right">
                        <select
                          className={`order-status-select status-${ord.status?.toLowerCase() || 'pendiente'}`}
                          value={ord.status || 'Pendiente'}
                          onChange={(e) => handleOrderStatus(ord.id, e.target.value)}
                        >
                          <option value="Pendiente">⏳ Pendiente</option>
                          <option value="En Preparación">📦 En Preparación</option>
                          <option value="Despachado">🚚 Despachado</option>
                          <option value="Entregado">✅ Entregado</option>
                          <option value="Cancelado">❌ Cancelado</option>
                        </select>
                        <button
                          className="btn-del-order"
                          onClick={() => handleDeleteOrder(ord.id)}
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    <div className="order-card__body">
                      {/* Customer info */}
                      <div className="order-customer-box">
                        <div className="customer-row">
                          <FiUser /> <strong>{ord.customer?.name}</strong>
                        </div>
                        {ord.customer?.phone && (
                          <div className="customer-row">
                            <FiPhone /> <span>{ord.customer?.phone}</span>
                          </div>
                        )}
                        <div className="customer-row">
                          <FiTruck /> <span>{ord.shippingMethod}</span>
                        </div>
                        {ord.customer?.city && (
                          <div className="customer-row">
                            <span>📍 {ord.customer?.city} - {ord.customer?.address}</span>
                          </div>
                        )}
                        <div className="customer-row">
                          <span>💳 Pago: {ord.paymentMethod}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="order-items-box">
                        <h5>Prendas ({ord.items?.length || 0}):</h5>
                        <ul className="order-items-list">
                          {ord.items?.map((it, i) => (
                            <li key={i}>
                              <span>{it.qty}x {it.name} <strong>(Talle: {it.size})</strong></span>
                              <span>{formatPrice(it.price * it.qty)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="order-total-row">
                          <span>TOTAL:</span>
                          <strong>{formatPrice(ord.total)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="admin-content-card">
            <div className="admin-content-card__header">
              <div>
                <h3>Configuración de AzkabanStore</h3>
                <p>Modificá datos de contacto, punto de retiro, WhatsApp y contraseña.</p>
              </div>
            </div>

            <div className="settings-grid">
              {/* Store Details Form */}
              <form
                className="settings-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success('Configuración de la tienda guardada')
                }}
              >
                <h4>Datos Principales</h4>
                <div className="form-group">
                  <label>Nombre de la Tienda</label>
                  <input
                    type="text"
                    value={storeConfig.name}
                    onChange={(e) => setStoreConfig({ ...storeConfig, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp Oficial (Sin espacios ni signos, con código de país)</label>
                  <input
                    type="text"
                    value={storeConfig.phoneRaw}
                    onChange={(e) => setStoreConfig({ ...storeConfig, phoneRaw: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp Display (Formato visible al cliente)</label>
                  <input
                    type="text"
                    value={storeConfig.phoneDisplay}
                    onChange={(e) => setStoreConfig({ ...storeConfig, phoneDisplay: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Correo Electrónico Oficial</label>
                  <input
                    type="email"
                    value={storeConfig.email}
                    onChange={(e) => setStoreConfig({ ...storeConfig, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Dirección Punto de Retiro</label>
                  <input
                    type="text"
                    value={storeConfig.address}
                    onChange={(e) => setStoreConfig({ ...storeConfig, address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Horarios de Atención</label>
                  <input
                    type="text"
                    value={storeConfig.hours}
                    onChange={(e) => setStoreConfig({ ...storeConfig, hours: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Link Canal de WhatsApp</label>
                  <input
                    type="text"
                    value={storeConfig.whatsappChannelUrl}
                    onChange={(e) => setStoreConfig({ ...storeConfig, whatsappChannelUrl: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Link Instagram</label>
                  <input
                    type="text"
                    value={storeConfig.instagramUrl}
                    onChange={(e) => setStoreConfig({ ...storeConfig, instagramUrl: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Guardar Datos de Tienda
                </button>
              </form>

              {/* Password change form */}
              <form className="settings-form" onSubmit={handleChangePasswordSubmit}>
                <h4>Seguridad & Contraseña</h4>
                <div className="form-group">
                  <label>Contraseña Actual</label>
                  <input
                    type="password"
                    required
                    placeholder="Contraseña actual"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Nueva Contraseña</label>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 4 caracteres"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-secondary">
                  Actualizar Contraseña
                </button>

                <div className="settings-quick-info">
                  <h5>ℹ️ Información Importante:</h5>
                  <p>
                    • Los cambios se guardan localmente y se sincronizan instantáneamente con el catálogo.<br />
                    • Los productos pueden ser descargados como copia de seguridad JSON en cualquier momento.<br />
                    • La paleta principal configurada es el <strong>Naranja Azkaban (#ff5500)</strong>.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="admin-product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Editar Prenda' : 'Nueva Prenda'}</h3>
              <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-product-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: BUZO NIKE NEGRO FRIZADO"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Marca / Fabricante</label>
                  <input
                    type="text"
                    placeholder="Ej: Nike, Jordan, BMW, Adidas..."
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const sel = CATEGORIES.find((c) => c.id === e.target.value)
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                        categoryName: sel ? sel.name : e.target.value,
                      })
                    }}
                  >
                    {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Precio ARS ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="38000"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Precio Oferta (Opcional)</label>
                  <input
                    type="number"
                    placeholder="Dejar vacío si no hay promo"
                    value={productForm.priceOffer}
                    onChange={(e) => setProductForm({ ...productForm, priceOffer: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Stock Disponible</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Talles (Separados por coma)</label>
                  <input
                    type="text"
                    placeholder="Ej: S, M, L, XL, XXL"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Badge / Etiqueta</label>
                  <input
                    type="text"
                    placeholder="Ej: CALIDAD AAA, 100% ALGODÓN"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL de la Imagen</label>
                <input
                  type="url"
                  placeholder="https://cdn.treinta.co/... o link directo de imagen"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Descripción detallada</label>
                <textarea
                  rows="3"
                  placeholder="Tela, detalles, corte, bolsillos, etc."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <div className="form-toggles">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  <span>Producto Destacado (Aparece en inicio)</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={productForm.active}
                    onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                  />
                  <span>Visible en el Catálogo</span>
                </label>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
