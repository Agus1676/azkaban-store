// Gestor de Categorías de AzkabanStore
// Permite que la dueña cree, edite, renombre, ordene y elimine categorías
// desde el Panel de Administración de forma 100% dinámica.

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
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((c) => {
          const { emoji, ...rest } = c
          return rest
        })
      }
    }
  } catch (e) {
    console.warn('Error leyendo categorías de localStorage:', e)
  }
  return DEFAULT_CATEGORIES
}

export const saveStoredCategories = (categories) => {
  try {
    const cleanCats = Array.isArray(categories)
      ? categories.map((c) => {
          const { emoji, ...rest } = c
          return rest
        })
      : DEFAULT_CATEGORIES
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cleanCats))
    window.dispatchEvent(new Event('azkaban_categories_updated'))
  } catch (e) {
    console.warn('Error guardando categorías:', e)
  }
}
