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
  FiTruck,
  FiTag,
  FiMenu,
  FiX,
  FiPackage,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import {
  getStoredProducts,
  saveStoredProducts,
  restoreFactoryProducts,
  getStoredCategories,
  saveStoredCategories,
  getStoredOrders,
  saveStoredOrders,
  getStoredConfig,
  saveStoredConfig,
} from '../services/storeDb'
import toast from 'react-hot-toast'

// Modular Admin Components
import AdminDashboardTab from '../components/admin/AdminDashboardTab'
import AdminProductsTab from '../components/admin/AdminProductsTab'
import AdminCategoriesTab from '../components/admin/AdminCategoriesTab'
import AdminShippingTab from '../components/admin/AdminShippingTab'
import AdminStockTab from '../components/admin/AdminStockTab'
import AdminOrdersTab from '../components/admin/AdminOrdersTab'
import AdminSettingsTab from '../components/admin/AdminSettingsTab'
import AdminProductModal from '../components/admin/AdminProductModal'
import AdminBulkPriceModal from '../components/admin/AdminBulkPriceModal'
import AdminOrderInvoiceModal from '../components/admin/AdminOrderInvoiceModal'

import './AdminPage.css'

const TAB_INFO = {
  dashboard: { title: 'Dashboard General', sub: 'Métricas de ventas, pedidos y control de stock' },
  products: { title: 'Catálogo de Prendas', sub: 'Administración de productos, fotos, precios y talles' },
  stock: { title: 'Control Rápido de Stock', sub: 'Ajuste de existencias físicas e inventario en tiempo real' },
  categories: { title: 'Gestión de Categorías', sub: 'Organización de colecciones para el menú y catálogo' },
  shipping: { title: 'Logística & Cotizador Andreani', sub: 'Tarifas zonales, sucursales y envíos a todo el país' },
  orders: { title: 'Gestión de Pedidos & Ventas', sub: 'Seguimiento de compras, códigos de guía y remitos' },
  settings: { title: 'Configuración de la Tienda', sub: 'Canales de contacto, punto de retiro y copias de seguridad' },
}

const AdminPage = () => {
  const { isAdmin, login, logout, changePassword } = useAuth()
  const [passwordInput, setPasswordInput] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'products' | 'categories' | 'shipping' | 'stock' | 'orders' | 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Global store states (100% Blindados con storeDb)
  const [products, setProducts] = useState(getStoredProducts)
  const [categories, setCategories] = useState(getStoredCategories)
  const [orders, setOrders] = useState(getStoredOrders)
  const [storeConfig, setStoreConfig] = useState(getStoredConfig)

  const handleSaveCategories = (updated) => {
    setCategories(updated)
    saveStoredCategories(updated)
  }

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false)
  const [invoiceOrder, setInvoiceOrder] = useState(null)

  // Sync to storeDb & localStorage
  useEffect(() => {
    saveStoredProducts(products)
  }, [products])

  useEffect(() => {
    saveStoredOrders(orders)
  }, [orders])

  useEffect(() => {
    saveStoredConfig(storeConfig)
  }, [storeConfig])

  // Badge counts
  const lowStockCount = products.filter((p) => (Number(p.stock) || 0) <= 2 && p.active !== false).length

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
        '¿Deseás restaurar las 12 prendas iniciales de Treinta? Se sobreescribirán los cambios de productos.'
      )
    ) {
      const restored = restoreFactoryProducts()
      setProducts(restored)
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
    <div className="admin-app-layout">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="admin-backdrop-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Dedicated Left Sidebar (Jokers Style) */}
      <aside className={`admin-app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-brand-logo-wrap">
            <img src="/logo.png" alt="Azkaban" className="admin-sidebar-logo" />
          </div>
          <div className="admin-brand-texts">
            <h3>AZKABAN</h3>
            <span>ADMIN STUDIO</span>
          </div>
          <button
            className="admin-sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar navegación"
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('dashboard')
              setSidebarOpen(false)
            }}
          >
            <FiLayers size={18} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('products')
              setSidebarOpen(false)
            }}
          >
            <FiBox size={18} />
            <span>Prendas &amp; Catálogo</span>
            <span className="nav-item-badge">{products.length}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'stock' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('stock')
              setSidebarOpen(false)
            }}
          >
            <FiPackage size={18} />
            <span>Control de Stock</span>
            {lowStockCount > 0 && (
              <span className="nav-item-badge badge-warning">{lowStockCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('categories')
              setSidebarOpen(false)
            }}
          >
            <FiTag size={18} />
            <span>Categorías</span>
            <span className="nav-item-badge">{categories.length}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('shipping')
              setSidebarOpen(false)
            }}
          >
            <FiTruck size={18} />
            <span>Envíos &amp; Andreani</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('orders')
              setSidebarOpen(false)
            }}
          >
            <FiShoppingBag size={18} />
            <span>Pedidos &amp; CRM</span>
            {orders.length > 0 && (
              <span className="nav-item-badge">{orders.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('settings')
              setSidebarOpen(false)
            }}
          >
            <FiSettings size={18} />
            <span>Configuración</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-footer-link"
            title="Abrir tienda en nueva pestaña"
          >
            <FiExternalLink size={15} />
            <span>Ver Tienda Online</span>
          </a>
          <button
            type="button"
            onClick={handleExportBackup}
            className="sidebar-footer-link"
            title="Descargar copia de seguridad JSON"
          >
            <FiDownload size={15} />
            <span>Descargar Backup JSON</span>
          </button>
          <label className="sidebar-footer-link" style={{ cursor: 'pointer' }}>
            <FiUpload size={15} />
            <span>Restaurar Copia JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              style={{ display: 'none' }}
            />
          </label>
          <button
            type="button"
            onClick={logout}
            className="sidebar-footer-link btn-sidebar-logout"
            title="Cerrar sesión"
          >
            <FiLogOut size={15} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="admin-app-main">
        {/* Top Header */}
        <header className="admin-app-header">
          <div className="header-left">
            <button
              type="button"
              className="admin-hamburger-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Abrir navegación"
            >
              {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <div className="header-title-box">
              <h2>{TAB_INFO[activeTab]?.title || 'Panel de Administración'}</h2>
              <span className="header-sub">
                {TAB_INFO[activeTab]?.sub || 'AzkabanStore • San Martín, Prov. Buenos Aires'}
              </span>
            </div>
          </div>

          <div className="header-right">
            <span className="status-indicator-pill">
              <span className="pulse-dot" /> Online
            </span>
            <a
              href={`https://wa.me/${storeConfig?.phoneRaw || '5491137934198'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-header-wa"
              title="Abrir chat de WhatsApp"
            >
              <FaWhatsapp size={15} />
              <span className="hide-on-mobile">WhatsApp Tienda</span>
            </a>
          </div>
        </header>

        {/* Tab Body */}
        <div className="admin-app-body">
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
              categories={categories}
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

          {activeTab === 'categories' && (
            <AdminCategoriesTab
              categories={categories}
              onSaveCategories={handleSaveCategories}
              products={products}
            />
          )}

          {activeTab === 'shipping' && (
            <AdminShippingTab
              storeConfig={storeConfig}
              onSaveConfig={setStoreConfig}
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
      </div>

      {/* Mobile Sticky Bottom Nav Bar (< 900px) */}
      <nav className="admin-mobile-bottom-nav">
        <button
          type="button"
          className={`bottom-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <FiLayers size={18} />
          <span>Dashboard</span>
        </button>
        <button
          type="button"
          className={`bottom-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <FiBox size={18} />
          <span>Prendas</span>
        </button>
        <button
          type="button"
          className={`bottom-nav-btn ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          <FiPackage size={18} />
          <span>Stock</span>
        </button>
        <button
          type="button"
          className={`bottom-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <div className="bottom-btn-badge-wrap">
            <FiShoppingBag size={18} />
            {orders.length > 0 && <span className="bottom-badge-dot" />}
          </div>
          <span>Pedidos</span>
        </button>
        <button
          type="button"
          className={`bottom-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FiSettings size={18} />
          <span>Ajustes</span>
        </button>
      </nav>

      {/* MODALS */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />

      <AdminBulkPriceModal
        isOpen={isBulkPriceModalOpen}
        onClose={() => setIsBulkPriceModalOpen(false)}
        products={products}
        categories={categories}
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
