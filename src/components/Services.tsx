'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

const services = [
  {
    id: 'web',
    icon: 'fa-solid fa-code',
    iconBg: '#1A1E29',
    iconColor: '#FFFFFF',
    accentColor: '#5C6CFF',
    accentLight: 'rgba(92,108,255,0.12)',
    title: 'Desarrollo Web',
    description: 'Sitios web modernos, rápidos y personalizados para tu marca con tecnología de vanguardia.',
    tags: ['Next.js', 'React', 'Tailored UI'],
  },
  {
    id: 'auto',
    icon: 'fa-solid fa-gear',
    iconBg: '#E6FAF6',
    iconColor: '#19C3A0',
    accentColor: '#19C3A0',
    accentLight: 'rgba(25,195,160,0.12)',
    title: 'Automatización',
    description: 'Optimiza tus procesos con soluciones inteligentes, escalables y conectadas a tus herramientas.',
    tags: ['WhatsApp API', 'n8n', 'AI Flows'],
  },
  {
    id: 'systems',
    icon: 'fa-solid fa-cloud',
    iconBg: '#EEF2FF',
    iconColor: '#4C5BFF',
    accentColor: '#4C5BFF',
    accentLight: 'rgba(76,91,255,0.12)',
    title: 'Sistemas a Medida',
    description: 'Aplicaciones y plataformas adaptadas exactamente a tus necesidades operativas.',
    tags: ['CRM', 'Dashboard', 'API Custom'],
  },
  {
    id: 'ecommerce',
    icon: 'fa-solid fa-cart-shopping',
    iconBg: '#FFF0F6',
    iconColor: '#e040a0',
    accentColor: '#e040a0',
    accentLight: 'rgba(224,64,160,0.12)',
    title: 'E-Commerce',
    description: 'Tiendas en línea de alta conversión con pasarela de pagos, inventario y logística integrados.',
    tags: ['Stripe', 'Supabase', 'SEO'],
  },
  {
    id: 'analytics',
    icon: 'fa-solid fa-chart-line',
    iconBg: '#FFF8E1',
    iconColor: '#f59e0b',
    accentColor: '#f59e0b',
    accentLight: 'rgba(245,158,11,0.12)',
    title: 'Analytics & Data',
    description: 'Paneles de control en tiempo real para tomar decisiones basadas en datos precisos.',
    tags: ['Dashboards', 'KPIs', 'Reportes'],
  },
  {
    id: 'crm',
    icon: 'fa-solid fa-users',
    iconBg: '#F3E8FF',
    iconColor: '#9333ea',
    accentColor: '#9333ea',
    accentLight: 'rgba(147,51,234,0.12)',
    title: 'CRM & Clientes',
    description: 'Gestiona tu base de clientes, seguimientos y ventas desde un solo lugar.',
    tags: ['Pipeline', 'Follow-up', 'Reportes'],
  },
]

// Triplicate cards for an endless seamless loop in both directions
const allCards = [...services, ...services, ...services]

export default function Services() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInteractingRef = useRef<boolean>(false)
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isDraggingRef = useRef<boolean>(false)
  const startXRef = useRef<number>(0)
  const startScrollLeftRef = useRef<number>(0)
  const hasMovedRef = useRef<boolean>(false)

  // Pause continuous auto-scroll while interacting
  const pauseAutoScroll = useCallback(() => {
    isInteractingRef.current = true
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }, [])

  // Resume auto-scroll smoothly after user stops touching or scrolling
  const resumeAutoScroll = useCallback((delay = 1800) => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
    }
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false
    }, delay)
  }, [])

  // Touch handlers for mobile
  const handleTouchStart = () => {
    pauseAutoScroll()
  }

  const handleTouchEnd = () => {
    resumeAutoScroll(1600)
  }

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    isDraggingRef.current = true
    hasMovedRef.current = false
    pauseAutoScroll()
    startXRef.current = e.pageX - scrollRef.current.offsetLeft
    startScrollLeftRef.current = scrollRef.current.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return
    const x = e.pageX - scrollRef.current.offsetLeft
    const distance = x - startXRef.current
    if (Math.abs(distance) > 4) {
      hasMovedRef.current = true
    }
    scrollRef.current.scrollLeft = startScrollLeftRef.current - distance * 1.15
  }

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      resumeAutoScroll(1600)
    }
  }

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
    }
    resumeAutoScroll(800)
  }

  // Animation frame loop for continuous smooth auto-scrolling
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    // Center scroll position on initial load
    const initMiddle = () => {
      const setWidth = el.scrollWidth / 3
      if (setWidth > 0 && el.scrollLeft === 0) {
        el.scrollLeft = setWidth
      }
    }
    initMiddle()

    let animId: number
    let lastTime = performance.now()

    const step = (time: number) => {
      const delta = Math.min(time - lastTime, 40) // avoid frame jumps
      lastTime = time

      if (!isInteractingRef.current && el) {
        // Continuous gentle motion (approx 36px/sec)
        const speed = 0.58
        el.scrollLeft += (speed * delta) / 16

        const singleSetWidth = el.scrollWidth / 3
        if (singleSetWidth > 0) {
          if (el.scrollLeft >= singleSetWidth * 2) {
            el.scrollLeft -= singleSetWidth
          } else if (el.scrollLeft <= 5) {
            el.scrollLeft += singleSetWidth
          }
        }
      }

      animId = requestAnimationFrame(step)
    }

    animId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(animId)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [])

  return (
    <section id="servicios" className="services-section">
      {/* Header */}
      <div className="container-xl mb-4 mb-md-5">
        <ScrollReveal>
          <div className="text-center">
            <p className="section-label justify-content-center">NUESTROS SERVICIOS</p>
            <h2
              className="section-title mb-2"
              style={{
                fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
                fontWeight: 900,
                color: '#1A1E29',
              }}
            >
              Soluciones que se{' '}
              <span className="grad-text">adaptan a ti</span>
            </h2>
            <p
              style={{
                color: 'rgba(26,30,41,0.6)',
                fontSize: '0.96rem',
                maxWidth: '520px',
                margin: '0 auto',
                padding: '0 1rem',
              }}
            >
              Tecnología, creatividad y estrategia para hacer crecer tu negocio.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Interactive Infinite Scroll Strip */}
      <div className="services-interactive-wrapper">
        <div className="services-fade-left d-none d-md-block" />
        <div className="services-fade-right d-none d-md-block" />

        <div
          ref={scrollRef}
          className="services-interactive-scroll"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={pauseAutoScroll}
          onMouseLeave={handleMouseLeave}
          onWheel={() => {
            pauseAutoScroll()
            resumeAutoScroll(1500)
          }}
        >
          <div className="services-track-container">
            {allCards.map((s, i) => (
              <div
                key={`${s.id}-${i}`}
                className="service-h-card"
                id={i < services.length ? `service-card-${s.id}` : undefined}
              >
                {/* Left accent bar */}
                <div
                  className="service-h-accent-bar"
                  style={{ background: s.accentColor }}
                />

                {/* Icon */}
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: s.iconBg,
                    color: s.iconColor,
                    fontSize: '1.15rem',
                  }}
                >
                  <i className={s.icon} />
                </div>

                {/* Text */}
                <div className="service-h-text flex-grow-1">
                  <h3
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: '#1A1E29',
                      marginBottom: '0.25rem',
                      lineHeight: 1.25,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      color: 'rgba(26,30,41,0.58)',
                      fontSize: '0.78rem',
                      lineHeight: 1.45,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {s.description}
                  </p>
                  <div className="d-flex flex-wrap gap-1">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge rounded-pill"
                        style={{
                          background: s.accentLight,
                          color: s.accentColor,
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '0.18rem 0.5rem',
                          border: `1px solid ${s.accentColor}33`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <a
                  href="#contacto"
                  onClick={(e) => {
                    if (hasMovedRef.current) e.preventDefault()
                  }}
                  className="service-h-cta d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: `linear-gradient(135deg, ${s.accentColor} 0%, ${s.accentColor}bb 100%)`,
                    color: '#fff',
                    fontSize: '0.78rem',
                    boxShadow: `0 4px 14px ${s.accentColor}44`,
                    textDecoration: 'none',
                  }}
                  aria-label={`Ver más de ${s.title}`}
                >
                  <i className="fa-solid fa-arrow-right" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button with balanced spacing */}
      <div className="text-center mt-4 mt-md-5">
        <ScrollReveal>
          <a href="#contacto" className="btn-sk-primary" id="services-explore-link">
            <span>Explora todos los servicios</span>
            <i className="fa-solid fa-arrow-right" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
