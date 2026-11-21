import { useState, useEffect } from 'react'
import {
  FiGrid,
  FiPackage,
  FiArchive,
  FiBarChart2,
  FiTag,
  FiSettings,
  FiMenu,
  FiX,
  FiLock,
  FiLogOut,
  FiShield,
} from 'react-icons/fi'
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

// Sub-components matching Jokers Admin
import AdminDashboardTab from '../components/admin/AdminDashboardTab'
import AdminProductsTab from '../components/admin/AdminProductsTab'
import AdminStockTab from '../components/admin/AdminStockTab'
import AdminOrdersTab from '../components/admin/AdminOrdersTab'
import AdminOrderInvoiceModal from '../components/admin/AdminOrderInvoiceModal'
import AdminReportsTab from '../components/admin/AdminReportsTab'
import AdminCategoriesTab from '../components/admin/AdminCategoriesTab'
import AdminSettingsTab from '../components/admin/AdminSettingsTab'
import AdminProductModal from '../components/admin/AdminProductModal'
import AdminBulkPriceModal from '../components/admin/AdminBulkPriceModal'

import './AdminPage.css'

const AdminPage = () => {
  const {
    isAdmin,
    login,
    logout,
    changePassword,
    lockoutRemaining,
    resetLockout,
    resetPasswordToDefault,
  } = useAuth()
  const [passwordInput, setPasswordInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'products' | 'stock' | 'reports' | 'categories' | 'settings'

  // Data states from storeDb
  const [products, setProducts] = useState(getStoredProducts)
  const [categories, setCategories] = useState(getStoredCategories)
  const [orders, setOrders] = useState(getStoredOrders)
  const [storeConfig, setStoreConfig] = useState(getStoredConfig)

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false)
  const [invoiceOrder, setInvoiceOrder] = useState(null)

  // Sync to database
  useEffect(() => {
    saveStoredProducts(products)
  }, [products])

  useEffect(() => {
    saveStoredOrders(orders)
  }, [orders])

  useEffect(() => {
    saveStoredConfig(storeConfig)
  }, [storeConfig])

  // Low stock & pending orders badge
  const lowStockCount = products.filter((p) => {
    const s = Number(p.stock) || 0
    return s > 0 && s <= 2 && p.active !== false
  }).length

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pendiente' || !o.status).length

  // Order Handlers
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
    toast.success(`Estado del pedido actualizado a: ${newStatus}`)
  }

  const handleUpdateOrderTracking = (orderId, trackingCode) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, trackingCode } : o))
    )
    toast.success('Código de seguimiento guardado')
  }

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('¿Seguro que deseás eliminar este pedido del historial?')) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      toast.success('Pedido eliminado')
    }
  }

  // Handlers
  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await login(passwordInput)
    if (res.success) {
      toast.success('¡Bienvenido al Panel Administrador!')
      setPasswordInput('')
    } else {
      toast.error(res.error || 'Contraseña incorrecta')
    }
  }

  const handleAdjustStock = (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const cur = Number(p.stock) || 0
          const updated = Math.max(0, cur + delta)
          return { ...p, stock: updated }
        }
        return p
      })
    )
  }

  const handleSetStock = (productId, newQty) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, stock: Math.max(0, newQty) }
        }
        return p
      })
    )
  }

  const handleToggleActive = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextActive = p.active === false ? true : false
          toast.success(nextActive ? 'Prenda activada en catálogo' : 'Prenda pausada en catálogo')
          return { ...p, active: nextActive }
        }
        return p
      })
    )
  }

  const handleDeleteProduct = (productId) => {
    const prod = products.find((p) => p.id === productId)
    if (window.confirm(`¿Estás seguro de que deseás eliminar "${prod?.name || 'esta prenda'}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      toast.success('Prenda eliminada del catálogo')
    }
  }

  const handleOpenNewProduct = () => {
    setEditingProduct(null)
    setIsProductModalOpen(true)
  }

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product)
    setIsProductModalOpen(true)
  }

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p))
      )
      toast.success('Prenda actualizada con éxito')
    } else {
      const newProd = {
        ...productData,
        id: `azkaban-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setProducts((prev) => [newProd, ...prev])
      toast.success('Nueva prenda agregada al catálogo')
    }
    setIsProductModalOpen(false)
    setEditingProduct(null)
  }

  const handleApplyBulkPrice = ({ targetCategory, direction, adjustmentType, amount, roundHundreds }) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (targetCategory !== 'all' && p.category !== targetCategory) return p
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
        return { ...p, price: newPrice }
      })
    )
  }

  const handleExportBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '2.0',
      products,
      categories,
      orders,
      storeConfig,
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
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
        const raw = event.target.result
        if (typeof raw !== 'string' || raw.length > 10 * 1024 * 1024) {
          toast.error('El archivo excede el tamaño máximo permitido (10MB)')
          return
        }
        const data = JSON.parse(raw)
        // Prototype pollution check
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('Estructura inválida')
        }
        delete data.__proto__
        delete data.constructor
        delete data.prototype

        // Defensive normalization & sanitization
        if (data.products && Array.isArray(data.products)) {
          const cleanProds = data.products.map(normalizeProduct).filter(Boolean)
          if (cleanProds.length > 0) setProducts(cleanProds)
        }
        if (data.categories && Array.isArray(data.categories)) {
          const cleanCats = data.categories.filter((c) => c && typeof c === 'object' && c.id && c.name)
          if (cleanCats.length > 0) setCategories(cleanCats)
        }
        if (data.orders && Array.isArray(data.orders)) {
          const cleanOrders = data.orders.filter((o) => o && typeof o === 'object' && o.id)
          setOrders(cleanOrders)
        }
        if (data.storeConfig && typeof data.storeConfig === 'object') {
          setStoreConfig((prev) => ({ ...prev, ...data.storeConfig }))
        }
        toast.success('¡Copia de seguridad validada y restaurada!')
      } catch (err) {
        console.error('Security/Validation error on backup import:', err)
        toast.error('Archivo de respaldo no seguro o con formato incorrecto')
      }
    }
    reader.readAsText(file)
  }

  const handleRestoreTreinta = () => {
    if (window.confirm('¿Deseás restaurar las 12 prendas iniciales de Treinta? Se sobreescribirán los cambios de productos.')) {
      const restored = restoreFactoryProducts()
      setProducts(restored)
      toast.success('Catálogo de Treinta restaurado exitosamente')
    }
  }

  // If not logged in, show lock screen
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', background: '#ffffff' }}>
        <div style={{ maxWidth: '420px', width: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '36px 30px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#0f172a' }}>
            <FiShield size={28} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Azkaban´s Admin
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 24px 0' }}>
            Ingresá tu contraseña de administrador para gestionar catálogo, stock, facturación y configuraciones.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {lockoutRemaining > 0 && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🛡️ Bloqueo de seguridad: {lockoutRemaining}s</span>
                <button
                  type="button"
                  onClick={resetLockout}
                  style={{ background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  Desbloquear
                </button>
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
              <input
                type="password"
                placeholder="Contraseña de administrador"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                style={{ width: '100%', height: '44px', padding: '0 14px 0 42px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', outline: 'none' }}
              />
            </div>
            <button
              type="submit"
              className="btn-black-primary"
              style={{ justifyContent: 'center', height: '44px' }}
            >
              Ingresar al Panel
            </button>
          </form>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={resetPasswordToDefault}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Restablecer acceso de administrador a valores de fábrica
            </button>
          </div>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748b' }}>
            <FiShield size={14} style={{ color: '#ff5500' }} />
            <span>Acceso administrativo protegido • Cifrado SHA-256</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin">
      {/* Mobile Top Header */}
      <header className="admin__mobile-header">
        <button
          className="admin__mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú de navegación"
        >
          <FiMenu size={22} />
        </button>
        <span className="admin__mobile-title">Azkaban´s Admin</span>
        <button
          className="admin__mobile-logout-btn"
          onClick={logout}
          title="Cerrar Sesión"
          aria-label="Cerrar sesión"
        >
          <FiLogOut size={18} />
        </button>
      </header>

      {/* Overlay Backdrop for Mobile */}
      {sidebarOpen && (
        <div
          className="admin__overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar matching Jokers Screenshot 1 & 2 */}
      <aside className={`admin__sidebar ${sidebarOpen ? 'admin__sidebar--open' : ''}`}>
        <div className="admin__sidebar-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Azkaban´s Admin</h3>
            <button
              className="admin__sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <nav className="admin__nav">
          <button
            type="button"
            className={`admin__nav-item ${activeTab === 'dashboard' ? 'admin__nav-item--active' : ''}`}
            onClick={() => {
              setActiveTab('dashboard')
              setSidebarOpen(false)
            }}
          >
            <FiGrid size={18} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`admin__nav-item ${activeTab === 'products' ? 'admin__nav-item--active' : ''}`}
            onClick={() => {
              setActiveTab('products')
              setSidebarOpen(false)
            }}
          >
            <FiPackage size={18} />
            <span>Productos &amp; Combos</span>
            <span className="admin__nav-badge">{products.length}</span>
          </button>

          <button
            type="button"
            className={`admin__nav-item ${activeTab === 'stock' ? 'admin__nav-item--active' : ''}`}
            onClick={() => {
              setActiveTab('stock')
              setSidebarOpen(false)
            }}
          >
            <FiArchive size={18} />
            <span>Control de Stock</span>
            {lowStockCount > 0 && (
              <span className="admin__nav-badge admin__nav-badge--warning">{lowStockCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin__nav-item ${activeTab === 'orders' ? 'admin__nav-item--active' : ''}`}
            onClick={() => {
              setActiveTab('orders')
              setSidebarOpen(false)
            }}
          >
            <FiShoppingBag size={18} />
            <span>Pedidos de Clientes</span>
            {pendingOrdersCount > 0 ? (
              <span className="admin__nav-badge admin__nav-badge--warning">{pendingOrdersCount}</span>
            ) : (
              <span className="admin__nav-badge">{orders.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin__nav-item ${activeTab === 'reports' ? 'admin__nav-item--active' : ''}`}
            onClick={() => {
              setActiveTab('reports')
              setSidebarOpen(false)
            }}
          >
            <FiBarChart2 size={18} />
            <span>Reportes de Ventas</span>
          </button>

          <button
            type="button"
            className={`admin__nav-item ${activeTab === 'categories' ? 'admin__nav-item--active' : ''}`}
            onClick={() => {
              setActiveTab('categories')
              setSidebarOpen(false)
            }}
          >
            <FiTag size={18} />
            <span>Categorías</span>
            <span className="admin__nav-badge">{categories.length}</span>
          </button>

          <button
            type="button"
            className={`admin__nav-item ${activeTab === 'settings' ? 'admin__nav-item--active' : ''}`}
            onClick={() => {
              setActiveTab('settings')
              setSidebarOpen(false)
            }}
          >
            <FiSettings size={18} />
            <span>Configuración &amp; Banners</span>
          </button>
        </nav>

        {/* Sidebar Footer with Developer Signature */}
        <div className="admin__sidebar-footer">
          <p className="admin-footer-credit">
            Desarrollado por{' '}
            <a href="https://agustinpollan.vercel.app/" target="_blank" rel="noopener noreferrer">
              Agustín Pollán ↗
            </a>
          </p>
          <button type="button" className="admin__logout-btn" onClick={logout}>
            <FiLogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin__content">
        {activeTab === 'dashboard' && (
          <AdminDashboardTab
            products={products}
            orders={orders}
            onNavigateTab={(tab) => setActiveTab(tab)}
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
            onDeleteProduct={handleDeleteProduct}
            onToggleActive={handleToggleActive}
            onAdjustStock={handleAdjustStock}
            onOpenBulkPrice={() => setIsBulkPriceModalOpen(true)}
            onExportBackup={handleExportBackup}
            onRestoreTreinta={handleRestoreTreinta}
          />
        )}

        {activeTab === 'stock' && (
          <AdminStockTab
            products={products}
            onAdjustStock={handleAdjustStock}
            onSetStock={handleSetStock}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersTab
            orders={orders}
            storeConfig={storeConfig}
            onUpdateStatus={handleUpdateOrderStatus}
            onUpdateTracking={handleUpdateOrderTracking}
            onDeleteOrder={handleDeleteOrder}
            onOpenInvoice={(order) => setInvoiceOrder(order)}
          />
        )}

        {activeTab === 'reports' && (
          <AdminReportsTab orders={orders} />
        )}

        {activeTab === 'categories' && (
          <AdminCategoriesTab
            categories={categories}
            products={products}
            onSaveCategories={(updated) => {
              setCategories(updated)
              saveStoredCategories(updated)
            }}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsTab
            storeConfig={storeConfig}
            onSaveConfig={(updated) => {
              setStoreConfig(updated)
              saveStoredConfig(updated)
            }}
            onChangePassword={changePassword}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onRestoreTreinta={handleRestoreTreinta}
          />
        )}
      </main>

      {/* Overlay Backdrop for Mobile */}
      {sidebarOpen && (
        <div className="admin__overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Modals */}
      {isProductModalOpen && (
        <AdminProductModal
          isOpen={isProductModalOpen}
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setIsProductModalOpen(false)
            setEditingProduct(null)
          }}
          onSave={handleSaveProduct}
        />
      )}

      {isBulkPriceModalOpen && (
        <AdminBulkPriceModal
          isOpen={isBulkPriceModalOpen}
          products={products}
          categories={categories}
          onClose={() => setIsBulkPriceModalOpen(false)}
          onApplyBulkUpdate={handleApplyBulkPrice}
        />
      )}

      {invoiceOrder && (
        <AdminOrderInvoiceModal
          isOpen={!!invoiceOrder}
          order={invoiceOrder}
          storeConfig={storeConfig}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  )
}

export default AdminPage
