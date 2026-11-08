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
  FiPhone,
  FiMail,
  FiInstagram,
  FiRadio,
  FiCreditCard,
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
      {/* Header */}
      <div className="admin-content-card__header">
        <div>
          <h3>Configuración General de AzkabanStore</h3>
          <p>
            Gestioná los canales de contacto, WhatsApp de pedidos, punto de retiro físico en San Martín y copias de seguridad.
          </p>
        </div>
      </div>

      <div className="settings-columns-layout">
        {/* Left Column: Main Form */}
        <div className="settings-main-form-box">
          <form onSubmit={handleConfigSubmit}>
            {/* Card 1: Identidad & Contacto */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill">
                  <FiSettings size={18} />
                </div>
                <div>
                  <h4>1. Identidad de Marca & Contacto</h4>
                  <span>Datos comerciales y canales oficiales de atención al cliente</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="cfg-name">Nombre de la Tienda *</label>
                  <input
                    id="cfg-name"
                    type="text"
                    required
                    placeholder="AzkabanStore"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cfg-slogan">Eslogan / Subtítulo</label>
                  <input
                    id="cfg-slogan"
                    type="text"
                    placeholder="Indumentaria Deportiva y Urbana"
                    value={formData.slogan || ''}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="cfg-phone-raw">
                    WhatsApp para Pedidos (Sin signos ni espacios) *
                  </label>
                  <div className="input-with-icon">
                    <FaWhatsapp className="field-icon-wa" />
                    <input
                      id="cfg-phone-raw"
                      type="text"
                      required
                      placeholder="5491137934198"
                      value={formData.phoneRaw || ''}
                      onChange={(e) => setFormData({ ...formData, phoneRaw: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cfg-phone-disp">
                    WhatsApp Visible al Cliente *
                  </label>
                  <div className="input-with-icon">
                    <FiPhone className="field-icon" />
                    <input
                      id="cfg-phone-disp"
                      type="text"
                      required
                      placeholder="+54 9 11 3793-4198"
                      value={formData.phoneDisplay || ''}
                      onChange={(e) => setFormData({ ...formData, phoneDisplay: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="cfg-email">Email Oficial de la Tienda</label>
                  <div className="input-with-icon">
                    <FiMail className="field-icon" />
                    <input
                      id="cfg-email"
                      type="email"
                      placeholder="azkabanstoreonline@gmail.com"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cfg-channel">Link Canal de WhatsApp</label>
                  <div className="input-with-icon">
                    <FaWhatsapp className="field-icon-wa" />
                    <input
                      id="cfg-channel"
                      type="url"
                      placeholder="https://whatsapp.com/channel/..."
                      value={formData.whatsappChannelUrl || ''}
                      onChange={(e) => setFormData({ ...formData, whatsappChannelUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cfg-insta">Instagram Oficial (Enlace o usuario)</label>
                <div className="input-with-icon">
                  <FiInstagram className="field-icon" />
                  <input
                    id="cfg-insta"
                    type="text"
                    placeholder="https://instagram.com/azkabanstore.indumentaria"
                    value={formData.instagramUrl || ''}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Punto de Retiro & Logística */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill settings-icon-pill--location">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <h4>2. Punto de Retiro & Logística</h4>
                  <span>Ubicación física en San Martín, horarios y empresas de envío</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cfg-address">Dirección Física del Punto de Retiro *</label>
                <div className="input-with-icon">
                  <FiMapPin className="field-icon" />
                  <input
                    id="cfg-address"
                    type="text"
                    required
                    placeholder="Dr. marcos zimmermann 3339 (Entre av JM campos y pasaje 86). San Martín"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="cfg-hours">Horarios de Atención *</label>
                  <div className="input-with-icon">
                    <FiClock className="field-icon" />
                    <input
                      id="cfg-hours"
                      type="text"
                      required
                      placeholder="Lunes a Viernes de 10:00 a 20:00 hs"
                      value={formData.hours || ''}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cfg-carriers">Empresas de Logística / Despacho</label>
                  <div className="input-with-icon">
                    <FiTruck className="field-icon" />
                    <input
                      id="cfg-carriers"
                      type="text"
                      placeholder="Andreani / Vía Cargo"
                      value={formData.shippingCarriersText || 'Andreani / Vía Cargo'}
                      onChange={(e) => setFormData({ ...formData, shippingCarriersText: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Announcement Bar */}
              <div className="form-group">
                <label htmlFor="cfg-announcement">
                  Texto de la Barra Superior de Anuncios (En vivo en toda la web)
                </label>
                <div className="input-with-icon">
                  <FiRadio className="field-icon" />
                  <input
                    id="cfg-announcement"
                    type="text"
                    placeholder="Envíos a todo el país por Andreani y Vía Cargo • Retiro en San Martín"
                    value={formData.announcementText || ''}
                    onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Datos Bancarios */}
            <div className="settings-card-section">
              <div className="settings-card-section__header">
                <div className="settings-icon-pill settings-icon-pill--bank">
                  <FiDollarSign size={18} />
                </div>
                <div>
                  <h4>3. Datos Bancarios para Transferencias</h4>
                  <span>Información que ve el cliente en el checkout para abonar por banco</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="cfg-bank-holder">Titular de la Cuenta</label>
                  <input
                    id="cfg-bank-holder"
                    type="text"
                    placeholder="Azkaban Store Oficial"
                    value={formData.bankHolder || ''}
                    onChange={(e) => setFormData({ ...formData, bankHolder: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cfg-bank-name">Banco / Billetera Virtual</label>
                  <input
                    id="cfg-bank-name"
                    type="text"
                    placeholder="Mercado Pago / Banco Santander..."
                    value={formData.bankName || ''}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="cfg-bank-alias">Alias de Transferencia</label>
                  <div className="input-with-icon">
                    <FiCreditCard className="field-icon" />
                    <input
                      id="cfg-bank-alias"
                      type="text"
                      placeholder="AZKABAN.STORE"
                      value={formData.bankAlias || ''}
                      onChange={(e) => setFormData({ ...formData, bankAlias: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cfg-bank-cbu">CBU / CVU</label>
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

            {/* Save Button */}
            <div className="settings-submit-row">
              <button type="submit" className="btn-primary btn-save-config">
                <FiCheck size={18} />
                <span>Guardar Cambios de Configuración</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security & Backups */}
        <div className="settings-side-box">
          {/* Security Card */}
          <div className="settings-side-card">
            <div className="settings-card-section__header">
              <div className="settings-icon-pill settings-icon-pill--security">
                <FiShield size={18} />
              </div>
              <div>
                <h4>Seguridad del Panel</h4>
                <span>Contraseña de acceso de administrador</span>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="password-form-side">
              <div className="form-group">
                <label htmlFor="pass-current">Contraseña Actual *</label>
                <div className="input-with-icon">
                  <FiLock className="field-icon" />
                  <input
                    id="pass-current"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pass-new">Nueva Contraseña *</label>
                <div className="input-with-icon">
                  <FiLock className="field-icon" />
                  <input
                    id="pass-new"
                    type="password"
                    required
                    placeholder="Mínimo 4 caracteres"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pass-confirm">Confirmar Nueva Contraseña *</label>
                <div className="input-with-icon">
                  <FiLock className="field-icon" />
                  <input
                    id="pass-confirm"
                    type="password"
                    required
                    placeholder="Repetir nueva contraseña"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-secondary btn-block">
                <FiLock size={15} />
                <span>Actualizar Contraseña</span>
              </button>
            </form>
          </div>

          {/* Backup Management Card */}
          <div className="settings-side-card">
            <div className="settings-card-section__header">
              <div className="settings-icon-pill settings-icon-pill--backup">
                <FiDownload size={18} />
              </div>
              <div>
                <h4>Copias de Seguridad</h4>
                <span>Descarga y restauración en formato JSON</span>
              </div>
            </div>

            <p className="settings-side-desc">
              Hacé una copia de seguridad periódica para resguardar tus prendas, órdenes y configuraciones en tu computadora.
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

              <label className="btn-secondary btn-block btn-upload-label">
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
