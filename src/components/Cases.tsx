'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

interface CaseItem {
  id: number
  badge: string
  category: string
  title: string
  description: string
  resultValue: string
  resultLabel: string
  accentColor: string
  icon: string
  features: string[]
  mockupType: 'agendamiento' | 'fotografia'
}

const cases: CaseItem[] = [
  {
    id: 1,
    badge: 'On Fleek',
    category: 'Salud, Estilo & Belleza',
    title: 'Sistema de Agendamiento y Control de Citas 24/7',
    description:
      'Plataforma digital integral de reservas que permite agendar citas en tiempo real, con confirmación automática por WhatsApp y panel de control para el personal.',
    resultValue: '85%',
    resultLabel: 'menos citas perdidas',
    accentColor: '#19C3A0',
    icon: 'fa-solid fa-calendar-check',
    features: [
      'Reservas 24/7 sin llamadas',
      'Recordatorios por WhatsApp',
      'Panel con métricas en tiempo real',
    ],
    mockupType: 'agendamiento',
  },
  {
    id: 2,
    badge: 'Estudio Fotográfico',
    category: 'Fotografía & Creativos',
    title: 'Página Web para Estudio Fotográfico Profesional',
    description:
      'Sitio web elegante con galería dinámica, sistema de reserva de sesiones en línea e integración con redes sociales para un estudio fotográfico de alta gama.',
    resultValue: '+60%',
    resultLabel: 'en reservas online',
    accentColor: '#4C5BFF',
    icon: 'fa-solid fa-camera',
    features: [
      'Galería con portafolio dinámico',
      'Reserva de sesiones en línea',
      'Integración con Instagram',
    ],
    mockupType: 'fotografia',
  },
]

export default function Cases() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null)

  const goTo = (idx: number, dir: 'left' | 'right') => {
    setAnimDir(dir)
    setTimeout(() => {
      setActiveIdx(idx)
      setAnimDir(null)
    }, 260)
  }

  const prev = () => goTo(activeIdx === 0 ? cases.length - 1 : activeIdx - 1, 'right')
  const next = () => goTo(activeIdx === cases.length - 1 ? 0 : activeIdx + 1, 'left')

  const caseItem = cases[activeIdx]

  return (
    <section id="proyectos" className="cases-section">
      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-5">
            <p className="section-label justify-content-center">NUESTROS PROYECTOS</p>
            <h2
              className="section-title mb-3"
              style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', lineHeight: 1.15 }}
            >
              Historias reales,{' '}
              <span className="grad-text">resultados tangibles</span>
            </h2>
            <p
              style={{
                color: 'rgba(26, 30, 41, 0.65)',
                fontSize: '0.94rem',
                lineHeight: '1.75',
                maxWidth: '520px',
                margin: '0 auto',
              }}
            >
              Proyectos donde la tecnología marcó la diferencia para nuestros clientes.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Project Card */}
        <ScrollReveal>
          <div
            className={`case-card-modern ${animDir === 'left' ? 'slide-exit-left' : animDir === 'right' ? 'slide-exit-right' : 'slide-enter'}`}
            id={`case-card-${caseItem.id}`}
          >
            {/* Ambient glow */}
            <div
              style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${caseItem.accentColor}28 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            <div className="row g-0 align-items-stretch h-100">
              {/* Left: Info panel */}
              <div className="col-lg-6 d-flex flex-column p-4 p-lg-5 position-relative" style={{ zIndex: 2 }}>
                {/* Badge */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '46px',
                      height: '46px',
                      background: `${caseItem.accentColor}22`,
                      color: caseItem.accentColor,
                      fontSize: '1.1rem',
                    }}
                  >
                    <i className={caseItem.icon} />
                  </div>
                  <div>
                    <span
                      className="badge rounded-pill"
                      style={{
                        background: `${caseItem.accentColor}20`,
                        color: caseItem.accentColor,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        border: `1px solid ${caseItem.accentColor}44`,
                        marginRight: '0.35rem',
                      }}
                    >
                      {caseItem.badge}
                    </span>
                    <span
                      className="badge rounded-pill"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                      }}
                    >
                      {caseItem.category}
                    </span>
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.25,
                    marginBottom: '1rem',
                  }}
                >
                  {caseItem.title}
                </h3>

                <p
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: '0.88rem',
                    lineHeight: 1.7,
                    marginBottom: '1.5rem',
                  }}
                >
                  {caseItem.description}
                </p>

                {/* Features */}
                <div className="d-flex flex-column gap-2 mb-auto">
                  {caseItem.features.map((feat, i) => (
                    <div key={i} className="d-flex align-items-center gap-2">
                      <i
                        className="fa-solid fa-circle-check"
                        style={{ color: caseItem.accentColor, fontSize: '0.85rem' }}
                      />
                      <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.84rem' }}>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-4 d-flex align-items-center gap-3">
                  <a href="#contacto" className="btn-sk-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.86rem' }}>
                    <span>Quiero algo similar</span>
                    <i className="fa-solid fa-arrow-right" />
                  </a>
                </div>
              </div>

              {/* Right: Metric + Mockup panel */}
              <div
                className="col-lg-6 d-flex flex-column align-items-center justify-content-center p-4 p-lg-5"
                style={{
                  background: 'rgba(0,0,0,0.18)',
                  borderLeft: '1px solid rgba(255,255,255,0.07)',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {/* Result Big Metric */}
                <div className="text-center mb-4">
                  <div
                    className="case-result-metric"
                    style={{ '--case-accent': caseItem.accentColor } as React.CSSProperties}
                  >
                    {caseItem.resultValue}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.25rem' }}>
                    {caseItem.resultLabel}
                  </div>
                </div>

                {/* Mockup window */}
                <div
                  className="case-mockup-window"
                  style={{
                    width: '100%',
                    maxWidth: '280px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Window chrome */}
                  <div
                    className="d-flex align-items-center gap-1 px-3"
                    style={{ height: '32px', background: 'rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f56' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ffbd2e' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#27c93f' }} />
                  </div>

                  {/* Mockup content */}
                  <div className="p-3">
                    {caseItem.mockupType === 'agendamiento' && (
                      <div className="d-flex flex-column gap-2">
                        <div
                          className="p-2 rounded-3 d-flex align-items-center justify-content-between"
                          style={{ background: 'rgba(25,195,160,0.12)', border: '1px solid rgba(25,195,160,0.2)' }}
                        >
                          <span style={{ fontSize: '0.7rem', color: '#19C3A0', fontWeight: 700 }}>✦ 14:00 · María García</span>
                          <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>Confirmada</span>
                        </div>
                        <div
                          className="p-2 rounded-3 d-flex align-items-center justify-content-between"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>15:30 · Ana López</span>
                          <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>Pendiente</span>
                        </div>
                        <div
                          className="p-2 rounded-3 d-flex align-items-center justify-content-between"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>17:00 · Carlos M.</span>
                          <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>Pendiente</span>
                        </div>
                        <div className="d-flex align-items-center gap-1 mt-1">
                          <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '0.75rem' }} />
                          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)' }}>Recordatorio enviado automáticamente</span>
                        </div>
                      </div>
                    )}
                    {caseItem.mockupType === 'fotografia' && (
                      <div className="d-flex flex-column gap-2">
                        <div
                          className="rounded-3 overflow-hidden"
                          style={{ height: '60px', background: 'linear-gradient(135deg, #4C5BFF22, #19C3A022)', border: '1px solid rgba(76,91,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <i className="fa-solid fa-image" style={{ color: 'rgba(76,91,255,0.6)', fontSize: '1.4rem' }} />
                        </div>
                        <div className="d-flex gap-1">
                          <div style={{ flex: 1, height: '32px', borderRadius: '6px', background: 'rgba(76,91,255,0.15)', border: '1px solid rgba(76,91,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-camera" style={{ color: '#4C5BFF', fontSize: '0.7rem' }} />
                          </div>
                          <div style={{ flex: 1, height: '32px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-brands fa-instagram" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }} />
                          </div>
                          <div style={{ flex: 1, height: '32px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-calendar" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }} />
                          </div>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                          <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #4C5BFF, #19C3A0)', borderRadius: '2px' }} />
                        </div>
                        <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>72% reservas completadas este mes</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Navigation + dots */}
        <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
          <button
            className="carousel-nav-btn"
            onClick={prev}
            aria-label="Proyecto anterior"
            id="cases-prev-btn"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>

          {cases.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > activeIdx ? 'left' : 'right')}
              style={{
                width: i === activeIdx ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: i === activeIdx ? 'var(--grad-primary)' : 'rgba(26,30,41,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
              aria-label={`Ir al proyecto ${i + 1}`}
            />
          ))}

          <button
            className="carousel-nav-btn"
            onClick={next}
            aria-label="Siguiente proyecto"
            id="cases-next-btn"
          >
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>
    </section>
  )
}
