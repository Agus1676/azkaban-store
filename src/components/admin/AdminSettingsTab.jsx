import { useState } from 'react'
import {
  FiSave,
  FiLock,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiShield,
  FiDollarSign,
  FiMapPin,
  FiFileText,
  FiMessageSquare,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { DEFAULT_RETURN_POLICY_TEXT } from '../../data/policies'

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
    toast.success('¡Configuración guardada exitosamente!')
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (!newPass.trim() || newPass.length < 4) {
      toast.error('La nueva contraseña debe tener al menos 4 caracteres')
      return
    }
    if (newPass !== confirmPass) {
      toast.error('Las contraseñas no coinciden')
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
    <div className="admin-page-container">
      {/* Top Banner Header */}
      <div className="admin-section-header">
        <div>
          <h2>Configuración de la Tienda</h2>
          <p>
            Gestioná los datos comerciales, canales de WhatsApp, punto de retiro, seguridad y copias de seguridad.
          </p>
        </div>
        <button
          type="button"
          onClick={handleConfigSubmit}
          className="btn-admin-primary"
        >
          <FiSave size={16} />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="settings-grid-layout">
        {/* Main Column */}
        <div className="settings-main-column">
          <form onSubmit={handleConfigSubmit}>
            {/* Card 1: Identidad & Canales */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="card-title-group">
                  <FiMessageSquare className="card-header-icon" />
                  <div>
                    <h3>Identidad de Marca & Canales de Contacto</h3>
                    <p>Datos visibles para los clientes y líneas directas de atención</p>
                  </div>
                </div>
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="cfg-name">Nombre de la Tienda</label>
                  <input
                    id="cfg-name"
                    type="text"
                    required
                    placeholder="AzkabanStore"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="cfg-slogan">Eslogan o Subtítulo</label>
                  <input
                    id="cfg-slogan"
                    type="text"
                    placeholder="Indumentaria Deportiva y Urbana"
                    value={formData.slogan || ''}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="cfg-phone-raw">WhatsApp para Pedidos (Código país + número)</label>
                  <input
                    id="cfg-phone-raw"
                    type="text"
                    required
                    placeholder="5491137934198"
                    value={formData.phoneRaw || ''}
                    onChange={(e) => setFormData({ ...formData, phoneRaw: e.target.value })}
                  />
                  <span className="field-hint">Sin espacios ni símbolos (+). Ej: 5491137934198</span>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="cfg-phone-disp">WhatsApp Visible al Cliente</label>
                  <input
                    id="cfg-phone-disp"
                    type="text"
                    required
                    placeholder="+54 9 11 3793-4198"
                    value={formData.phoneDisplay || ''}
                    onChange={(e) => setFormData({ ...formData, phoneDisplay: e.target.value })}
                  />
                  <span className="field-hint">Formato para el header y footer</span>
                </div>
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="cfg-email">Email Oficial de la Tienda</label>
                  <input
                    id="cfg-email"
                    type="email"
                    placeholder="azkabanstoreonline@gmail.com"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="cfg-channel">Enlace del Canal Oficial de WhatsApp</label>
                  <input
                    id="cfg-channel"
                    type="url"
                    placeholder="https://whatsapp.com/channel/..."
                    value={formData.channelUrl || ''}
                    onChange={(e) => setFormData({ ...formData, channelUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="cfg-insta">Instagram Oficial (Enlace o @usuario)</label>
                <input
                  id="cfg-insta"
                  type="text"
                  placeholder="https://instagram.com/azkabanstore.indumentaria"
                  value={formData.instagramUrl || ''}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Card 2: Punto de Retiro & Anuncio */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="card-title-group">
                  <FiMapPin className="card-header-icon" />
                  <div>
                    <h3>Punto de Retiro & Logística</h3>
                    <p>Ubicación física para retiro en el local y avisos en el sitio</p>
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="cfg-address">Dirección Física del Punto de Retiro</label>
                <input
                  id="cfg-address"
                  type="text"
                  required
                  placeholder="Dr. marcos zimmermann 3339 (Entre av JM campos y pasaje 86)"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <span className="field-hint">Visible en la página /nosotros y al seleccionar retiro en local</span>
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="cfg-hours">Horarios de Atención y Despacho</label>
                  <input
                    id="cfg-hours"
                    type="text"
                    required
                    placeholder="Lunes a Viernes de 10:00 a 20:00 hs"
                    value={formData.hours || ''}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="cfg-carriers">Empresas de Logística Asociadas</label>
                  <input
                    id="cfg-carriers"
                    type="text"
                    placeholder="Andreani / Vía Cargo"
                    value={formData.shippingCarriersText || 'Andreani / Vía Cargo'}
                    onChange={(e) => setFormData({ ...formData, shippingCarriersText: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="cfg-announcement">Barra Superior de Anuncios (En vivo en toda la web)</label>
                <input
                  id="cfg-announcement"
                  type="text"
                  placeholder="Envíos a todo el país por Andreani y Vía Cargo • Retiro en San Martín"
                  value={formData.announcementText || ''}
                  onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                />
              </div>
            </div>

            {/* Card 3: Datos Bancarios */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="card-title-group">
                  <FiDollarSign className="card-header-icon" />
                  <div>
                    <h3>Datos Bancarios para Transferencias</h3>
                    <p>Información que se muestra a los compradores para pagar por banco</p>
                  </div>
                </div>
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="cfg-bank-holder">Titular de la Cuenta</label>
                  <input
                    id="cfg-bank-holder"
                    type="text"
                    placeholder="Azkaban Store Oficial"
                    value={formData.bankHolder || ''}
                    onChange={(e) => setFormData({ ...formData, bankHolder: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="cfg-bank-name">Entidad / Billetera Virtual</label>
                  <input
                    id="cfg-bank-name"
                    type="text"
                    placeholder="Mercado Pago / Banco Santander"
                    value={formData.bankName || ''}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="cfg-bank-alias">Alias de Transferencia</label>
                  <input
                    id="cfg-bank-alias"
                    type="text"
                    placeholder="AZKABAN.STORE"
                    value={formData.bankAlias || ''}
                    onChange={(e) => setFormData({ ...formData, bankAlias: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="cfg-bank-cbu">CBU o CVU (22 dígitos)</label>
                  <input
                    id="cfg-bank-cbu"
                    type="text"
                    placeholder="0000003100012345678901"
                    value={formData.bankCbu || ''}
                    onChange={(e) => setFormData({ ...formData, bankCbu: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Política de Cambios */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="card-title-group">
                  <FiFileText className="card-header-icon" />
                  <div>
                    <h3>Política de Cambios y Devoluciones</h3>
                    <p>Texto oficial visible en la sección /cambios-y-devoluciones</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-admin-secondary btn-sm"
                  onClick={() => {
                    setFormData({ ...formData, returnPolicy: DEFAULT_RETURN_POLICY_TEXT })
                    toast.success('Texto por defecto restaurado')
                  }}
                >
                  Restaurar por defecto
                </button>
              </div>

              <div className="admin-form-group">
                <textarea
                  rows={5}
                  value={formData.returnPolicy || DEFAULT_RETURN_POLICY_TEXT}
                  onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
                  className="admin-textarea"
                />
              </div>
            </div>

            <div className="settings-bottom-actions">
              <button type="submit" className="btn-admin-primary btn-lg">
                <FiSave size={18} />
                <span>Guardar Todos los Cambios</span>
              </button>
            </div>
          </form>
        </div>

        {/* Side Column: Security & Backups */}
        <div className="settings-side-column">
          {/* Security Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="card-title-group">
                <FiShield className="card-header-icon" />
                <div>
                  <h3>Seguridad del Panel</h3>
                  <p>Contraseña de acceso para administración</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="admin-side-form">
              <div className="admin-form-group">
                <label htmlFor="pass-current">Contraseña Actual</label>
                <input
                  id="pass-current"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="pass-new">Nueva Contraseña</label>
                <input
                  id="pass-new"
                  type="password"
                  required
                  placeholder="Mínimo 4 caracteres"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="pass-confirm">Confirmar Contraseña</label>
                <input
                  id="pass-confirm"
                  type="password"
                  required
                  placeholder="Repetir nueva contraseña"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-admin-secondary btn-block">
                <FiLock size={15} />
                <span>Actualizar Contraseña</span>
              </button>
            </form>
          </div>

          {/* Backup Management Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="card-title-group">
                <FiDownload className="card-header-icon" />
                <div>
                  <h3>Copias de Seguridad</h3>
                  <p>Resguardo e importación de productos, pedidos y ajustes</p>
                </div>
              </div>
            </div>

            <p className="admin-card-intro">
              Descargá una copia de seguridad en formato JSON para guardar todo tu inventario en tu computadora o migrar datos de forma segura.
            </p>

            <div className="backup-buttons-stack">
              <button
                type="button"
                className="btn-admin-secondary btn-block"
                onClick={onExportBackup}
              >
                <FiDownload size={16} />
                <span>Descargar Copia JSON</span>
              </button>

              <label className="btn-admin-secondary btn-block btn-upload-label">
                <FiUpload size={16} />
                <span>Restaurar Copia JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportBackup}
                  style={{ display: 'none' }}
                />
              </label>

              <div className="backup-divider" />

              <button
                type="button"
                className="btn-admin-danger btn-block"
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
