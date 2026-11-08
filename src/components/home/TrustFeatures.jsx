import { FiTruck, FiMapPin, FiClock, FiCreditCard } from 'react-icons/fi'
import './TrustFeatures.css'

const TrustFeatures = () => {
  const items = [
    {
      icon: <FiTruck />,
      title: 'Envíos Nacionales',
      text: 'Despachos por Andreani y Vía Cargo con código de seguimiento en tiempo real.',
    },
    {
      icon: <FiMapPin />,
      title: 'Punto de Retiro',
      text: 'Dr. marcos zimmermann 3339, San Martín. Retirá tu pedido gratis en nuestro local.',
    },
    {
      icon: <FiClock />,
      title: 'Atención 10 a 20hs',
      text: 'Lunes a Viernes asesoramiento personalizado de talles y stock por WhatsApp.',
    },
    {
      icon: <FiCreditCard />,
      title: 'Medios de Pago',
      text: 'Aboná por Transferencia bancaria, Efectivo al retirar o Mercado Pago.',
    },
  ]

  return (
    <section className="trust-strip">
      <div className="container">
        <div className="trust-grid">
          {items.map((it, i) => (
            <div key={i} className="trust-item">
              <div className="trust-item__icon">{it.icon}</div>
              <div className="trust-item__info">
                <h4>{it.title}</h4>
                <p>{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustFeatures
