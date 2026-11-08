import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AnnouncementBar from './components/layout/AnnouncementBar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import WhatsAppFloat from './components/layout/WhatsAppFloat'
import CartDrawer from './components/cart/CartDrawer'
import HomePage from './pages/HomePage'
import './App.css'

const CatalogPage = lazy(() => import('./pages/CatalogPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

const PageLoader = () => (
  <div className="page-loader">
    <div className="spinner"></div>
    <span>Cargando AzkabanStore...</span>
  </div>
)

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#16161e',
            color: '#fff',
            border: '1px solid rgba(255, 85, 0, 0.3)',
            borderRadius: '8px',
            fontSize: '0.9rem',
          },
        }}
      />
      <AnnouncementBar />
      <Navbar />

      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/nosotros" element={<AboutPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <WhatsAppFloat />
      <CartDrawer />
    </div>
  )
}

export default App
