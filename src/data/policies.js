// Condiciones de cambio y devolución de AzkabanStore.
// Se pueden editar desde el Panel Admin > Configuración (una condición por línea).

export const DEFAULT_RETURN_POLICY = [
  'Solamente se realizan cambios si la prenda presenta una falla.',
  'Si el producto no es el que querías, no se aceptan devoluciones.',
  'Para la devolución del dinero (en caso de no encontrar una alternativa de reemplazo), la prenda tiene que estar en perfectas condiciones, sin uso y con su etiqueta.',
]

export const DEFAULT_RETURN_POLICY_TEXT = DEFAULT_RETURN_POLICY.join('\n')

export const RETURN_POLICY_PATH = '/cambios-y-devoluciones'

// Devuelve la lista de condiciones vigentes (la guardada en el admin o la de fábrica)
export const getReturnPolicy = () => {
  try {
    const saved = localStorage.getItem('azkaban_store_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (typeof parsed.returnPolicy === 'string' && parsed.returnPolicy.trim()) {
        return parsed.returnPolicy
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      }
    }
  } catch (e) {
    console.warn('Error leyendo condiciones de cambio:', e)
  }
  return DEFAULT_RETURN_POLICY
}
