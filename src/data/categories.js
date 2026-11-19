// Single source of truth: re-export from storeDb
import { getStoredCategories as getFromDb, saveStoredCategories as saveToDb } from '../services/storeDb'

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
export const getStoredCategories = getFromDb
export const saveStoredCategories = saveToDb
