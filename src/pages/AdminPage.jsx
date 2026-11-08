import { useState, useEffect } from 'react'
import {
  FiShield,
  FiBox,
  FiShoppingBag,
  FiSettings,
  FiLock,
  FiLogOut,
  FiDownload,
  FiUpload,
  FiExternalLink,
  FiLayers,
} from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { SEED_PRODUCTS, STORE_INFO } from '../data/seedProducts'
import toast from 'react-hot-toast'

// Modular Admin Components
import AdminDashboardTab from '../components/admin/AdminDashboardTab'
import AdminProductsTab from '../components/admin/AdminProductsTab'
import AdminStockTab from '../components/admin/AdminStockTab'
import AdminOrdersTab from '../components/admin/AdminOrdersTab'
import AdminSettingsTab from '../components/admin/AdminSettingsTab'
import AdminProductModal from '../components/admin/AdminProductModal'
import AdminBulkPriceModal from '../components/admin/AdminBulkPriceModal'
import AdminOrderInvoiceModal from '../components/admin/AdminOrderInvoiceModal'

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
  return {
    ...STORE_INFO,
    phoneRaw: STORE_INFO.phoneRaw || '5491137934198',
    phoneDisplay: STORE_INFO.phoneDisplay || '+54 9 11 3793-4198',
    hours: STORE_INFO.hours || 'Lunes a Viernes de 10:00 a 20:00 hs',
    address: STORE_INFO.address || 'Dr. marcos zimmermann 3339, San Martín, Prov. Buenos Aires',
    shippingCarriersText: 'Andreani / Vía Cargo',
    announcementText: 'Envíos a todo el país por Andreani y Vía Cargo • Retiro en San Martín',
    bankHolder: 'Azkaban Store Oficial',
    bankName: 'Mercado Pago / Banco',
    bankAlias: 'AZKABAN.STORE',
    bankCbu: '0000003100012345678901',
  }
}

const AdminPage = () => {
  const { isAdmin, login, logout, changePassword } = useAuth()
  const [passwordInput, setPasswordInput] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'products' | 'stock' | 'orders' | 'settings'

  // Global store states
  const [products, setProducts] = useState(getStoredProducts)
  const [orders, setOrders] = useState(getStoredOrders)
  const [storeConfig, setStoreConfig] = useState(getStoredConfig)

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false)
  const [invoiceOrder, setInvoiceOrder] = useState(null)

  // Sync to localStorage
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

  // Login Handler
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

  // Open Product Modal
  const handleOpenNewProduct = () => {
    setEditingProduct(null)
    setIsProductModalOpen(true)
  }

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod)
    setIsProductModalOpen(true)
  }

  // Duplicate / Clone Product
  const handleDuplicateProduct = (prod) => {
    const clone = {
      ...prod,
      id: `azk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${prod.name} (Copia)`,
      stock: 1,
    }
    setProducts((prev) => [clone, ...prev])
    toast.success(`Prenda duplicada: "${clone.name}"`)
  }

  // Save Product (Add or Edit)
  const handleSaveProduct = (formData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
              }
            : p
        )
      )
      toast.success('Prenda actualizada exitosamente')
    } else {
      const newProd = {
        ...formData,
        id: `azk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      }
      setProducts((prev) => [newProd, ...prev])
      toast.success('Nueva prenda agregada al catálogo')
    }
    setIsProductModalOpen(false)
  }

  // Delete Product
  const handleDeleteProduct = (id) => {
    const item = products.find((p) => p.id === id)
    if (window.confirm(`¿Estás seguro de que querés eliminar "${item?.name || 'esta prenda'}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Prenda eliminada del catálogo')
    }
  }

  // Toggle Active
  const handleToggleActive = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: p.active === false } : p))
    )
  }

  // Toggle Featured
  const handleToggleFeatured = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    )
  }

  // Adjust Stock (+/- delta)
  const handleAdjustStock = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, (Number(p.stock) || 0) + delta) } : p
      )
    )
  }

  // Set Direct Stock
  const handleSetStock = (id, newStock) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    )
  }

  // Bulk Price Update
  const handleApplyBulkUpdate = ({
    targetCategory,
    direction,
    adjustmentType,
    amount,
    roundHundreds,
  }) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (targetCategory !== 'all' && p.category !== targetCategory) {
          return p
        }

        const currentPrice = Number(p.price) || 0
        let newPrice = currentPrice

        if (adjustmentType === 'percent') {
          const factor = direction === 'increase' ? 1 + amount / 100 : Math.max(0, 1 - amount / 100)
          newPrice = currentPrice * factor
        } else {
          newPrice = direction === 'increase' ? currentPrice + amount : Math.max(0, currentPrice - amount)
        }

        if (roundHundreds) {
          newPrice = Math.round(newPrice / 100) * 100
        }

        // If product has priceOffer, adjust it proportionally too
        let newOffer = p.priceOffer
        if (p.priceOffer) {
          const curOffer = Number(p.priceOffer)
          if (adjustmentType === 'percent') {
            const factor = direction === 'increase' ? 1 + amount / 100 : Math.max(0, 1 - amount / 100)
            newOffer = Math.round((curOffer * factor) / 100) * 100
          } else {
            newOffer = Math.max(0, direction === 'increase' ? curOffer + amount : curOffer - amount)
          }
        }

        return {
          ...p,
          price: Math.max(100, Math.round(newPrice)),
          priceOffer: newOffer,
        }
      })
    )
  }

  // Order Handlers
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
    toast.success(`Pedido #${orderId} actualizado: ${newStatus}`)
  }

  const handleUpdateOrderTracking = (orderId, trackingCode) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, trackingCode } : o))
    )
  }

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`¿Eliminar la orden #${orderId} del historial?`)) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      toast.success('Pedido eliminado')
    }
  }

  // Backup Handlers
  const handleExportBackup = () => {
    const backupData = {
      app: 'AzkabanStore',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      products,
      orders,
      storeConfig,
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `azkabanstore_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    toast.success('Copia de seguridad descargada exitosamente')
  }

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
        toast.error('Archivo de respaldo inválido o dañado')
      }
    }
    reader.readAsText(file)
  }

  const handleRestoreTreinta = () => {
    if (
      window.confirm(
        '¿Deseás restaurar las 12 prendas originales de Treinta? Se sobreescribirán los cambios de productos.'
      )
    ) {
      setProducts(SEED_PRODUCTS)
      toast.success('Catálogo de Treinta restaurado exitosamente')
    }
  }

  // If not logged in, show lock screen
  if (!isAdmin) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-login-icon">
            <FiShield size={36} />
          </div>
          <h2>Panel de Control AzkabanStore</h2>
          <p>
            Ingresá tu contraseña de administrador para gestionar productos, precios masivos, pedidos y configuración.
          </p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="login-input-group">
              <FiLock className="login-input-icon" />
              <input
                type="password"
                placeholder="Contraseña de administrador"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary btn-login-submit">
              Ingresar al Panel
            </button>
          </form>
          <span className="login-hint">
            Contraseña por defecto: <code>admin</code> o <code>azkaban2026</code>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Top Navbar */}
        <div className="admin-topbar">
          <div className="admin-topbar__title">
            <div className="admin-logo-circle">
              <img src="/logo.jpg" alt="AzkabanStore" />
            </div>
            <div>
              <h2>Panel de Administración</h2>
              <span className="admin-badge-sub">AzkabanStore • San Martín</span>
            </div>
          </div>

          <div className="admin-topbar__actions">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm"
              title="Abrir tienda online"
            >
              <FiExternalLink size={14} /> Tienda
            </a>
            <button
              className="btn-secondary btn-sm"
              onClick={handleExportBackup}
              title="Descargar copia de seguridad"
            >
              <FiDownload size={14} /> Backup
            </button>
            <label className="btn-secondary btn-sm" style={{ cursor: 'pointer' }} title="Importar copia JSON">
              <FiUpload size={14} /> Restaurar
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                style={{ display: 'none' }}
              />
            </label>
            <button className="btn-secondary btn-sm btn-logout" onClick={logout} title="Cerrar sesión">
              <FiLogOut size={14} /> Salir
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiLayers size={16} /> Resumen General
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FiBox size={16} /> Prendas & Catálogo ({products.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'stock' ? 'active' : ''}`}
            onClick={() => setActiveTab('stock')}
          >
            <FiBox size={16} /> Control de Stock
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FiShoppingBag size={16} /> Pedidos & Ventas ({orders.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings size={16} /> Configuración de Tienda
          </button>
        </div>

        {/* TAB VIEWS */}
        {activeTab === 'dashboard' && (
          <AdminDashboardTab
            products={products}
            orders={orders}
            onNavigateTab={setActiveTab}
            onOpenNewProduct={handleOpenNewProduct}
            onOpenBulkPrice={() => setIsBulkPriceModalOpen(true)}
            onExportBackup={handleExportBackup}
          />
        )}

        {activeTab === 'products' && (
          <AdminProductsTab
            products={products}
            onOpenNewProduct={handleOpenNewProduct}
            onOpenEditProduct={handleOpenEditProduct}
            onDuplicateProduct={handleDuplicateProduct}
            onDeleteProduct={handleDeleteProduct}
            onToggleActive={handleToggleActive}
            onToggleFeatured={handleToggleFeatured}
            onAdjustStock={handleAdjustStock}
            onOpenBulkPrice={() => setIsBulkPriceModalOpen(true)}
            onRestoreTreinta={handleRestoreTreinta}
          />
        )}

        {activeTab === 'stock' && (
          <AdminStockTab
            products={products}
            onSetStock={handleSetStock}
            onAdjustStock={handleAdjustStock}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersTab
            orders={orders}
            storeConfig={storeConfig}
            onUpdateStatus={handleUpdateOrderStatus}
            onUpdateTracking={handleUpdateOrderTracking}
            onDeleteOrder={handleDeleteOrder}
            onOpenInvoice={setInvoiceOrder}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsTab
            storeConfig={storeConfig}
            onSaveConfig={setStoreConfig}
            onChangePassword={changePassword}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onRestoreTreinta={handleRestoreTreinta}
          />
        )}
      </div>

      {/* MODALS */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <AdminBulkPriceModal
        isOpen={isBulkPriceModalOpen}
        onClose={() => setIsBulkPriceModalOpen(false)}
        products={products}
        onApplyBulkUpdate={handleApplyBulkUpdate}
      />

      <AdminOrderInvoiceModal
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        order={invoiceOrder}
        storeConfig={storeConfig}
      />
    </div>
  )
}

export default AdminPage
