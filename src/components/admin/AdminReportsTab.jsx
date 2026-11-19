import { useState, useMemo } from 'react'
import {
  FiBarChart2,
  FiCalendar,
  FiFilter,
  FiTrash2,
  FiInfo,
  FiDollarSign,
  FiPackage,
  FiUser,
  FiShoppingBag,
} from 'react-icons/fi'
import { formatPrice } from '../../utils/formatPrice'
import { getStoredStockLogs, saveStoredStockLogs } from '../../services/storeDb'
import toast from 'react-hot-toast'

const AdminReportsTab = ({ orders = [] }) => {
  const [period, setPeriod] = useState('30d') // 'today' | 'yesterday' | '7d' | '30d' | 'month' | 'all'
  const [customerFilter, setCustomerFilter] = useState('all')

  // Stock logs (counter sales) + web orders
  const stockLogs = getStoredStockLogs()
  const salesLogs = useMemo(() => {
    // Combine web orders and counter sales
    const webSales = orders.map((o) => ({
      id: o.id,
      date: o.date || o.createdAt || new Date().toISOString(),
      customerName: o.customer?.name || 'Cliente Web',
      type: 'venta_web',
      totalAmount: o.total || 0,
      qty: o.items?.reduce((sum, it) => sum + (it.quantity || 1), 0) || 1,
      itemsSummary: o.items?.map((it) => `${it.quantity}x ${it.name}`).join(', ') || 'Prendas varias',
      paymentMethod: o.paymentMethod || 'Transferencia',
    }))

    const physicalSales = stockLogs
      .filter((l) => l.type === 'venta_fisica')
      .map((l) => ({
        id: l.id,
        date: l.date,
        customerName: l.customerName || 'Cliente Mostrador',
        type: 'venta_fisica',
        totalAmount: l.totalAmount || 0,
        qty: Math.abs(l.qty || 1),
        itemsSummary: l.productName || 'Prenda',
        paymentMethod: l.paymentMethod || 'Efectivo',
      }))

    return [...webSales, ...physicalSales].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [orders, stockLogs])

  // Filter by period
  const filteredSales = useMemo(() => {
    const now = new Date()
    return salesLogs.filter((s) => {
      const sDate = new Date(s.date)

      if (period === 'today') {
        return sDate.toDateString() === now.toDateString()
      }
      if (period === 'yesterday') {
        const y = new Date()
        y.setDate(y.getDate() - 1)
        return sDate.toDateString() === y.toDateString()
      }
      if (period === '7d') {
        const d7 = new Date()
        d7.setDate(d7.getDate() - 7)
        return sDate >= d7
      }
      if (period === '30d') {
        const d30 = new Date()
        d30.setDate(d30.getDate() - 30)
        return sDate >= d30
      }
      if (period === 'month') {
        return sDate.getMonth() === now.getMonth() && sDate.getFullYear() === now.getFullYear()
      }
      return true // 'all'
    }).filter((s) => {
      if (customerFilter !== 'all' && s.customerName !== customerFilter) return false
      return true
    })
  }, [salesLogs, period, customerFilter])

  // Customers unique list
  const customers = useMemo(() => {
    return [...new Set(salesLogs.map((s) => s.customerName).filter(Boolean))]
  }, [salesLogs])

  const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0)
  const totalUnits = filteredSales.reduce((sum, s) => sum + (s.qty || 0), 0)
  const avgTicket = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0

  const periodLabels = {
    today: 'Hoy',
    yesterday: 'Ayer',
    '7d': 'Últimos 7 días',
    '30d': 'Últimos 30 días',
    month: 'Este Mes',
    all: 'Todo el Historial',
  }

  const handleClearHistory = () => {
    if (window.confirm('¿Seguro que deseás borrar los registros de ventas de mostrador?')) {
      const remaining = stockLogs.filter((l) => l.type !== 'venta_fisica')
      saveStoredStockLogs(remaining)
      toast.success('Se limpiaron los registros de ventas físicas')
    }
  }

  return (
    <div className="sr">
      {/* Header matching Screenshot 4 */}
      <div className="sr__header">
        <h2>📊 Reporte de Ventas &amp; Facturación</h2>
        <p>Control de ingresos, métricas por día y balance entre tienda web y ventas en el local</p>
      </div>

      {/* Period Selection Bar */}
      <div className="sr__controls-card">
        <div className="sr__period-selector">
          <button
            type="button"
            className={`sr__period-btn ${period === 'today' ? 'sr__period-btn--active' : ''}`}
            onClick={() => setPeriod('today')}
          >
            Hoy
          </button>
          <button
            type="button"
            className={`sr__period-btn ${period === 'yesterday' ? 'sr__period-btn--active' : ''}`}
            onClick={() => setPeriod('yesterday')}
          >
            Ayer
          </button>
          <button
            type="button"
            className={`sr__period-btn ${period === '7d' ? 'sr__period-btn--active' : ''}`}
            onClick={() => setPeriod('7d')}
          >
            Últimos 7 días
          </button>
          <button
            type="button"
            className={`sr__period-btn ${period === '30d' ? 'sr__period-btn--active' : ''}`}
            onClick={() => setPeriod('30d')}
          >
            Últimos 30 días
          </button>
          <button
            type="button"
            className={`sr__period-btn ${period === 'month' ? 'sr__period-btn--active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            Este Mes
          </button>
          <button
            type="button"
            className={`sr__period-btn ${period === 'all' ? 'sr__period-btn--active' : ''}`}
            onClick={() => setPeriod('all')}
          >
            Todo el Historial
          </button>

          <button
            type="button"
            className="sr__period-btn sr__period-btn--danger"
            onClick={handleClearHistory}
            title="Borrar ventas manuales de mostrador"
          >
            <FiTrash2 /> Borrar Ventas
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="sr__filter-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiUser size={16} color="#64748b" />
          <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}>
            Filtrar por Cliente:
          </span>
          <select
            className="sr__client-select"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          >
            <option value="all">Todos los Clientes ({customers.length} registrados)</option>
            {customers.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="sr__status-badge-text">
          Vista actual: <strong>{periodLabels[period] || 'Período'}</strong> • {filteredSales.length} movimientos de venta encontrados
        </div>
      </div>

      {/* Content: Either Empty State or Data Table */}
      {filteredSales.length === 0 ? (
        <div className="sr__empty-state">
          <div className="sr__empty-icon">
            <FiInfo />
          </div>
          <h3 className="sr__empty-title">Sin ventas en este período ({periodLabels[period] || 'Período'})</h3>
          <p className="sr__empty-sub">
            Las ventas registradas desde la web o el panel de stock se sumarán automáticamente aquí en tiempo real.
          </p>
        </div>
      ) : (
        <>
          {/* Summary KPIs */}
          <div className="dashboard__stats" style={{ marginBottom: '24px' }}>
            <div className="dashboard__stat dashboard__stat--success">
              <div className="dashboard__stat-icon">
                <FiDollarSign />
              </div>
              <div>
                <span className="dashboard__stat-value">{formatPrice(totalRevenue)}</span>
                <span className="dashboard__stat-label">Ingresos Totales</span>
              </div>
            </div>

            <div className="dashboard__stat dashboard__stat--accent">
              <div className="dashboard__stat-icon">
                <FiPackage />
              </div>
              <div>
                <span className="dashboard__stat-value">{totalUnits} un.</span>
                <span className="dashboard__stat-label">Prendas Despachadas</span>
              </div>
            </div>

            <div className="dashboard__stat dashboard__stat--warning">
              <div className="dashboard__stat-icon">
                <FiShoppingBag />
              </div>
              <div>
                <span className="dashboard__stat-value">{formatPrice(avgTicket)}</span>
                <span className="dashboard__stat-label">Ticket Promedio</span>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="pm__table-wrap">
            <table className="pm__table">
              <thead>
                <tr>
                  <th>Fecha &amp; Hora</th>
                  <th>Cliente</th>
                  <th>Canal</th>
                  <th>Prendas</th>
                  <th>Medio de Pago</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                        {new Date(s.date).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{s.customerName}</strong>
                    </td>
                    <td>
                      <span
                        className={s.type === 'venta_web' ? 'badge-category-cyan' : 'badge-status-offer'}
                      >
                        {s.type === 'venta_web' ? 'TIENDA WEB' : 'MOSTRADOR'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.84rem', color: '#475569' }}>
                        {s.itemsSummary} ({s.qty} un.)
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', textTransform: 'capitalize', color: '#334155' }}>
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>
                        {formatPrice(s.totalAmount)}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminReportsTab
