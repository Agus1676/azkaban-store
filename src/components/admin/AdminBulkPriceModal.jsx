import { useState } from 'react'
import { FiTrendingUp, FiX, FiCheck, FiInfo } from 'react-icons/fi'
import { CATEGORIES } from '../../data/seedProducts'
import { formatPrice } from '../../utils/formatPrice'
import toast from 'react-hot-toast'

const AdminBulkPriceModal = ({ isOpen, onClose, products, onApplyBulkUpdate }) => {
  const [targetCategory, setTargetCategory] = useState('all')
  const [direction, setDirection] = useState('increase') // 'increase' | 'decrease'
  const [adjustmentType, setAdjustmentType] = useState('percent') // 'percent' | 'fixed'
  const [amount, setAmount] = useState('10')
  const [roundHundreds, setRoundHundreds] = useState(true)

  if (!isOpen) return null

  // Calculate target items count
  const targetProducts = targetCategory === 'all'
    ? products
    : products.filter((p) => p.category === targetCategory)

  // Simulation on a standard item of $35.000
  const sampleOriginal = 35000
  const numAmount = Number(amount) || 0
  let sampleNew = sampleOriginal

  if (adjustmentType === 'percent') {
    const factor = direction === 'increase' ? 1 + numAmount / 100 : Math.max(0, 1 - numAmount / 100)
    sampleNew = sampleOriginal * factor
  } else {
    sampleNew = direction === 'increase' ? sampleOriginal + numAmount : Math.max(0, sampleOriginal - numAmount)
  }

  if (roundHundreds) {
    sampleNew = Math.round(sampleNew / 100) * 100
  }

  const handleApply = (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) {
      toast.error('Ingresá un valor mayor a 0')
      return
    }

    if (
      !window.confirm(
        `¿Confirmás aplicar este ajuste a las ${targetProducts.length} prendas seleccionadas?`
      )
    ) {
      return
    }

    onApplyBulkUpdate({
      targetCategory,
      direction,
      adjustmentType,
      amount: Number(amount),
      roundHundreds,
    })

    toast.success(`¡Precios actualizados en ${targetProducts.length} prendas!`)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-bulk-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-header__title">
            <FiTrendingUp className="text-orange" size={20} />
            <h3>Ajuste Masivo de Precios</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleApply} className="admin-bulk-form">
          <p className="admin-bulk-desc">
            Aumentá o actualizá los precios de todo el catálogo o de una categoría específica en segundos.
          </p>

          {/* 1. Categoría Objetivo */}
          <div className="form-group">
            <label>Aplicar a:</label>
            <select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
            >
              <option value="all">Todas las prendas ({products.length} productos)</option>
              {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => {
                const count = products.filter((p) => p.category === c.id).length
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} ({count} productos)
                  </option>
                )
              })}
            </select>
          </div>

          {/* 2. Dirección: Aumento o Descuento */}
          <div className="form-group">
            <label>Tipo de Operación:</label>
            <div className="segmented-control">
              <button
                type="button"
                className={`segmented-btn ${direction === 'increase' ? 'active' : ''}`}
                onClick={() => setDirection('increase')}
              >
                📈 Aumentar Precios (+)
              </button>
              <button
                type="button"
                className={`segmented-btn ${direction === 'decrease' ? 'active' : ''}`}
                onClick={() => setDirection('decrease')}
              >
                📉 Descontar Precios (-)
              </button>
            </div>
          </div>

          {/* 3. Tipo y Valor */}
          <div className="form-grid-2">
            <div className="form-group">
              <label>Modo de Cálculo:</label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
              >
                <option value="percent">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ($ ARS)</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                {adjustmentType === 'percent' ? 'Porcentaje a aplicar (%)' : 'Monto en pesos ($ ARS)'}
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={adjustmentType === 'percent' ? 'Ej: 10' : 'Ej: 2000'}
              />
            </div>
          </div>

          {/* Checkbox Redondear */}
          <div className="form-checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={roundHundreds}
                onChange={(e) => setRoundHundreds(e.target.checked)}
              />
              <span>Redondear precios finales a centenas (ej: $38.480 ➔ $38.500)</span>
            </label>
          </div>

          {/* Preview Card */}
          <div className="bulk-preview-box">
            <div className="bulk-preview-header">
              <FiInfo className="text-orange" />
              <span>Simulación de Ejemplo:</span>
            </div>
            <div className="bulk-preview-values">
              <div>
                <span className="text-xs text-muted">Precio actual:</span>
                <strong>{formatPrice(sampleOriginal)}</strong>
              </div>
              <span className="preview-arrow">➔</span>
              <div>
                <span className="text-xs text-muted">Nuevo precio:</span>
                <strong className="text-orange">{formatPrice(sampleNew)}</strong>
              </div>
              <div className="preview-diff">
                <span className={direction === 'increase' ? 'diff-tag-pos' : 'diff-tag-neg'}>
                  {direction === 'increase' ? '+' : '-'}
                  {adjustmentType === 'percent' ? `${amount}%` : formatPrice(numAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="admin-modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              <FiCheck size={16} />
              <span>Aplicar a {targetProducts.length} Prendas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminBulkPriceModal
