import { useState } from 'react'
import {
  FiSettings,
  FiLock,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiCheck,
  FiShield,
  FiDollarSign,
  FiTruck,
  FiMapPin,
  FiClock,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'

const AdminSettingsTab = ({
  storeConfig,
  onSaveConfig,
  onChangePassword,
  onExportBackup,
  onImportBackup,
  onRestoreTreinta,
}) => {
  const [formData, setFormData] = useState({ ...storeConfig })
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const handleConfigSubmit = (e) => {
    e.preventDefault()
    onSaveConfig(formData)
    toast.success('¡Configuración de la tienda guardada exitosamente!')
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (!newPass.trim() || newPass.length < 4) {
      toast.error('La nueva contraseña debe tener al menos 4 caracteres')
      return
    }
    if (newPass !== confirmPass) {
      toast.error('Las nuevas contraseñas no coinciden')
      return
    }

    const res = onChangePassword(currentPass, newPass)
    if (res.success) {
      toast.success('¡Contraseña actualizada con éxito!')
      setCurrentPass('')
      setNewPass('')
      setConfirmPass('')
    } else {
      toast.error(res.error || 'Contraseña actual incorrecta')
    }
  }

  return (
    <div className="admin-content-card">
      <div className="admin-content-card__header">
        <div>
          <h3>Configuración Global de AzkabanStore</h3>
          <p>
            Modificá teléfonos de WhatsApp, punto de retiro en San Martín, redes, anuncios y seguridad.
          </p>
        </div>
      </div>

      <div className="settings-columns-layout">
        {/* Left Column: Store Details */}
        <div className="settings-main-form-box">
          <form onSubmit={handleConfigSubmit}>
            {/* Section 1: Brand & Contact */}
            <div className="settings-section">
              <h4 className="settings-section-heading">
                <FiSettings className="text-orange" />
                <span>Identidad de Marca & Contacto</span>
              </h4>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Nombre de la Tienda *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Eslogan / Subtítulo</label>
                  <input
                    type="text"
                    value={formData.slogan || ''}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>WhatsApp de Recepción de Pedidos (Sin signos ni espacios) *</label>
                  <input
                    type="text"
                    required
                    placeholder="5491137934198"
                    value={formData.phoneRaw || ''}
                    onChange={(e) => setFormData({ ...formData, phoneRaw: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>WhatsApp Display (Formato visible al cliente) *</label>
                  <input
                    type="text"
                    required
                    placeholder="+54 9 11 3793-4198"
                    value={formData.phoneDisplay || ''}
                    onChange={(e) => setFormData({ ...formData, phoneDisplay: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Email Oficial de Contacto</label>
                  <input
                    type="email"
                    placeholder="azkabanstoreonline@gmail.com"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Link Canal de WhatsApp</label>
                  <input
                    type="url"
                    placeholder="https://whatsapp.com/channel/..."
                    value={formData.whatsappChannelUrl || ''}
                    onChange={(e) => setFormData({ ...formData, whatsappChannelUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Instagram Oficial (URL o @usuario)</label>
                <input
                  type="text"
                  placeholder="https://instagram.com/azkabanstore.indumentaria"
                  value={formData.instagramUrl || ''}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Section 2: Pickup & Logistics */}
            <div className="settings-section">
              <h4 className="settings-section-heading">
                <FiMapPin className="text-orange" />
                <span>Punto de Retiro & Logística</span>
              </h4>

              <div className="form-group">
                <label>Dirección del Punto de Retiro *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. marcos zimmermann 3339..."
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Horarios de Atención *</label>
                  <input
                    type="text"
                    required
                    placeholder="Lunes a Viernes de 10:00 a 20:00 hs"
                    value={formData.hours || ''}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Empresas de Despacho</label>
                  <input
                    type="text"
                    placeholder="Andreani / Vía Cargo"
                    value={formData.shippingCarriersText || 'Andreani / Vía Cargo'}
                    onChange={(e) => setFormData({ ...formData, shippingCarriersText: e.target.value })}
                  />
                </div>
              </div>

              {/* Announcement Bar text */}
              <div className="form-group">
                <label>Texto de la Barra Superior de Anuncios (En vivo en toda la web)</label>
                <input
                  type="text"
                  placeholder="Envíos a todo el país por Andreani y Vía Cargo • Retiro en San Martín"
                  value={formData.announcementText || ''}
                  onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                />
              </div>
            </div>

            {/* Section 3: Bank Transfer Info */}
            <div className="settings-section">
              <h4 className="settings-section-heading">
                <FiDollarSign className="text-orange" />
                <span>Datos Bancarios para Transferencias</span>
              </h4>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Titular de la Cuenta</label>
                  <input
                    type="text"
                    placeholder="Azkaban Store Oficial"
                    value={formData.bankHolder || ''}
                    onChange={(e) => setFormData({ ...formData, bankHolder: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Banco / Billetera Virtual</label>
                  <input
                    type="text"
                    placeholder="Mercado Pago / Banco Santander..."
                    value={formData.bankName || ''}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Alias de Transferencia</label>
                  <input
                    type="text"
                    placeholder="AZKABAN.STORE"
                    value={formData.bankAlias || ''}
                    onChange={(e) => setFormData({ ...formData, bankAlias: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>CBU / CVU</label>
                  <input
                    type="text"
                    placeholder="00000031000..."
                    value={formData.bankCbu || ''}
                    onChange={(e) => setFormData({ ...formData, bankCbu: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary btn-save-config">
              <FiCheck size={16} />
              <span>Guardar Configuración de Tienda</span>
            </button>
          </form>
        </div>

        {/* Right Column: Security & Backups */}
        <div className="settings-side-box">
          {/* Security Form */}
          <div className="settings-card-side">
            <h4 className="settings-card-title">
              <FiShield className="text-orange" />
              <span>Seguridad del Panel</span>
            </h4>
            <p className="text-xs text-muted">
              Cambiá la contraseña de ingreso al panel de control.
            </p>

            <form onSubmit={handlePasswordSubmit} className="password-form-side">
              <div className="form-group">
                <label>Contraseña Actual</label>
                <input
                  type="password"
                  required
                  placeholder="Contraseña actual"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 4 caracteres"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="Repetir nueva contraseña"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-secondary btn-block">
                <FiLock size={15} />
                <span>Actualizar Contraseña</span>
              </button>
            </form>
          </div>

          {/* Backup Management */}
          <div className="settings-card-side">
            <h4 className="settings-card-title">
              <FiDownload className="text-orange" />
              <span>Copias de Seguridad (Backup)</span>
            </h4>
            <p className="text-xs text-muted">
              Descargá o restaurá un archivo JSON con todos los productos, pedidos y ajustes de AzkabanStore.
            </p>

            <div className="backup-actions-stack">
              <button
                type="button"
                className="btn-secondary btn-block"
                onClick={onExportBackup}
              >
                <FiDownload size={15} />
                <span>Descargar Copia JSON</span>
              </button>

              <label className="btn-secondary btn-block" style={{ cursor: 'pointer', textAlign: 'center' }}>
                <FiUpload size={15} />
                <span>Restaurar Copia JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportBackup}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                type="button"
                className="btn-danger-outline btn-block"
                onClick={onRestoreTreinta}
              >
                <FiRefreshCw size={15} />
                <span>Restaurar Catálogo Treinta</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettingsTab
