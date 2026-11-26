import { useState } from 'react'
import {
  FiTruck,
  FiMapPin,
  FiDollarSign,
  FiCheck,
  FiHelpCircle,
  FiKey,
  FiPlay,
  FiRefreshCw,
  FiAward,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import {
  DEFAULT_SHIPPING_CONFIG,
  calculateShippingQuotes,
  resolveZoneByPostalCode,
  SHIPPING_ZONES,
} from '../../utils/shipping'
import { formatPrice } from '../../utils/formatPrice'

const AdminShippingTab = ({ storeConfig, onSaveConfig }) => {
  const [shippingConfig, setShippingConfig] = useState(() => {
    return {
      ...DEFAULT_SHIPPING_CONFIG,
      ...(storeConfig?.shippingConfig || {}),
    }
  })

  // Simulador de Cotización en vivo para probar cualquier CP o Zona
  const [testCp, setTestCp] = useState('1650')
  const [testZoneKey, setTestZoneKey] = useState('amba')
  const [testCartTotal, setTestCartTotal] = useState(75000)
  const [simulationResult, setSimulationResult] = useState(() => {
    return calculateShippingQuotes('1650', 75000, {
      ...DEFAULT_SHIPPING_CONFIG,
      ...(storeConfig?.shippingConfig || {}),
    })
  })

  const handleRunSimulation = (e) => {
    e?.preventDefault()
    const input = testCp.trim().length >= 3 ? testCp.trim() : testZoneKey
    const res = calculateShippingQuotes(input, Number(testCartTotal) || 0, shippingConfig)
    setSimulationResult(res)
    toast.success(`Cotización calculada para ${input}`)
  }

  const handleSave = (e) => {
    e?.preventDefault()
    onSaveConfig({
      ...storeConfig,
      shippingConfig,
      andreaniAmbaHome: shippingConfig.andreaniAmbaHome,
      andreaniAmbaBranch: shippingConfig.andreaniAmbaBranch,
      andreaniBsasInteriorHome: shippingConfig.andreaniBsasInteriorHome,
      andreaniBsasInteriorBranch: shippingConfig.andreaniBsasInteriorBranch,
      andreaniCentroHome: shippingConfig.andreaniCentroHome,
      andreaniCentroBranch: shippingConfig.andreaniCentroBranch,
      andreaniCuyoNorteHome: shippingConfig.andreaniCuyoNorteHome,
      andreaniCuyoNorteBranch: shippingConfig.andreaniCuyoNorteBranch,
      andreaniPatagoniaHome: shippingConfig.andreaniPatagoniaHome,
      andreaniPatagoniaBranch: shippingConfig.andreaniPatagoniaBranch,
      freeShippingThreshold: shippingConfig.freeShippingMinAmount,
      freeShippingEnabled: shippingConfig.freeShippingEnabled,
    })
    toast.success('¡Tarifas y zonificación de Andreani guardadas con éxito!')
  }

  const handleRestoreDefaults = () => {
    if (window.confirm('¿Restaurar las tarifas y zonas oficiales recomendadas por defecto?')) {
      setShippingConfig(DEFAULT_SHIPPING_CONFIG)
      toast.success('Tarifas por defecto restauradas')
    }
  }

  return (
    <div className="admin-content-card">
      {/* Header */}
      <div className="admin-content-card__header">
        <div>
          <h3>Logística y Calculador Automático de Envíos (Andreani Express)</h3>
          <p>
            Configurá las tarifas de cada zona del país. El carrito y la ficha del producto sumarán el envío al total automáticamente.
          </p>
        </div>
        <div className="header-buttons">
          <button className="btn-secondary" onClick={handleRestoreDefaults}>
            <FiRefreshCw size={15} />
            <span>Restaurar Valores</span>
          </button>
          <button className="btn-primary" onClick={handleSave}>
            <FiCheck size={16} />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>

      <div className="settings-columns-layout">
        {/* Left Column: Rates & Free shipping settings */}
        <div className="settings-main-form-box">
          <form onSubmit={handleSave}>
            {/* 1. Zona AMBA */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill" style={{ background: 'rgba(255, 85, 0, 0.12)', color: '#ff5500' }}>
                  <FiTruck size={18} />
                </div>
                <div>
                  <h4>1. Zona AMBA (CABA y Gran Buenos Aires)</h4>
                  <span>CP 1000 al 1899 (San Martín, Tres de Febrero, Vicente López, Capital, Zona Sur, Oeste, Norte)</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Andreani a Domicilio AMBA ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniAmbaHome}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniAmbaHome: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Entrega puerta a puerta en 24 a 48 hs</span>
                </div>

                <div className="form-group">
                  <label>Andreani Retiro en Sucursal AMBA ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniAmbaBranch}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniAmbaBranch: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Retiro en sucursal oficial Andreani</span>
                </div>
              </div>
            </div>

            {/* 2. Zona Buenos Aires Interior */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#2563eb' }}>
                  <FiMapPin size={18} />
                </div>
                <div>
                  <h4>2. Zona Buenos Aires Interior (Costa Atlántica &amp; Prov.)</h4>
                  <span>Mar del Plata, Bahía Blanca, Tandil, San Nicolás, Pergamino, Junín, etc.</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Andreani a Domicilio Bs. As. Interior ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniBsasInteriorHome ?? 7900}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniBsasInteriorHome: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Entrega a domicilio en 48 a 72 hs</span>
                </div>

                <div className="form-group">
                  <label>Andreani Retiro en Sucursal Bs. As. Interior ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniBsasInteriorBranch ?? 6200}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniBsasInteriorBranch: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Retiro en sucursales del interior bonaerense</span>
                </div>
              </div>
            </div>

            {/* 3. Región Centro (Córdoba & Santa Fe) */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}>
                  <FiTruck size={18} />
                </div>
                <div>
                  <h4>3. Región Centro (Córdoba y Santa Fe)</h4>
                  <span>Córdoba Capital, Villa María, Río Cuarto, Rosario, Santa Fe Capital, Rafaela, etc.</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Andreani a Domicilio Centro ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniCentroHome ?? 8500}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniCentroHome: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Entrega a domicilio en 48 a 72 hs</span>
                </div>

                <div className="form-group">
                  <label>Andreani Retiro en Sucursal Centro ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniCentroBranch ?? 6700}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniCentroBranch: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Retiro en sucursales de Córdoba y Santa Fe</span>
                </div>
              </div>
            </div>

            {/* 4. Cuyo, NOA y NEA */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill" style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#d97706' }}>
                  <FiMapPin size={18} />
                </div>
                <div>
                  <h4>4. Cuyo, NOA y NEA (Mendoza, Salta, Tucumán, etc.)</h4>
                  <span>Mendoza, San Juan, San Luis, Tucumán, Salta, Jujuy, Chaco, Corrientes, Misiones, Entre Ríos</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Andreani a Domicilio Cuyo/Norte ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniCuyoNorteHome ?? 9400}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniCuyoNorteHome: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Plazo 3 a 5 días hábiles</span>
                </div>

                <div className="form-group">
                  <label>Andreani Retiro en Sucursal Cuyo/Norte ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniCuyoNorteBranch ?? 7400}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniCuyoNorteBranch: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Retiro en sucursal oficial</span>
                </div>
              </div>
            </div>

            {/* 5. Patagonia */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#7c3aed' }}>
                  <FiTruck size={18} />
                </div>
                <div>
                  <h4>5. Patagonia Argentina y Tierra del Fuego</h4>
                  <span>Neuquén, Bariloche, Río Negro, Chubut, Comodoro Rivadavia, Santa Cruz, Ushuaia</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Andreani a Domicilio Patagonia ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniPatagoniaHome ?? 11800}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniPatagoniaHome: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Plazo 4 a 6 días hábiles</span>
                </div>

                <div className="form-group">
                  <label>Andreani Retiro en Sucursal Patagonia ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniPatagoniaBranch ?? 9200}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniPatagoniaBranch: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Retiro en sucursal patagónica</span>
                </div>
              </div>
            </div>

            {/* 6. Beneficio de Envío Gratis */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill" style={{ background: 'rgba(255, 193, 7, 0.15)', color: '#d97706' }}>
                  <FiAward size={18} />
                </div>
                <div>
                  <h4>6. Envío Gratis por Monto de Compra</h4>
                  <span>Incentivá a tus clientes a comprar más prendas bonificando el costo del envío</span>
                </div>
              </div>

              <label className="switch-row" style={{ marginBottom: '14px' }}>
                <div>
                  <strong>Activar Envío Gratis automático por Andreani</strong>
                  <span className="text-xs text-muted">
                    Si el carrito supera el monto mínimo, el envío por Andreani pasa automáticamente a $0 (GRATIS)
                  </span>
                </div>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={shippingConfig.freeShippingEnabled}
                  onChange={(e) =>
                    setShippingConfig({
                      ...shippingConfig,
                      freeShippingEnabled: e.target.checked,
                    })
                  }
                />
              </label>

              {shippingConfig.freeShippingEnabled && (
                <div className="form-group">
                  <label>Monto Mínimo de Compra para Envío Gratis ($ ARS) *</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={shippingConfig.freeShippingMinAmount}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        freeShippingMinAmount: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">
                    Ejemplo: Con $120.000, los clientes que compren 3 o 4 buzos tendrán el envío bonificado.
                  </span>
                </div>
              )}
            </div>

            <div className="settings-submit-row">
              <button type="submit" className="btn-primary btn-save-config">
                <FiCheck size={18} />
                <span>Guardar Tarifas y Configuración</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Postal Code / Zone Simulator */}
        <div className="settings-side-box">
          <div className="settings-side-card">
            <div className="settings-card-section__header">
              <div className="settings-icon-pill">
                <FiPlay size={18} />
              </div>
              <div>
                <h4>Simulador de Envíos en Vivo</h4>
                <span>Probá cómo cotiza la web para cualquier cliente</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div className="form-group">
                <label>Seleccionar Región / Zona</label>
                <select
                  value={testZoneKey}
                  onChange={(e) => {
                    setTestZoneKey(e.target.value)
                    setTestCp('')
                  }}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  {SHIPPING_ZONES.map((z) => (
                    <option key={z.key} value={z.key}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>O ingresar Código Postal (CP)</label>
                <input
                  type="text"
                  maxLength="5"
                  placeholder="ej: 1650 (San Martín) o 2000 (Rosario)"
                  value={testCp}
                  onChange={(e) => setTestCp(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className="form-group">
                <label>Monto de Compra de Prueba ($)</label>
                <input
                  type="number"
                  step="5000"
                  value={testCartTotal}
                  onChange={(e) => setTestCartTotal(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleRunSimulation}
              >
                Probar Cotización
              </button>

              {simulationResult && (
                <div style={{ background: '#181924', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '14px', marginTop: '6px' }}>
                  {simulationResult.zoneInfo ? (
                    <>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <FiMapPin size={14} style={{ color: '#ff5500' }} />
                          {simulationResult.zoneInfo.location}
                        </span>
                        <span style={{ color: '#ff5500', fontWeight: '800' }}>{simulationResult.zoneInfo.zone}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {simulationResult.quotes.map((q) => (
                          <div
                            key={q.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '0.82rem',
                              padding: '10px 12px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              color: '#1e293b',
                            }}
                          >
                            <span>{q.icon} {q.name} ({q.estimatedDays})</span>
                            <strong style={{ color: q.price === 0 ? '#15803d' : '#0f172a' }}>
                              {q.price === 0 ? '¡GRATIS!' : formatPrice(q.price)}
                            </strong>
                          </div>
                        ))}
                      </div>
                      {simulationResult.isFreeEligible && (
                        <div style={{ marginTop: '10px', fontSize: '0.78rem', color: '#15803d', fontWeight: 700, textAlign: 'center', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '7px', borderRadius: '6px' }}>
                          🎉 ¡Aplica Envío Andreani Gratis!
                        </div>
                      )}
                    </>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>
                      {simulationResult.error}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminShippingTab
