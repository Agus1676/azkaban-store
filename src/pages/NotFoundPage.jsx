import { Link } from 'react-router-dom'
import { FiHome, FiShoppingBag } from 'react-icons/fi'
import './NotFoundPage.css'

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container not-found-content">
        <span className="not-found-code">404</span>
        <h1>Página no encontrada</h1>
        <p>La sección o prenda que estás buscando no existe o fue movida.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            <FiHome size={18} />
            <span>Volver al Inicio</span>
          </Link>
          <Link to="/catalogo" className="btn-secondary">
            <FiShoppingBag size={18} />
            <span>Ver Catálogo</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
