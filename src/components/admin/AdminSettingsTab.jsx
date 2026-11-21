import { useState } from 'react'
import {
  FiSave,
  FiImage,
  FiCreditCard,
  FiTruck,
  FiEdit3,
  FiGlobe,
  FiPhone,
  FiShield,
  FiPlus,
  FiTrash2,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiLock,
  FiCheck,
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const AdminSettingsTab = ({
  storeConfig = {},
  onSaveConfig,
  onChangePassword,
  onExportBackup,
  onImportBackup,
  onRestoreTreinta,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('banners') // 'banners' | 'payments' | 'shipping' | 'announcements' | 'about' | 'contact' | 'security'
  const [formData, setFormData] = useState({
    name: 'AzkabanStore',
    slogan: 'Indumentaria Deportiva y Urbana',
    tagline: 'Tu tienda oficial de indumentaria deportiva, conjuntos, bermudas y buzos en San Martín y envíos a todo el país.',
    phoneRaw: '5491137934198',
    phoneDisplay: '+54 9 11 3793-4198',
    address: 'Dr. marcos zimmermann 3339 (Entre av JM campos y pasaje 86), San Martín',
    hours: 'Lunes a Viernes de 10:00 a 20:00 hs',
    email: 'azkabanstoreonline@gmail.com',
    instagramUrl: 'https://instagram.com/azkabanstore.indumentaria',
    whatsappChannelUrl: 'https://whatsapp.com/channel/0029Vb6rLHIAzNc2gW3gXm3o',
    announcementText: '🔥 Envíos a todo el país por Andreani y Vía Cargo • Punto de Retiro en San Martín',

    // Andreani & Shipping rates
    andreaniAmbaHome: 7500,
    andreaniAmbaBranch: 5200,
    andreaniInteriorHome: 11800,
    andreaniInteriorBranch: 8900,
    viaCargoAgency: 9500,
    freeShippingThreshold: 120000,
    freeShippingEnabled: true,

    // Discounts & Payments
    transferDiscount: 10,
    cashDiscount: 10,
    cuentaDniDiscount: 20,
    aliasCbu: 'AZKABAN.STORE.MP',

    // Banners Slider
    banners: [
      {
        id: 1,
        tag: 'NUEVA COLECCIÓN 2026',
        title: 'Buzos & Bermudas Urbanas',
        subtitle: 'Calidad premium frizada y rústica. Envíos express a todo el país.',
        buttonText: 'Ver Catálogo Completo',
        buttonLink: '/catalogo',
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 2,
        tag: 'BENEFICIO EXCLUSIVO',
        title: '10% OFF Transferencia o Efectivo',
        subtitle: 'Aboná mediante transferencia bancaria o en nuestro punto de entrega.',
        buttonText: 'Aprovechar Ofertas',
        buttonLink: '/catalogo',
        imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
      },
    ],

    ...storeConfig,
  })

  // Password state
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBannerChange = (index, field, value) => {
    const updated = [...(formData.banners || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData((prev) => ({ ...prev, banners: updated }))
  }

  const handleAddBanner = () => {
    const newSlide = {
      id: Date.now(),
      tag: 'NUEVA PROMO',
      title: 'Título del Banner',
      subtitle: 'Descripción breve de la promoción o colección.',
      buttonText: 'Ver Productos',
      buttonLink: '/catalogo',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
    }
    setFormData((prev) => ({ ...prev, banners: [...(prev.banners || []), newSlide] }))
    toast.success('Nuevo slide agregado al carrusel')
  }

  const handleRemoveBanner = (index) => {
    if (formData.banners.length <= 1) {
      toast.error('Debe haber al menos 1 banner en la portada')
      return
    }
    const updated = formData.banners.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, banners: updated }))
    toast.success('Slide eliminado')
  }

  const handleSaveAll = (e) => {
    if (e) e.preventDefault()
    onSaveConfig(formData)
    toast.success('¡Toda la configuración fue guardada y sincronizada!')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!newPass.trim() || newPass.length < 5) {
      toast.error('La contraseña debe tener al menos 5 caracteres')
      return
    }
    if (newPass !== confirmPass) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    const res = await onChangePassword(currentPass, newPass)
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
    <div className="settings">
      {/* Header matching Screenshot 5 */}
      <div className="settings__header">
        <div>
          <h2 className="settings__title">Panel de Control &amp; Editor Total de la Web</h2>
          <p className="settings__subtitle">
            Personalizá banners, textos, métodos de pago, envíos, fotos de stock y datos fiscales en tiempo real.
          </p>
        </div>

        <button type="button" className="settings__save-header-btn" onClick={handleSaveAll}>
          <FiSave /> Guardar Todos los Cambios
        </button>
      </div>

      {/* Modern Navigation Tabs matching Screenshot 5 */}
      <div className="settings__tabs">
        <button
          type="button"
          className={`settings__tab-btn ${activeSubTab === 'banners' ? 'settings__tab-btn--active' : ''}`}
          onClick={() => setActiveSubTab('banners')}
        >
          <FiImage /> Banners Portada
        </button>

        <button
          type="button"
          className={`settings__tab-btn ${activeSubTab === 'payments' ? 'settings__tab-btn--active' : ''}`}
          onClick={() => setActiveSubTab('payments')}
        >
          <FiCreditCard /> Métodos de Pago
        </button>

        <button
          type="button"
          className={`settings__tab-btn ${activeSubTab === 'shipping' ? 'settings__tab-btn--active' : ''}`}
          onClick={() => setActiveSubTab('shipping')}
        >
          <FiTruck /> Envíos &amp; Entregas
        </button>

        <button
          type="button"
          className={`settings__tab-btn ${activeSubTab === 'announcements' ? 'settings__tab-btn--active' : ''}`}
          onClick={() => setActiveSubTab('announcements')}
        >
          <FiEdit3 /> Textos &amp; Anuncios
        </button>

        <button
          type="button"
          className={`settings__tab-btn ${activeSubTab === 'about' ? 'settings__tab-btn--active' : ''}`}
          onClick={() => setActiveSubTab('about')}
        >
          <FiGlobe /> Quiénes Somos
        </button>

        <button
          type="button"
          className={`settings__tab-btn ${activeSubTab === 'contact' ? 'settings__tab-btn--active' : ''}`}
          onClick={() => setActiveSubTab('contact')}
        >
          <FiPhone /> Contacto &amp; Redes
        </button>

        <button
          type="button"
          className={`settings__tab-btn ${activeSubTab === 'security' ? 'settings__tab-btn--active' : ''}`}
          onClick={() => setActiveSubTab('security')}
        >
          <FiShield /> Seguridad &amp; Backups
        </button>
      </div>

      {/* TAB 1: BANNERS PORTADA (Matching Screenshot 5) */}
      {activeSubTab === 'banners' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              🖼️ Carrusel de Banners Principales (Hero Portada)
            </h3>
            <button className="btn-black-primary" onClick={handleAddBanner}>
              <FiPlus /> Agregar Nuevo Banner
            </button>
          </div>

          {(formData.banners || []).map((slide, idx) => (
            <div key={slide.id || idx} className="pf__card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>Slide #{idx + 1}</strong>
                <button
                  className="btn-outline-white"
                  style={{ color: '#dc2626', borderColor: '#fee2e2', padding: '4px 10px', fontSize: '0.78rem' }}
                  onClick={() => handleRemoveBanner(idx)}
                >
                  <FiTrash2 /> Eliminar Banner
                </button>
              </div>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: '220px', flexShrink: 0 }}>
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/logo.png'
                    }}
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="pf__form-group">
                    <label>URL de la Imagen (Enlace Directo)</label>
                    <input
                      type="text"
                      value={slide.imageUrl}
                      onChange={(e) => handleBannerChange(idx, 'imageUrl', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="pf__grid-2">
                    <div className="pf__form-group">
                      <label>Categoría / Etiqueta Superior</label>
                      <input
                        type="text"
                        value={slide.tag}
                        onChange={(e) => handleBannerChange(idx, 'tag', e.target.value)}
                        placeholder="Ej: BENEFICIO EXCLUSIVO"
                      />
                    </div>
                    <div className="pf__form-group">
                      <label>Título Principal</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleBannerChange(idx, 'title', e.target.value)}
                        placeholder="Ej: Buzos & Bermudas Urbanas"
                      />
                    </div>
                  </div>

                  <div className="pf__form-group">
                    <label>Subtítulo / Bajada Descriptiva</label>
                    <input
                      type="text"
                      value={slide.subtitle}
                      onChange={(e) => handleBannerChange(idx, 'subtitle', e.target.value)}
                      placeholder="Descripción breve..."
                    />
                  </div>

                  <div className="pf__grid-2">
                    <div className="pf__form-group">
                      <label>Texto del Botón (CTA)</label>
                      <input
                        type="text"
                        value={slide.buttonText}
                        onChange={(e) => handleBannerChange(idx, 'buttonText', e.target.value)}
                        placeholder="Ej: Ver Catálogo"
                      />
                    </div>
                    <div className="pf__form-group">
                      <label>Enlace de Destino</label>
                      <input
                        type="text"
                        value={slide.buttonLink}
                        onChange={(e) => handleBannerChange(idx, 'buttonLink', e.target.value)}
                        placeholder="/catalogo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MÉTODOS DE PAGO */}
      {activeSubTab === 'payments' && (
        <div className="pf__card">
          <h3>💳 Métodos de Pago &amp; Descuentos Automáticos</h3>
          <p>Configurá las promociones y los datos de acreditación que verán los clientes en el carrito.</p>

          <div className="pf__grid-2">
            <div className="pf__form-group">
              <label>Descuento por Transferencia Bancaria (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.transferDiscount}
                onChange={(e) => handleFieldChange('transferDiscount', Number(e.target.value))}
              />
            </div>

            <div className="pf__form-group">
              <label>Descuento por Efectivo al Retirar (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.cashDiscount}
                onChange={(e) => handleFieldChange('cashDiscount', Number(e.target.value))}
              />
            </div>

            <div className="pf__form-group">
              <label>Alias / CBU para Transferencias</label>
              <input
                type="text"
                value={formData.aliasCbu}
                onChange={(e) => handleFieldChange('aliasCbu', e.target.value)}
                placeholder="AZKABAN.STORE.MP"
              />
            </div>

            <div className="pf__form-group">
              <label>Descuento Especial Cuenta DNI (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.cuentaDniDiscount}
                onChange={(e) => handleFieldChange('cuentaDniDiscount', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ENVÍOS & ENTREGAS */}
      {activeSubTab === 'shipping' && (
        <div className="pf__card">
          <h3>🚚 Tarifas de Envíos &amp; Logística Andreani / Vía Cargo</h3>
          <p>Configurá las tarifas zonales para el cotizador automático del carrito y envíos gratis.</p>

          <div className="pf__grid-2">
            <div className="pf__form-group">
              <label>Andreani AMBA a Domicilio ($)</label>
              <input
                type="number"
                value={formData.andreaniAmbaHome}
                onChange={(e) => handleFieldChange('andreaniAmbaHome', Number(e.target.value))}
              />
            </div>

            <div className="pf__form-group">
              <label>Andreani AMBA a Sucursal ($)</label>
              <input
                type="number"
                value={formData.andreaniAmbaBranch}
                onChange={(e) => handleFieldChange('andreaniAmbaBranch', Number(e.target.value))}
              />
            </div>

            <div className="pf__form-group">
              <label>Andreani Interior a Domicilio ($)</label>
              <input
                type="number"
                value={formData.andreaniInteriorHome}
                onChange={(e) => handleFieldChange('andreaniInteriorHome', Number(e.target.value))}
              />
            </div>

            <div className="pf__form-group">
              <label>Andreani Interior a Sucursal ($)</label>
              <input
                type="number"
                value={formData.andreaniInteriorBranch}
                onChange={(e) => handleFieldChange('andreaniInteriorBranch', Number(e.target.value))}
              />
            </div>

            <div className="pf__form-group">
              <label>Vía Cargo a Agencia ($)</label>
              <input
                type="number"
                value={formData.viaCargoAgency}
                onChange={(e) => handleFieldChange('viaCargoAgency', Number(e.target.value))}
              />
            </div>

            <div className="pf__form-group">
              <label>Monto Mínimo para Envío Gratis ($)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => handleFieldChange('freeShippingThreshold', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TEXTOS & ANUNCIOS */}
      {activeSubTab === 'announcements' && (
        <div className="pf__card">
          <h3>✏️ Barra Superior de Anuncios &amp; Mensajes Clave</h3>
          <p>El texto que corre en la marquesina superior de toda la tienda.</p>

          <div className="pf__form-group" style={{ marginBottom: '16px' }}>
            <label>Texto Principal de la Barra Superior</label>
            <textarea
              rows={3}
              value={formData.announcementText}
              onChange={(e) => handleFieldChange('announcementText', e.target.value)}
              placeholder="Ej: 🔥 Envíos a todo el país por Andreani y Vía Cargo • Punto de Retiro en San Martín"
            />
          </div>

          <div className="pf__form-group">
            <label>Eslogan Corto / Subtítulo de Marca</label>
            <input
              type="text"
              value={formData.slogan}
              onChange={(e) => handleFieldChange('slogan', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* TAB 5: QUIÉNES SOMOS */}
      {activeSubTab === 'about' && (
        <div className="pf__card">
          <h3>🌐 Sección Quiénes Somos</h3>
          <p>Textos institucionales visibles en la página /nosotros de la tienda.</p>

          <div className="pf__form-group">
            <label>Descripción / Historia de la Marca</label>
            <textarea
              rows={6}
              value={formData.tagline}
              onChange={(e) => handleFieldChange('tagline', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* TAB 6: CONTACTO & REDES */}
      {activeSubTab === 'contact' && (
        <div className="pf__card">
          <h3>📞 Contacto Oficial &amp; Redes Sociales</h3>
          <p>Teléfonos de pedidos de WhatsApp, canal oficial, Instagram y dirección de retiro.</p>

          <div className="pf__grid-2">
            <div className="pf__form-group">
              <label>WhatsApp para Pedidos (sin signos ni espacios)</label>
              <input
                type="text"
                value={formData.phoneRaw}
                onChange={(e) => handleFieldChange('phoneRaw', e.target.value)}
                placeholder="5491137934198"
              />
            </div>

            <div className="pf__form-group">
              <label>WhatsApp Visible al Cliente</label>
              <input
                type="text"
                value={formData.phoneDisplay}
                onChange={(e) => handleFieldChange('phoneDisplay', e.target.value)}
                placeholder="+54 9 11 3793-4198"
              />
            </div>

            <div className="pf__form-group">
              <label>Instagram Oficial (Enlace Completo)</label>
              <input
                type="text"
                value={formData.instagramUrl}
                onChange={(e) => handleFieldChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="pf__form-group">
              <label>Canal de WhatsApp (Enlace Completo)</label>
              <input
                type="text"
                value={formData.whatsappChannelUrl}
                onChange={(e) => handleFieldChange('whatsappChannelUrl', e.target.value)}
                placeholder="https://whatsapp.com/channel/..."
              />
            </div>

            <div className="pf__form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Dirección Física del Punto de Retiro</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="Dr. marcos zimmermann 3339, San Martín"
              />
            </div>

            <div className="pf__form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Horarios de Atención</label>
              <input
                type="text"
                value={formData.hours}
                onChange={(e) => handleFieldChange('hours', e.target.value)}
                placeholder="Lunes a Viernes de 10:00 a 20:00 hs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SEGURIDAD & BACKUPS */}
      {activeSubTab === 'security' && (
        <div>
          {/* Card: Change Password */}
          <div className="pf__card">
            <h3>🛡️ Seguridad del Panel de Administración</h3>
            <p>Modificá la clave maestra de acceso al panel.</p>

            <form onSubmit={handlePasswordSubmit} style={{ maxWidth: '440px' }}>
              <div className="pf__form-group" style={{ marginBottom: '12px' }}>
                <label>Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="Contraseña actual..."
                  required
                />
              </div>

              <div className="pf__form-group" style={{ marginBottom: '12px' }}>
                <label>Nueva Contraseña (mínimo 4 caracteres)</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Nueva contraseña..."
                  required
                />
              </div>

              <div className="pf__form-group" style={{ marginBottom: '16px' }}>
                <label>Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repetir nueva contraseña..."
                  required
                />
              </div>

              <button type="submit" className="btn-black-primary">
                Actualizar Contraseña
              </button>
            </form>
          </div>

          {/* Card: Backups */}
          <div className="pf__card">
            <h3>📥 Copias de Seguridad &amp; Restauración</h3>
            <p>Exportá o restaurá tus productos, categorías y configuraciones completas.</p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-outline-white" onClick={onExportBackup}>
                <FiDownload /> Descargar Copia JSON
              </button>

              <label className="btn-outline-white" style={{ cursor: 'pointer' }}>
                <FiUpload /> Restaurar Copia JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportBackup}
                  style={{ display: 'none' }}
                />
              </label>

              <button className="btn-outline-white" onClick={onRestoreTreinta} style={{ color: '#dc2626', borderColor: '#fee2e2' }}>
                <FiRefreshCw /> Restaurar Catálogo de Treinta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSettingsTab
