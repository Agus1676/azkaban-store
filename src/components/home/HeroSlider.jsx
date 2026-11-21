import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi'
import { getStoredConfig } from '../../services/storeDb'
import './HeroSlider.css'

const DEFAULT_SLIDES = [
  {
    id: 1,
    category: 'TEMPORADA 2026 • INDUMENTARIA DEPORTIVA & URBANA',
    title: 'Nueva Colección Streetwear & Deportivo',
    subtitle: 'Buzos frizados, bermudas y conjuntos de máxima calidad. Despachamos a todo el país por Andreani Express con seguimiento.',
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

const loadSlides = () => {
  try {
    const config = getStoredConfig()
    if (Array.isArray(config.banners) && config.banners.length > 0) {
      return config.banners.map((b, i) => ({
        id: b.id || i + 1,
        category: b.tag || 'TEMPORADA 2026',
        title: b.title || 'Nueva Colección',
        subtitle: b.subtitle || 'Indumentaria Deportiva y Urbana',
        ctaText: b.buttonText || 'Ver Catálogo',
        ctaLink: b.buttonLink || '/catalogo',
        bg: b.imageUrl || 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1600&q=80',
      }))
    }
  } catch (e) {
    console.warn('Error reading hero slides:', e)
  }
  return DEFAULT_SLIDES
}

const HeroSlider = () => {
  const [slides, setSlides] = useState(loadSlides)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const handleUpdate = () => {
      const updated = loadSlides()
      setSlides(updated)
      setCurrentSlide(0)
    }
    window.addEventListener('azkaban_config_updated', handleUpdate)
    return () => window.removeEventListener('azkaban_config_updated', handleUpdate)
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="hero-slider">
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`hero-slide ${idx === currentSlide ? 'hero-slide--active' : ''}`}
          style={{ backgroundImage: `url(${slide.bg})` }}
        >
          <div className="hero-slide__overlay" />
          <div className="container hero-slide__container">
            <div className="hero-slide__content">
              <span className="hero-slide__badge">{slide.category}</span>
              <h2 className="hero-slide__title">{slide.title}</h2>
              <p className="hero-slide__subtitle">{slide.subtitle}</p>
              <div className="hero-slide__actions">
                <Link to={slide.ctaLink} className="hero-slide__btn">
                  <span>{slide.ctaText}</span>
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            className="hero-slider__arrow hero-slider__arrow--prev"
            onClick={prevSlide}
            aria-label="Slide anterior"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            className="hero-slider__arrow hero-slider__arrow--next"
            onClick={nextSlide}
            aria-label="Slide siguiente"
          >
            <FiChevronRight size={24} />
          </button>

          <div className="hero-slider__dots">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`hero-slider__dot ${idx === currentSlide ? 'hero-slider__dot--active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default HeroSlider
