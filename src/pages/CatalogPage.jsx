import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
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

  const initialSearch = searchParams.get('search') || searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'todos'

  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState('featured') // featured, price-asc, price-desc, name-asc
  const [onlyInStock, setOnlyInStock] = useState(false)

  useEffect(() => {
    const paramCat = searchParams.get('category')
    const paramSearch = searchParams.get('search') || searchParams.get('q')
    if (paramCat) setSelectedCategory(paramCat)
    if (paramSearch !== null) setSearchTerm(paramSearch)
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
        return (
          cat === target ||
          catName.includes(target) ||
          (target === 'bermudas' && cat.includes('bermuda')) ||
          (target === 'buzos' && cat.includes('buzo'))
        )
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
    <div className="catalog-view">
      <div className="container">
        {/* Breadcrumb & Header */}
        <div className="catalog-top-header">
          <div className="catalog-heading">
            <h1 className="catalog-title">Catálogo de Indumentaria</h1>
            <span className="catalog-count-pill">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'prenda' : 'prendas'}
            </span>
          </div>

          {/* Search Input */}
          <div className="catalog-search-wrapper">
            <FiSearch className="catalog-search-icon" />
            <input
              type="text"
              placeholder="Buscar por prenda, modelo o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="catalog-clear-btn" onClick={() => setSearchTerm('')} aria-label="Limpiar">
                <FiX size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="catalog-categories-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`cat-tab ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter Toolbar (Sort & Stock) */}
        <div className="catalog-toolbar">
          <div className="toolbar-left">
            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <span>Solo prendas con stock</span>
            </label>

            {hasActiveFilters && (
              <button className="clear-filters-link" onClick={handleClearFilters}>
                <FiX size={13} /> Limpiar filtros
              </button>
            )}
          </div>

          <div className="toolbar-right">
            <label htmlFor="catalog-sort">Ordenar:</label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="catalog-sort-select"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name-asc">Nombre A - Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid (2 columns on mobile, 4 on desktop) */}
        {filteredProducts.length > 0 ? (
          <div className="catalog-products-grid">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOpenDetail={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <h3>No encontramos prendas con esos filtros</h3>
            <p>Probá buscando con otro término o seleccioná otra categoría.</p>
            <button className="btn-primary" onClick={handleClearFilters}>
              Ver todas las prendas
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
