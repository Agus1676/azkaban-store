import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FiShoppingBag,
  FiSearch,
  FiMenu,
  FiX,
  FiLock,
  FiInstagram,
  FiUser,
  FiChevronDown,
  FiChevronRight,
  FiArrowRight,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { STORE_INFO } from '../../data/seedProducts'
import { getStoredCategories } from '../../data/categories'
import { getWhatsAppChannelUrl } from '../../utils/whatsapp'
import './Navbar.css'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems, setIsOpen: setIsCartOpen } = useCart()
  const { isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
    setIsMobileSearchOpen(false)
  }, [location])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      navigate(`/catalogo?search=${encodeURIComponent(trimmed)}`)
      setSearchQuery('')
      setIsMobileSearchOpen(false)
    }
  }

  const handleLogoClick = () => {
    setIsMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const channelUrl = getWhatsAppChannelUrl()
  const currentCategory = new URLSearchParams(location.search).get('category')
  const isCatalog = location.pathname === '/catalogo'

  const [categories, setCategories] = useState(getStoredCategories)
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleCats = () => setCategories(getStoredCategories())
    window.addEventListener('azkaban_categories_updated', handleCats)
    return () => window.removeEventListener('azkaban_categories_updated', handleCats)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoriesDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setCategoriesDropdownOpen(false)
  }, [location])

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__main-wrapper">
        {/* Top Row: Search on Left, Centered Brand Logo, Admin + Cart on Right */}
        <div className="navbar__top-row">
          <div className="navbar__top-left">
            <button
              className="navbar__mobile-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Menú"
            >
              {isMobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            <form className="navbar__search-form" onSubmit={handleSearchSubmit}>
              <FiSearch className="navbar__search-icon" size={16} />
              <input
                type="text"
                className="navbar__search-input"
                placeholder="Buscar buzos, bermudas, marcas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="navbar__search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar"
                >
                  <FiX size={14} />
                </button>
              )}
            </form>
          </div>

          <div className="navbar__top-center">
            <Link to="/" className="navbar__brand-link" onClick={handleLogoClick}>
              <div className="navbar__brand-lockup">
                <img src="/logo.png" alt="AzkabanStore" className="navbar__brand-logo-img" />
                <div className="navbar__brand-names">
                  <span className="navbar__brand-main-text">AZKABAN<span className="text-orange">STORE</span></span>
                  <span className="navbar__brand-sub-text">INDUMENTARIA DEPORTIVA</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="navbar__top-right">
            {/* Mobile Search Button */}
            <button
              type="button"
              className="navbar__icon-btn navbar__search-btn-mobile"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Buscar"
            >
              <FiSearch size={20} />
            </button>

            {/* Instagram */}
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar__icon-btn"
              title="Instagram"
            >
              <FiInstagram size={19} />
            </a>

            {/* Admin Access Link */}
            <Link
              to="/admin"
              className={`navbar__icon-btn ${isAdmin ? 'navbar__icon-btn--active' : ''}`}
              title="Panel de Administración"
            >
              <FiLock size={19} />
            </Link>

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="navbar__cart-btn"
              title="Ver Carrito"
            >
              <FiShoppingBag size={20} />
              <span className="navbar__cart-label">Carrito</span>
              {totalItems > 0 && <span className="navbar__cart-badge">{totalItems}</span>}
            </button>
          </div>
        </div>

        {/* Bottom Row: Desktop Navigation Menu */}
        <div className="navbar__bottom-row">
          <nav className="navbar__nav-list">
            <Link
              to="/"
              className={`navbar__nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              Inicio
            </Link>

            <Link
              to="/catalogo"
              className={`navbar__nav-item ${isCatalog && !currentCategory ? 'active' : ''}`}
            >
              Catálogo Completo
            </Link>

            {/* Categorías Dropdown Menu (No satura la barra) */}
            <div
              className="navbar__categories-menu"
              ref={dropdownRef}
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                type="button"
                className={`navbar__nav-item navbar__categories-btn ${
                  isCatalog && currentCategory ? 'active' : ''
                }`}
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                aria-expanded={categoriesDropdownOpen}
              >
                <span>Categorías</span>
                <FiChevronDown
                  className={`chevron-icon ${categoriesDropdownOpen ? 'open' : ''}`}
                  size={14}
                />
              </button>

              {categoriesDropdownOpen && (
                <div className="navbar__categories-dropdown">
                  <div className="dropdown-header-bar">
                    <span className="dropdown-header-tag">AZKABAN SELECTION</span>
                    <span className="dropdown-header-title">COLECCIONES</span>
                  </div>

                  <div className="dropdown-grid">
                    {categories
                      .filter((c) => c.id !== 'todos' && c.active !== false)
                      .map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/catalogo?category=${cat.id}`}
                          className={`dropdown-cat-item ${currentCategory === cat.id ? 'active' : ''}`}
                          onClick={() => setCategoriesDropdownOpen(false)}
                        >
                          <span className="cat-name">{cat.name}</span>
                          <FiChevronRight size={12} className="cat-arrow" />
                        </Link>
                      ))}
                  </div>

                  <div className="dropdown-footer">
                    <Link
                      to="/catalogo"
                      className="dropdown-all-link"
                      onClick={() => setCategoriesDropdownOpen(false)}
                    >
                      <span>Ver todo el catálogo</span>
                      <FiArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/nosotros"
              className={`navbar__nav-item ${location.pathname === '/nosotros' ? 'active' : ''}`}
            >
              Punto de Retiro & Envíos
            </Link>

            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar__nav-item navbar__nav-item--wa"
            >
              <FaWhatsapp /> Canal WhatsApp
            </a>
          </nav>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {isMobileSearchOpen && (
        <div className="navbar__mobile-search-dropdown">
          <form className="container" onSubmit={handleSearchSubmit}>
            <div className="mobile-search-wrap">
              <FiSearch size={16} className="mobile-search-icon" />
              <input
                type="text"
                autoFocus
                placeholder="Buscar buzos, bermudas, marcas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setIsMobileSearchOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="navbar__drawer-overlay" onClick={() => setIsMobileOpen(false)}>
          <div className="navbar__drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-top">
              <div className="drawer-brand">
                <img src="/logo.jpg" alt="Logo" className="drawer-logo" />
                <span>AZKABAN<strong className="text-orange">STORE</strong></span>
              </div>
              <button onClick={() => setIsMobileOpen(false)}>
                <FiX size={20} />
              </button>
            </div>

            <div className="drawer-links-scroll">
              <span className="drawer-section-heading">NAVEGACIÓN</span>
              <Link to="/" className={`drawer-link ${location.pathname === '/' ? 'active' : ''}`}>Inicio</Link>
              <Link to="/catalogo" className={`drawer-link ${isCatalog && !currentCategory ? 'active' : ''}`}>Catálogo Completo</Link>
              <Link to="/nosotros" className={`drawer-link ${location.pathname === '/nosotros' ? 'active' : ''}`}>Punto de Retiro & Envíos</Link>
              <Link to="/cambios-y-devoluciones" className={`drawer-link ${location.pathname === '/cambios-y-devoluciones' ? 'active' : ''}`}>Cambios & Devoluciones</Link>

              <span className="drawer-section-heading">CATEGORÍAS</span>
              {categories.filter(c => c.id !== 'todos' && c.active !== false).map((c) => (
                <Link
                  key={c.id}
                  to={`/catalogo?category=${c.id}`}
                  className={`drawer-sublink ${isCatalog && currentCategory === c.id ? 'active' : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span>{c.name}</span>
                </Link>
              ))}

              <span className="drawer-section-heading">CONTACTO DIRECTO</span>
              <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="drawer-link drawer-link--wa">
                <FaWhatsapp /> Canal de WhatsApp
              </a>
              <a href={STORE_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="drawer-link">
                <FiInstagram /> @azkabanstore.indumentaria
              </a>
              <Link to="/admin" className="drawer-link drawer-link--admin">
                <FiLock /> Panel de Administración
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
