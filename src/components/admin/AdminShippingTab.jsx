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
} from '../../utils/shipping'
import { formatPrice } from '../../utils/formatPrice'

const AdminShippingTab = ({ storeConfig, onSaveConfig }) => {
  const [shippingConfig, setShippingConfig] = useState(() => {
    return {
      ...DEFAULT_SHIPPING_CONFIG,
      ...(storeConfig?.shippingConfig || {}),
    }
  })

  // Simulador de Cotización en vivo para probar cualquier CP
  const [testCp, setTestCp] = useState('1650')
  const [testCartTotal, setTestCartTotal] = useState(75000)
  const [simulationResult, setSimulationResult] = useState(() => {
    return calculateShippingQuotes('1650', 75000, {
      ...DEFAULT_SHIPPING_CONFIG,
      ...(storeConfig?.shippingConfig || {}),
    })
  })

  const handleRunSimulation = (e) => {
    e?.preventDefault()
    const res = calculateShippingQuotes(testCp, Number(testCartTotal) || 0, shippingConfig)
    setSimulationResult(res)
    toast.success(`Cotización calculada para CP ${testCp}`)
  }

  const handleSave = (e) => {
    e?.preventDefault()
    onSaveConfig({
      ...storeConfig,
      shippingConfig,
    })
    toast.success('¡Tarifas y configuración de Andreani guardadas!')
  }

  const handleRestoreDefaults = () => {
    if (window.confirm('¿Restaurar las tarifas y zonas recomendadas por defecto?')) {
      setShippingConfig(DEFAULT_SHIPPING_CONFIG)
      toast.success('Tarifas por defecto restauradas')
    }
  }

  return (
    <div className="admin-content-card">
      {/* Header */}
      <div className="admin-content-card__header">
        <div>
          <h3>Logística y Calculador Automático de Envíos (Andreani & Vía Cargo)</h3>
          <p>
            Automatizá el cálculo de envíos en base al Código Postal del cliente para AMBA e Interior del país.
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
            {/* 1. Tarifas Andreani AMBA */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill" style={{ background: 'rgba(255, 85, 0, 0.12)', color: '#ff5500' }}>
                  <FiTruck size={18} />
                </div>
                <div>
                  <h4>1. Tarifas Andreani - Zona AMBA (CABA y GBA)</h4>
                  <span>Códigos Postales 1000 al 1899 (San Martín, Tres de Febrero, Vicente López, Capital, etc.)</span>
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

            {/* 2. Tarifas Andreani Interior / Nacional */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill" style={{ background: 'rgba(37, 211, 102, 0.12)', color: '#128c7e' }}>
                  <FiMapPin size={18} />
                </div>
                <div>
                  <h4>2. Tarifas Andreani - Interior y Provincias</h4>
                  <span>Buenos Aires Interior, Santa Fe, Córdoba, Cuyo, NOA, NEA y Patagonia</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Andreani a Domicilio Interior ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniInteriorHome}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniInteriorHome: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Entrega a domicilio en 48 a 96 hs</span>
                </div>

                <div className="form-group">
                  <label>Andreani Retiro en Sucursal Interior ($ ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={shippingConfig.andreaniInteriorBranch}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        andreaniInteriorBranch: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">Retiro en sucursales del interior del país</span>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '14px' }}>
                <label>Tarifa Vía Cargo a Terminal / Agencia ($ ARS)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={shippingConfig.viaCargoTerminal}
                  onChange={(e) =>
                    setShippingConfig({
                      ...shippingConfig,
                      viaCargoTerminal: Number(e.target.value) || 0,
                    })
                  }
                />
                <span className="text-xs text-muted">Despachos por encomienda de micro a terminales</span>
              </div>
            </div>

            {/* 3. Beneficio de Envío Gratis */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill" style={{ background: 'rgba(255, 193, 7, 0.15)', color: '#d97706' }}>
                  <FiAward size={18} />
                </div>
                <div>
                  <h4>3. Envío Gratis por Monto de Compra</h4>
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

            {/* 4. Conexión de API Corporativa Andreani (Opcional) */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                  <FiKey size={18} />
                </div>
                <div>
                  <h4>4. Credenciales de Cuenta Corporativa Andreani (Opcional)</h4>
                  <span>Si tenés contrato oficial con Andreani e-logistics podés cargar tus credenciales</span>
                </div>
              </div>

              <label className="switch-row" style={{ marginBottom: '14px' }}>
                <div>
                  <strong>Habilitar Integración con Contrato Andreani API</strong>
                  <span className="text-xs text-muted">
                    Usa las tarifas directas contratadas en lugar del calculador inteligente zonal
                  </span>
                </div>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={shippingConfig.andreaniApiEnabled}
                  onChange={(e) =>
                    setShippingConfig({
                      ...shippingConfig,
                      andreaniApiEnabled: e.target.checked,
                    })
                  }
                />
              </label>

              {shippingConfig.andreaniApiEnabled && (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Número de Contrato Andreani</label>
                    <input
                      type="text"
                      placeholder="Ej: 400012345"
                      value={shippingConfig.andreaniContractNumber}
                      onChange={(e) =>
                        setShippingConfig({
                          ...shippingConfig,
                          andreaniContractNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Código de Cliente</label>
                    <input
                      type="text"
                      placeholder="Ej: CL001234"
                      value={shippingConfig.andreaniCustomerCode}
                      onChange={(e) =>
                        setShippingConfig({
                          ...shippingConfig,
                          andreaniCustomerCode: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Usuario API / e-logistics</label>
                    <input
                      type="text"
                      placeholder="Usuario Andreani"
                      value={shippingConfig.andreaniUsername}
                      onChange={(e) =>
                        setShippingConfig({
                          ...shippingConfig,
                          andreaniUsername: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Contraseña API</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={shippingConfig.andreaniPassword}
                      onChange={(e) =>
                        setShippingConfig({
                          ...shippingConfig,
                          andreaniPassword: e.target.value,
                        })
                      }
                    />
                  </div>
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

        {/* Right Column: Live Postal Code Simulator */}
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
                <label>Código Postal a Simular</label>
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
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>📍 {simulationResult.zoneInfo.location}</span>
                        <span style={{ color: '#ff5500' }}>{simulationResult.zoneInfo.zone}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {simulationResult.quotes.map((q) => (
                          <div
                            key={q.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '0.8rem',
                              padding: '8px 10px',
                              background: '#12131b',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              borderRadius: '6px',
                              color: '#cbd5e1',
                            }}
                          >
                            <span>{q.icon} {q.name}</span>
                            <strong style={{ color: q.price === 0 ? '#4ade80' : '#ffffff' }}>
                              {q.price === 0 ? '¡GRATIS!' : formatPrice(q.price)}
                            </strong>
                          </div>
                        ))}
                      </div>
                      {simulationResult.isFreeEligible && (
                        <div style={{ marginTop: '10px', fontSize: '0.78rem', color: '#4ade80', fontWeight: 700, textAlign: 'center', background: 'rgba(74, 222, 128, 0.1)', padding: '6px', borderRadius: '6px' }}>
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
