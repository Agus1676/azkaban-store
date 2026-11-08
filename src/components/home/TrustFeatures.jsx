import { FiTruck, FiMapPin, FiClock, FiCreditCard } from 'react-icons/fi'
import './TrustFeatures.css'

const TrustFeatures = () => {
  const features = [
    {
      icon: <FiTruck />,
      title: 'Envíos a Todo el País',
      desc: 'Despachamos por Andreani y Vía Cargo con código de seguimiento en tiempo real.',
    },
    {
      icon: <FiMapPin />,
      title: 'Punto de Retiro San Martín',
      desc: 'Dr. marcos zimmermann 3339 (Entre JM campos y pje 86). Coordiná y retirá sin costo.',
    },
    {
      icon: <FiClock />,
      title: 'Atención 10 a 20hs',
      desc: 'Lunes a Viernes asesoramiento continuo en talles y stock por WhatsApp.',
    },
    {
      icon: <FiCreditCard />,
      title: 'Medios de Pago Flexibles',
      desc: 'Transferencia bancaria, efectivo al retirar o Mercado Pago con total seguridad.',
    },
  ]

  return (
    <section className="trust-features-section">
      <div className="container">
        <div className="trust-features-grid">
          {features.map((item, idx) => (
            <div key={idx} className="trust-feature-card">
              <div className="trust-feature-card__icon">{item.icon}</div>
              <div className="trust-feature-card__content">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustFeatures
