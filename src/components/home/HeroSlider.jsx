import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi'
import './HeroSlider.css'

export const DEFAULT_SLIDES = [
  {
    id: 1,
    category: 'TEMPORADA 2026 • INDUMENTARIA DEPORTIVA & URBANA',
    title: 'Nueva Colección Streetwear & Deportivo',
    subtitle: 'Buzos frizados, bermudas y conjuntos de máxima calidad. Despachamos a todo el país por Andreani y Vía Cargo.',
    ctaText: 'Ver Colección 2026',
    ctaLink: '/catalogo',
    bg: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 2,
    category: 'SELECCIÓN ARGENTINA 2026',
    title: 'Buzos Medio Cierre Calidad Premium',
    subtitle: 'Semi friza técnica, cierres reforzados y escudos bordados con orificio pasapulgar en mangas.',
    ctaText: 'Ver Buzos en Stock',
    ctaLink: '/catalogo?category=buzos',
    bg: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 3,
    category: 'LOGÍSTICA & RETIROS',
    title: 'Envíos Nacionales & Retiro en San Martín',
    subtitle: 'Retirá sin costo en Dr. marcos zimmermann 3339 de lunes a viernes de 10 a 20hs, o recibí en tu domicilio.',
    ctaText: 'Punto de Retiro & Envíos',
    ctaLink: '/nosotros',
    bg: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1600&q=80',
  },
]

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DEFAULT_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % DEFAULT_SLIDES.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + DEFAULT_SLIDES.length) % DEFAULT_SLIDES.length)
  }

  return (
    <div className="hero-slider">
      {DEFAULT_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`hero-slide ${idx === currentSlide ? 'hero-slide--active' : ''}`}
          style={{ backgroundImage: `url(${slide.bg})` }}
        >
          <div className="hero-slide__overlay"></div>
          <div className="container hero-slide__container">
            <div className="hero-slide__content">
              <span className="hero-slide__category">{slide.category}</span>
              <h1 className="hero-slide__title">{slide.title}</h1>
              <p className="hero-slide__subtitle">{slide.subtitle}</p>
              <Link to={slide.ctaLink} className="btn-primary hero-slide__btn">
                <span>{slide.ctaText}</span>
                <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Nav Controls */}
      <button className="hero-slider__arrow hero-slider__arrow--left" onClick={prevSlide} aria-label="Anterior">
        <FiChevronLeft size={24} />
      </button>
      <button className="hero-slider__arrow hero-slider__arrow--right" onClick={nextSlide} aria-label="Siguiente">
        <FiChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="hero-slider__dots">
        {DEFAULT_SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`hero-slider__dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Ir a diapositiva ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
