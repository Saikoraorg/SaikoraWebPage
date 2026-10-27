'use client'

import { useState, useEffect } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

interface ClientProject {
  id: string
  clientName: string
  clientCategory: string
  projectName: string
  icon: string
  tag: string
  accentColor: string
  description: string
  features: string[]
  metrics: { label: string; value: string }[]
  technologies: string[]
}

const clientProjects: ClientProject[] = [
  {
    id: 'on-fleek',
    clientName: 'On Fleek',
    clientCategory: 'Salud, Estilo & Belleza',
    projectName: 'Sistema de Agendamiento y Control de Citas 24/7',
    icon: 'fa-solid fa-calendar-check',
    tag: 'Agendamiento Inteligente',
    accentColor: '#19C3A0',
    description:
      'Desarrollamos una plataforma digital integral de reservas para On Fleek, permitiendo a los clientes agendar citas en línea en tiempo real eligiendo su especialista, servicio y horario disponible. Incluye panel de control para el personal, confirmación automática por WhatsApp y sincronización de agendas para evitar solapamientos.',
    features: [
      'Reserva de citas 24/7 sin llamadas telefónicas ni tiempos de espera',
      'Recordatorios automáticos por WhatsApp y correo electrónico',
      'Panel de administración con métricas de ocupación e ingresos en tiempo real',
      'Sincronización para calendarizacion de citas y eventos',
    ],
    metrics: [
      { label: 'Citas perdidas reducidas', value: '85%' },
      { label: 'Disponibilidad de agenda', value: '24/7' },
      { label: 'Ahorro semanal de tiempo', value: '+20 hrs' },
    ],
    technologies: ['Next.js', 'Supabase', 'WhatsApp API', 'CSS Custom'],
  },
  {
    id: 'estudio-foto',
    clientName: 'Estudio Fotográfico Nicole Valerio',
    clientCategory: 'Fotografía & Creativos',
    projectName: 'Página Web para Estudio Fotográfico Profesional',
    icon: 'fa-solid fa-camera',
    tag: 'Presencia Digital',
    accentColor: '#4C5BFF',
    description:
      'Diseñamos y desarrollamos un sitio web elegante y veloz para un estudio fotográfico profesional, con galería dinámica de portafolio, sistema de reserva de sesiones en línea, integración con Instagram y formulario de contacto inteligente.',
      
    features: [
      'Galería de portafolio con categorías y lightbox profesional',
      'Sistema de reserva de sesiones fotográficas en línea',
      'Integración con Instagram para mostrar publicaciones recientes',
      'Formulario inteligente con confirmación automática al cliente',
    ],
    metrics: [
      { label: 'Reservas online mensuales', value: '+60%' },
      { label: 'Puntuación personalizada', value: '98/100' },
    ],
    technologies: ['Next.js', 'Framer Motion', 'Instagram API', 'Vercel'],
  },
  /* {
    id: 'la-finca',
    clientName: 'Restaurante La Finca',
    clientCategory: 'Gastronomía & Restauración',
    projectName: 'Automatización de Pedidos y Control de Inventario',
    icon: 'fa-solid fa-utensils',
    tag: 'POS & Inventario Digital',
    accentColor: '#19C3A0',
    description:
      'Implementación de un sistema de comandas táctiles digitales (POS) para meseros y pantalla en cocina en tiempo real, conectado a la gestión de inventario automatizada que descuenta insumos con cada orden despachada.',
    features: [
      'Comandas digitales instantáneas desde tabletas a pantalla de cocina',
      'Descuento automático de stock de ingredientes por platillo servido',
      'Alertas de inventario bajo y reportes de insumos más consumidos',
      'Cierre de caja y facturación con reportes exportables en 1 clic',
    ],
    metrics: [
      { label: 'Menos tiempo en pedidos', value: '60%' },
      { label: 'Extravíos de comandas', value: '0%' },
      { label: 'Trazabilidad de stock', value: '100%' },
    ],
    technologies: ['Next.js', 'PostgreSQL / Supabase', 'WebSockets', 'PWA Táctil'],
  },
  {
    id: 'logistica-express',
    clientName: 'Logística Express',
    clientCategory: 'Transporte & Envíos',
    projectName: 'Plataforma de Tracking y Despacho en Tiempo Real',
    icon: 'fa-solid fa-truck-fast',
    tag: 'Logística & Geolocalización',
    accentColor: '#4C5BFF',
    description:
      'Sistema web centralizado para asignación inteligente de rutas de mensajería, lectura de códigos QR en bodegas y enlace de seguimiento en vivo por GPS para clientes finales.',
    features: [
      'Enlace de seguimiento en vivo por mapa sin necesidad de instalar apps',
      'Asignación inteligente de rutas para optimizar combustible y tiempo',
      'Firma digital y fotografía como comprobante de entrega en destino',
      'Dashboard gerencial de tiempos promedio de entrega por mensajero',
    ],
    metrics: [
      { label: 'Menos reclamos de rastreo', value: '70%' },
      { label: 'Órdenes geolocalizadas', value: '100%' },
      { label: 'Entregas a tiempo', value: '98.5%' },
    ],
    technologies: ['Next.js', 'Mapbox', 'Supabase Realtime', 'React Native'],
  }, */
]

// Nichos / industries carousel items
const nichos = [
  { icon: 'fa-solid fa-scissors', label: 'Salud & Belleza', color: '#19C3A0' },
  { icon: 'fa-solid fa-camera', label: 'Fotografía', color: '#4C5BFF' },
  { icon: 'fa-solid fa-utensils', label: 'Restaurantes', color: '#f59e0b' },
  { icon: 'fa-solid fa-truck-fast', label: 'Logística', color: '#19C3A0' },
  { icon: 'fa-solid fa-cart-shopping', label: 'E-Commerce', color: '#4C5BFF' },
  { icon: 'fa-solid fa-home', label: 'Inmobiliaria', color: '#e040a0' },
  { icon: 'fa-solid fa-dumbbell', label: 'Fitness & Gym', color: '#f59e0b' },
  { icon: 'fa-solid fa-graduation-cap', label: 'Educación', color: '#19C3A0' },
]

export default function Stats() {
  const [selectedClient, setSelectedClient] = useState<ClientProject | null>(null)

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedClient(null)
    }
    if (selectedClient) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedClient])

  return (
    <section className="stats-section-v2" id="nosotros" style={{ background: '#FBFBFD', padding: '1.5rem 0 5.5rem' }}>
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <ScrollReveal>
          {/* Main Floating Pill Container */}
          <div
            className="stats-pill-container shadow-sm position-relative overflow-hidden"
            style={{
              background: '#FFFFFF',
              borderRadius: '40px',
              border: '1.5px solid rgba(226, 232, 240, 0.85)',
              padding: '1.6rem 2.8rem',
              boxShadow: '0 18px 45px rgba(26, 30, 41, 0.05)',
            }}
          >
            <div
              className="d-flex align-items-center justify-content-between flex-nowrap"
              style={{
                gap: '1.5rem',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {/* ITEM 1: Manejamos tus proyectos a tu gusto */}
              <div
                className="stat-pill-item d-flex align-items-center gap-3 flex-shrink-0"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <div
                  className="stat-icon-box d-flex align-items-center justify-content-center shadow-xs"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: '#EEF2FF',
                    color: '#4C5BFF',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="fa-solid fa-rocket" />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1A1E29', lineHeight: 1.25 }}>
                    Manejamos tus proyectos
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#4C5BFF', lineHeight: 1.25 }}>
                    a tu gusto
                  </div>
                </div>
              </div>

              {/* ITEM 2: Diferentes nichos */}
              <div className="stat-pill-item d-flex align-items-center gap-3 flex-shrink-0" style={{ padding: '0.4rem 0.6rem' }}>
                <div
                  className="stat-icon-box d-flex align-items-center justify-content-center shadow-xs"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: '#E6FAF6',
                    color: '#19C3A0',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="fa-solid fa-store" />
                </div>
                <div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#1A1E29', lineHeight: 1 }}>
                    8+
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 500, color: '#64748b', whiteSpace: 'nowrap' }}>
                    Nichos para tu negocio
                  </div>
                </div>
              </div>

              {/* ITEM 3: Ver productos destacados de nuestros clientes (interactive) */}
              <div
                className="stat-pill-item d-flex align-items-center gap-3 flex-shrink-0"
                onClick={() => setSelectedClient(clientProjects[0])}
                role="button"
                tabIndex={0}
                style={{
                  cursor: 'pointer',
                  padding: '0.4rem 0.6rem',
                }}
                title="Ver productos destacados de nuestros clientes"
              >
                <div
                  className="stat-icon-box d-flex align-items-center justify-content-center shadow-xs"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'var(--grad-primary)',
                    color: '#FFFFFF',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="fa-solid fa-star" />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1A1E29', lineHeight: 1.25 }}>
                    Ver productos destacados
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#19C3A0', lineHeight: 1.25 }}>
                    de nuestros clientes →
                  </div>
                </div>
              </div>

              {/* ITEM 4: 24/7 Soporte */}
              <div className="stat-pill-item d-flex align-items-center gap-3 flex-shrink-0" style={{ padding: '0.4rem 0.6rem' }}>
                <div
                  className="stat-icon-box d-flex align-items-center justify-content-center shadow-xs"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: '#EEF2FF',
                    color: '#4C5BFF',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="fa-solid fa-shield-halved" />
                </div>
                <div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#1A1E29', lineHeight: 1 }}>
                    24/7
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 500, color: '#64748b', whiteSpace: 'nowrap' }}>
                    Soporte y mantenimiento
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Nichos strip */}
        <ScrollReveal delay={150}>
          <div className="mt-4 d-flex align-items-center gap-2 flex-wrap justify-content-center">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '0.5rem' }}>
              Diferentes nichos:
            </span>
            {nichos.map((n, i) => (
              <span
                key={i}
                className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                style={{
                  background: `${n.color}12`,
                  border: `1px solid ${n.color}30`,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: n.color,
                  whiteSpace: 'nowrap',
                }}
              >
                <i className={n.icon} style={{ fontSize: '0.65rem' }} />
                {n.label}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* POPUP / MODAL */}
      {selectedClient && (
        <div
          className="client-modal-backdrop position-fixed inset-0 d-flex align-items-center justify-content-center p-3"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 9999,
            animation: 'fadeIn 0.25s ease',
          }}
          onClick={() => setSelectedClient(null)}
        >
          <div
            className="client-modal-card rounded-5 p-4 p-md-5 position-relative shadow-2xl"
            style={{
              background: '#FFFFFF',
              borderRadius: '28px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1.5px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              animation: 'modalSlideUp 0.3s cubic-bezier(.22,1,.36,1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedClient(null)}
              className="position-absolute rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm"
              style={{
                top: '20px',
                right: '20px',
                width: '38px',
                height: '38px',
                background: '#f1f5f9',
                color: '#64748b',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              aria-label="Cerrar modal"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            {/* Modal Header Title */}
            <div className="mb-3 pe-5">
              <span
                className="badge rounded-pill mb-1"
                style={{
                  background: 'rgba(25, 195, 160, 0.12)',
                  color: 'var(--sk-teal-mid)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                ⭐ PRODUCTOS DESTACADOS
              </span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A1E29', margin: 0 }}>
                Productos destacados de nuestros clientes
              </h4>
            </div>

            {/* Client Tabs Switcher inside Modal */}
            <div className="d-flex flex-wrap gap-2 mb-4 pe-5">
              {clientProjects.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className="rounded-pill border-0 px-3 py-1"
                  style={{
                    background:
                      selectedClient.id === client.id
                        ? 'var(--grad-primary)'
                        : '#f1f5f9',
                    color: selectedClient.id === client.id ? '#FFFFFF' : '#475569',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {client.clientName}
                </button>
              ))}
            </div>

            {/* Header: Client Icon & Badge */}
            <div className="d-flex align-items-start gap-3 mb-3">
              <div
                className="rounded-4 d-flex align-items-center justify-content-center shadow-md flex-shrink-0"
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'var(--grad-primary)',
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  borderRadius: '18px',
                }}
              >
                <i className={selectedClient.icon} />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span
                    className="badge rounded-pill"
                    style={{
                      background: 'rgba(25, 195, 160, 0.12)',
                      color: 'var(--sk-teal-mid)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {selectedClient.clientCategory}
                  </span>
                  <span
                    className="badge rounded-pill"
                    style={{
                      background: 'rgba(76, 91, 255, 0.1)',
                      color: 'var(--sk-blue)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {selectedClient.tag}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: '#1A1E29',
                    lineHeight: 1.2,
                    marginBottom: 0,
                  }}
                >
                  {selectedClient.projectName}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                  Caso de Éxito para: <strong style={{ color: '#1A1E29' }}>{selectedClient.clientName}</strong>
                </div>
              </div>
            </div>

            {/* Main Description */}
            <div
              className="p-3 my-3 rounded-4"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.92rem',
                color: '#334155',
                lineHeight: 1.65,
              }}
            >
              {selectedClient.description}
            </div>

            {/* Metrics Row */}
            <div className="row g-2 my-3">
              {selectedClient.metrics.map((metric, idx) => (
                <div key={idx} className="col-4">
                  <div
                    className="p-3 rounded-4 text-center"
                    style={{
                      background: 'rgba(25, 195, 160, 0.06)',
                      border: '1px solid rgba(25, 195, 160, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 900,
                        color: 'var(--sk-teal-mid)',
                        lineHeight: 1,
                        marginBottom: '0.25rem',
                      }}
                    >
                      {metric.value}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                      {metric.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Features List */}
            <div className="my-3">
              <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1A1E29', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                Lo que implementamos:
              </h5>
              <div className="d-flex flex-column gap-2">
                {selectedClient.features.map((feat, idx) => (
                  <div key={idx} className="d-flex align-items-start gap-2" style={{ fontSize: '0.86rem', color: '#475569' }}>
                    <i className="fa-solid fa-circle-check mt-1" style={{ color: 'var(--sk-teal)', fontSize: '0.9rem' }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="d-flex flex-wrap align-items-center gap-2 pt-2 mb-4">
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Tecnologías:
              </span>
              {selectedClient.technologies.map((tech) => (
                <span
                  key={tech}
                  className="badge px-2 py-1 rounded-pill"
                  style={{ background: '#e2e8f0', color: '#334155', fontSize: '0.72rem', fontWeight: 600 }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="d-flex align-items-center justify-content-between pt-3 border-top">
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                ¿Quieres implementar un sistema similar?
              </span>
              <a
                href="#contacto"
                className="btn-sk-primary"
                onClick={() => setSelectedClient(null)}
                style={{ padding: '0.65rem 1.4rem', fontSize: '0.86rem' }}
              >
                <span>Solicitar propuesta</span>
                <i className="fa-solid fa-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
