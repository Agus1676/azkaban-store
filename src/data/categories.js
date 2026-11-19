export const DEFAULT_CATEGORIES = [
  { id: 'todos', name: 'Todos los Productos', slug: 'todos', active: true },
  { id: 'buzos', name: 'Buzos & Hoodies', slug: 'buzos', active: true },
  { id: 'bermudas', name: 'Bermudas', slug: 'bermudas', active: true },
  { id: 'remeras', name: 'Remeras', slug: 'remeras', active: true },
  { id: 'camisetas-futbol', name: 'Camisetas de Fútbol', slug: 'camisetas-futbol', active: true },
  { id: 'camisetas-entrenamiento', name: 'Entrenamiento', slug: 'camisetas-entrenamiento', active: true },
  { id: 'camperas', name: 'Camperas', slug: 'camperas', active: true },
  { id: 'pantalones', name: 'Pantalones', slug: 'pantalones', active: true },
  { id: 'conjuntos', name: 'Conjuntos', slug: 'conjuntos', active: true },
  { id: 'shorts', name: 'Shorts', slug: 'shorts', active: true },
  { id: 'accesorios', name: 'Accesorios', slug: 'accesorios', active: true },
]

export const CATEGORIES_STORAGE_KEY = 'azkaban_categories'

export const getStoredCategories = () => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(CATEGORIES_STORAGE_KEY) : null
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Error leyendo categorías:', err)
  }
  return DEFAULT_CATEGORIES
}

export const saveStoredCategories = (categories) => {
  try {
    const safeArray = Array.isArray(categories) ? categories : DEFAULT_CATEGORIES
    if (typeof window !== 'undefined') {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(safeArray))
      window.dispatchEvent(new Event('azkaban_categories_updated'))
    }
    return true
  } catch (err) {
    console.error('Error guardando categorías:', err)
    return false
  }
}
