import { useState } from 'react'
import {
  FiTrendingUp,
  FiX,
  FiCheck,
  FiInfo,
  FiLayers,
  FiPercent,
  FiDollarSign,
  FiArrowRight,
} from 'react-icons/fi'
import { CATEGORIES } from '../../data/seedProducts'
import { formatPrice } from '../../utils/formatPrice'
import toast from 'react-hot-toast'

const AdminBulkPriceModal = ({ isOpen, onClose, products, onApplyBulkUpdate, categories = [] }) => {
  const [targetCategory, setTargetCategory] = useState('all')
  const [direction, setDirection] = useState('increase') // 'increase' | 'decrease'
  const [adjustmentType, setAdjustmentType] = useState('percent') // 'percent' | 'fixed'
  const [amount, setAmount] = useState('10')
  const [roundHundreds, setRoundHundreds] = useState(true)

  const availableCategories = (categories && categories.length > 0 ? categories : CATEGORIES).filter(
    (c) => c.id !== 'todos'
  )

  if (!isOpen) return null

  // Target count
  const targetProducts =
    targetCategory === 'all'
      ? products
      : products.filter((p) => p.category === targetCategory)

  // Simulation on a standard $35.000 item
  const sampleOriginal = 35000
  const numAmount = Number(amount) || 0
  let sampleNew = sampleOriginal

  if (adjustmentType === 'percent') {
    const factor =
      direction === 'increase'
        ? 1 + numAmount / 100
        : Math.max(0, 1 - numAmount / 100)
    sampleNew = sampleOriginal * factor
  } else {
    sampleNew =
      direction === 'increase'
        ? sampleOriginal + numAmount
        : Math.max(0, sampleOriginal - numAmount)
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
        {/* Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-header__title">
            <div className="modal-header-icon-pill">
              <FiTrendingUp size={20} />
            </div>
            <div>
              <h3>Ajuste Masivo de Precios</h3>
              <span className="modal-header-sub">Actualización global de catálogo</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleApply} className="admin-bulk-form">
          <p className="admin-bulk-desc">
            Aumentá o actualizá los precios de todo el catálogo o de una categoría específica en segundos. Los cambios se sincronizan en vivo en la tienda.
          </p>

          {/* 1. Categoría Objetivo */}
          <div className="form-group">
            <label htmlFor="bulk-target-cat">Aplicar cambios a:</label>
            <div className="select-input-container">
              <FiLayers className="input-field-icon" />
              <select
                id="bulk-target-cat"
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
              >
                <option value="all">Todas las prendas ({products.length} productos)</option>
                {availableCategories.map((c) => {
                  const count = products.filter((p) => p.category === c.id).length
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({count} productos)
                    </option>
                  )
                })}
              </select>
            </div>
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
              <label htmlFor="bulk-mode">Modo de Cálculo:</label>
              <select
                id="bulk-mode"
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
              >
                <option value="percent">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ($ ARS)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bulk-amount">
                {adjustmentType === 'percent' ? 'Porcentaje a aplicar (%)' : 'Monto en pesos ($ ARS)'}
              </label>
              <div className="input-with-badge">
                <input
                  id="bulk-amount"
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={adjustmentType === 'percent' ? 'Ej: 10' : 'Ej: 2000'}
                />
                <span className="input-suffix-tag">
                  {adjustmentType === 'percent' ? '%' : '$'}
                </span>
              </div>
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
              <span>
                Redondear precios finales a centenas (ej: <code>$38.480</code> ➔ <code>$38.500</code>)
              </span>
            </label>
          </div>

          {/* Simulation Preview Card */}
          <div className="bulk-preview-box">
            <div className="bulk-preview-header">
              <FiInfo className="text-orange" size={16} />
              <span>Simulación de Ejemplo en Vivo</span>
            </div>
            <div className="bulk-preview-values">
              <div className="preview-val-col">
                <span className="preview-label">Precio Actual:</span>
                <span className="preview-price-old">{formatPrice(sampleOriginal)}</span>
              </div>

              <div className="preview-arrow-box">
                <FiArrowRight size={18} />
              </div>

              <div className="preview-val-col">
                <span className="preview-label">Nuevo Precio:</span>
                <span className="preview-price-new">{formatPrice(sampleNew)}</span>
              </div>

              <div className="preview-diff-box">
                <span className={direction === 'increase' ? 'diff-tag-pos' : 'diff-tag-neg'}>
                  {direction === 'increase' ? '+' : '-'}
                  {adjustmentType === 'percent' ? `${amount}%` : formatPrice(numAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
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
