import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiShoppingBag, FiSearch, FiMenu, FiX, FiLock, FiInstagram } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'
import { STORE_INFO, CATEGORIES } from '../../data/seedProducts'
import { getWhatsAppChannelUrl } from '../../utils/whatsapp'
import './Navbar.css'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { totalItems, setIsOpen: setCartOpen } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSearchOpen(false)
  }, [location.pathname])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileSearchOpen(false)
    }
  }

  const channelUrl = getWhatsAppChannelUrl()

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-header--scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Left: Mobile Toggle & Brand */}
        <div className="navbar-left">
          <button
            className="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú principal"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <Link to="/" className="navbar-brand">
            <img
              src="/logo.jpg"
              alt="AzkabanStore"
              className="navbar-brand__logo"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <div className="navbar-brand__text">
              <span className="brand-title">AZKABAN<span className="brand-title-accent">STORE</span></span>
              <span className="brand-subtitle">INDUMENTARIA</span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <form className="navbar-search-desktop" onSubmit={handleSearchSubmit}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar buzos, bermudas, marcas (BMW, Jordan, Nike)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Right: Navigation Links & Actions */}
        <div className="navbar-right">
          <nav className="desktop-nav-links">
            <Link to="/catalogo" className={`nav-item ${location.pathname === '/catalogo' ? 'active' : ''}`}>
              Catálogo
            </Link>
            <Link to="/nosotros" className={`nav-item ${location.pathname === '/nosotros' ? 'active' : ''}`}>
              Retiros & Envíos
            </Link>
          </nav>

          <div className="navbar-actions">
            {/* Mobile Search Toggle */}
            <button
              className="action-icon-btn mobile-search-btn"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Buscar productos"
            >
              <FiSearch size={20} />
            </button>

            {/* Instagram */}
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-icon-btn"
              title="Instagram @azkabanstore.indumentaria"
            >
              <FiInstagram size={19} />
            </a>

            {/* Admin */}
            <Link
              to="/admin"
              className="action-icon-btn admin-btn"
              title="Panel Administrador"
            >
              <FiLock size={18} />
            </Link>

            {/* Cart Button */}
            <button
              className="nav-cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label="Abrir carrito de compras"
            >
              <FiShoppingBag size={18} />
              <span className="cart-text">Carrito</span>
              {totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {mobileSearchOpen && (
        <div className="mobile-search-bar">
          <form className="container" onSubmit={handleSearchSubmit}>
            <div className="mobile-search-input-wrap">
              <FiSearch className="search-icon" />
              <input
                type="text"
                autoFocus
                placeholder="Buscar prenda o marca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="close-search-btn" onClick={() => setMobileSearchOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="drawer-brand">
                <img src="/logo.jpg" alt="Logo" className="drawer-logo" />
                <span>AZKABAN<strong>STORE</strong></span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar">
                <FiX size={22} />
              </button>
            </div>

            <div className="mobile-drawer-body">
              <div className="drawer-section">
                <span className="drawer-section-title">SECCIONES</span>
                <Link to="/" className="drawer-link">Inicio</Link>
                <Link to="/catalogo" className="drawer-link drawer-link--highlight">Ver Todo el Catálogo</Link>
                <Link to="/nosotros" className="drawer-link">Punto de Retiro & Envíos</Link>
              </div>

              <div className="drawer-section">
                <span className="drawer-section-title">CATEGORÍAS</span>
                <div className="drawer-categories">
                  {CATEGORIES.filter(c => c.id !== 'todos').slice(0, 8).map(c => (
                    <Link
                      key={c.id}
                      to={`/catalogo?category=${c.id}`}
                      className="drawer-cat-item"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="drawer-section">
                <span className="drawer-section-title">CONTACTO DIRECTO</span>
                <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="drawer-social-link wa">
                  <FaWhatsapp /> Canal Oficial de WhatsApp
                </a>
                <a href={STORE_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="drawer-social-link ig">
                  <FiInstagram /> @azkabanstore.indumentaria
                </a>
                <Link to="/admin" className="drawer-link admin">
                  <FiLock /> Acceso Administrador
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
