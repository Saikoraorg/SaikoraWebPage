'use client'

import { useRef, useState } from 'react'
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

// Duplicate for infinite loop
const allCards = [...services, ...services]

export default function Services() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <section
      id="servicios"
      className="services-section"
      style={{ background: '#FBFBFD', padding: '5.5rem 0', overflow: 'hidden' }}
    >
      {/* Header */}
      <div className="container-xl mb-5">
        <ScrollReveal>
          <div className="text-center">
            <p className="section-label justify-content-center">NUESTROS SERVICIOS</p>
            <h2
              className="section-title mb-2"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
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
                fontSize: '1rem',
                maxWidth: '520px',
                margin: '0 auto',
              }}
            >
              Tecnología, creatividad y estrategia para hacer crecer tu negocio.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Infinite Scroll Strip */}
      <div
        className="services-scroll-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="services-fade-left" />
        <div className="services-fade-right" />

        <div className={`services-scroll-track${isPaused ? ' paused' : ''}`}>
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
                  width: '50px',
                  height: '50px',
                  borderRadius: '15px',
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
                    fontSize: '1rem',
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
                    fontSize: '0.79rem',
                    lineHeight: 1.5,
                    marginBottom: '0.55rem',
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
                        fontSize: '0.63rem',
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
                className="service-h-cta d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: '38px',
                  height: '38px',
                  background: `linear-gradient(135deg, ${s.accentColor} 0%, ${s.accentColor}bb 100%)`,
                  color: '#fff',
                  fontSize: '0.78rem',
                  boxShadow: `0 4px 14px ${s.accentColor}44`,
                  textDecoration: 'none',
                }}
              >
                <i className="fa-solid fa-arrow-right" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-5">
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
