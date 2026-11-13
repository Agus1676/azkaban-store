// Gestor de Categorías de AzkabanStore
// Permite que la dueña cree, edite, renombre, ordene y elimine categorías
// desde el Panel de Administración de forma 100% dinámica.

export const DEFAULT_CATEGORIES = [
  { id: 'todos', name: 'Todos los Productos', slug: 'todos', emoji: '✨', active: true },
  { id: 'buzos', name: 'Buzos & Hoodies', slug: 'buzos', emoji: '🧥', active: true },
  { id: 'bermudas', name: 'Bermudas', slug: 'bermudas', emoji: '🩳', active: true },
  { id: 'remeras', name: 'Remeras', slug: 'remeras', emoji: '👕', active: true },
  { id: 'camisetas-futbol', name: 'Camisetas de Fútbol', slug: 'camisetas-futbol', emoji: '⚽', active: true },
  { id: 'camisetas-entrenamiento', name: 'Entrenamiento', slug: 'camisetas-entrenamiento', emoji: '🏃', active: true },
  { id: 'camperas', name: 'Camperas', slug: 'camperas', emoji: '🧥', active: true },
  { id: 'pantalones', name: 'Pantalones', slug: 'pantalones', emoji: '👖', active: true },
  { id: 'conjuntos', name: 'Conjuntos', slug: 'conjuntos', emoji: '🔥', active: true },
  { id: 'shorts', name: 'Shorts', slug: 'shorts', emoji: '🩳', active: true },
  { id: 'accesorios', name: 'Accesorios', slug: 'accesorios', emoji: '🧢', active: true },
]

export const CATEGORIES_STORAGE_KEY = 'azkaban_categories'

export const getStoredCategories = () => {
  try {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('Error leyendo categorías de localStorage:', e)
  }
  return DEFAULT_CATEGORIES
}

export const saveStoredCategories = (categories) => {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
    window.dispatchEvent(new Event('azkaban_categories_updated'))
  } catch (e) {
    console.warn('Error guardando categorías:', e)
  }
}
