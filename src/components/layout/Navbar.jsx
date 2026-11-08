import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiShoppingBag, FiSearch, FiMenu, FiX, FiShield, FiInstagram } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'
import { STORE_INFO } from '../../data/seedProducts'
import { getWhatsAppChannelUrl } from '../../utils/whatsapp'
import './Navbar.css'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
  }, [location.pathname])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const channelUrl = getWhatsAppChannelUrl()

  return (
    <header className={`navbar-wrapper ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <img
            src="/logo.jpg"
            alt="AzkabanStore Logo"
            className="navbar-brand__logo"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <div className="navbar-brand__text">
            <span className="brand-name">AZKABAN<span className="brand-accent">STORE</span></span>
            <span className="brand-tag">INDUMENTARIA</span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <FiSearch className="navbar-search__icon" />
          <input
            type="text"
            placeholder="Buscar buzos, bermudas, remeras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Inicio
          </Link>
          <Link to="/catalogo" className={`nav-link ${location.pathname === '/catalogo' ? 'active' : ''}`}>
            Catálogo
          </Link>
          <Link to="/nosotros" className={`nav-link ${location.pathname === '/nosotros' ? 'active' : ''}`}>
            Nosotros & Retiros
          </Link>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link nav-link--channel"
            title="Canal de WhatsApp"
          >
            <FaWhatsapp className="channel-icon" /> Canal
          </a>
        </nav>

        {/* Action Buttons: Instagram, Admin, Cart, Mobile Menu */}
        <div className="navbar-actions">
          <a
            href={STORE_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn action-btn--social"
            title="Seguinos en Instagram"
          >
            <FiInstagram size={19} />
          </a>

          <Link
            to="/admin"
            className={`action-btn action-btn--admin ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
            title="Panel de Administración"
          >
            <FiShield size={18} />
          </Link>

          {/* Cart Trigger */}
          <button
            className="cart-btn"
            onClick={() => setCartOpen(true)}
            aria-label="Ver carrito"
          >
            <FiShoppingBag size={20} />
            <span className="cart-btn__label">Carrito</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <form className="mobile-menu__search" onSubmit={handleSearchSubmit}>
            <FiSearch className="navbar-search__icon" />
            <input
              type="text"
              placeholder="Buscar indumentaria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="mobile-menu__links">
            <Link to="/" className="mobile-link">
              🏠 Inicio
            </Link>
            <Link to="/catalogo" className="mobile-link">
              🔥 Catálogo Completo
            </Link>
            <Link to="/nosotros" className="mobile-link">
              📍 Ubicación, Envíos y Retiros
            </Link>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-link mobile-link--whatsapp"
            >
              <FaWhatsapp /> Canal Oficial de WhatsApp
            </a>
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-link mobile-link--instagram"
            >
              <FiInstagram /> @azkabanstore.indumentaria
            </a>
            <Link to="/admin" className="mobile-link mobile-link--admin">
              <FiShield /> Panel Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
