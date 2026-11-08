import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiSliders, FiX, FiCheck } from 'react-icons/fi'
import ProductCard from '../components/catalog/ProductCard'
import ProductDetailModal from '../components/catalog/ProductDetailModal'
import { SEED_PRODUCTS, CATEGORIES } from '../data/seedProducts'
import './CatalogPage.css'

const loadCatalogProducts = () => {
  try {
    const saved = localStorage.getItem('azkaban_products')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((p) => p && p.active !== false)
      }
    }
  } catch (e) {
    console.warn('Error reading products:', e)
  }
  return SEED_PRODUCTS.filter((p) => p.active !== false)
}

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(loadCatalogProducts)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const initialSearch = searchParams.get('search') || ''
  const initialCategory = searchParams.get('category') || 'todos'

  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState('featured') // featured, price-asc, price-desc, name-asc
  const [onlyInStock, setOnlyInStock] = useState(false)

  useEffect(() => {
    const paramCat = searchParams.get('category')
    const paramSearch = searchParams.get('search')
    if (paramCat) setSelectedCategory(paramCat)
    if (paramSearch) setSearchTerm(paramSearch)
  }, [searchParams])

  useEffect(() => {
    const handleUpdate = () => setProducts(loadCatalogProducts())
    window.addEventListener('azkaban_products_updated', handleUpdate)
    return () => window.removeEventListener('azkaban_products_updated', handleUpdate)
  }, [])

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId)
    if (catId === 'todos') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', catId)
    }
    setSearchParams(searchParams)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('todos')
    setSortBy('featured')
    setOnlyInStock(false)
    setSearchParams({})
  }

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Category filter
    if (selectedCategory && selectedCategory !== 'todos') {
      result = result.filter((p) => {
        const cat = (p.category || '').toLowerCase()
        const catName = (p.categoryName || '').toLowerCase()
        const target = selectedCategory.toLowerCase()
        return cat === target || catName.includes(target) || (target === 'bermudas' && cat.includes('bermuda')) || (target === 'buzos' && cat.includes('buzo'))
      })
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
      )
    }

    // Stock filter
    if (onlyInStock) {
      result = result.filter((p) => (typeof p.stock === 'number' ? p.stock > 0 : true))
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.priceOffer || a.price) - (b.priceOffer || b.price))
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.priceOffer || b.price) - (a.priceOffer || a.price))
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'featured') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return result
  }, [products, selectedCategory, searchTerm, onlyInStock, sortBy])

  const hasActiveFilters = searchTerm || selectedCategory !== 'todos' || onlyInStock

  return (
    <div className="catalog-page">
      <div className="container">
        {/* Page Header */}
        <div className="catalog-header">
          <span className="section-badge">CATÁLOGO ONLINE</span>
          <h1 className="section-title">
            Nuestra <span className="text-orange">Colección</span>
          </h1>
          <p className="section-subtitle">
            Explorá todas las prendas disponibles para retiro en San Martín o envíos por Andreani y Vía Cargo.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="catalog-controls">
          <div className="catalog-search-box">
            <FiSearch className="catalog-search-icon" />
            <input
              type="text"
              placeholder="Buscar por prenda, marca (BMW, Jordan, Nike, etc)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Limpiar búsqueda"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          <div className="catalog-filters-row">
            {/* Sort Select */}
            <div className="sort-box">
              <label htmlFor="sort-select">Ordenar por:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">⭐ Destacados</option>
                <option value="price-asc">💵 Menor precio</option>
                <option value="price-desc">💎 Mayor precio</option>
                <option value="name-asc">🔤 Nombre A - Z</option>
              </select>
            </div>

            {/* In Stock Toggle */}
            <label className="stock-toggle-label">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <span>Solo con stock</span>
            </label>

            {hasActiveFilters && (
              <button className="btn-clear-filters" onClick={handleClearFilters}>
                <FiX size={14} /> Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="catalog-category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products Count */}
        <div className="catalog-results-info">
          <span>
            Mostrando <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="catalog-grid">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOpenDetail={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No encontramos productos para tu búsqueda</h3>
            <p>Probá cambiando las palabras clave o seleccionando otra categoría.</p>
            <button className="btn-primary" onClick={handleClearFilters}>
              Ver todos los productos
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}

export default CatalogPage
