'use client'

import { useState } from 'react'
import SaikoraLogo from '@/components/SaikoraLogo'
import ScrollReveal from '@/components/ScrollReveal'

interface FormData {
  nombre: string
  email: string
  servicio: string
  mensaje: string
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    servicio: '',
    mensaje: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // State for Meeting Modal
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [meetingForm, setMeetingForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    hora: '10:00 AM',
    medio: 'Google Meet',
    notas: '',
  })
  const [meetingSubmitting, setMeetingSubmitting] = useState(false)
  const [meetingSuccess, setMeetingSuccess] = useState(false)
  const [meetingError, setMeetingError] = useState<string | null>(null)

  const handleMeetingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setMeetingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMeetingSubmitting(true)
    setMeetingError(null)

    try {
      const res = await fetch('/api/agendar-reunion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingForm),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Error al agendar la reunión')
      }

      setMeetingSuccess(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMeetingError(err.message)
      } else {
        setMeetingError('Ocurrió un error inesperado al agendar la reunión')
      }
    } finally {
      setMeetingSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al enviar el formulario')
      }

      setStatus('success')
      setFormData({ nombre: '', email: '', servicio: '', mensaje: '' })
    } catch (err: unknown) {
      setStatus('error')
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Error desconocido')
      }
    }
  }

  return (
    <section id="contacto" className="contact-section">
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row g-4 g-lg-5 align-items-center">
          {/* Left Column: Brand & Value Props */}
          <div className="col-lg-4">
            <ScrollReveal>
              <div className="contact-left pe-lg-3">
                {/* Brand Logo */}
                <div className="mb-4">
                  <SaikoraLogo size={36} textColor="#FFFFFF" />
                </div>

                {/* Heading */}
                <h2 className="contact-title">
                  ¿Listo para llevar tu
                  <br />
                  proyecto al <span className="grad-text">siguiente nivel?</span>
                </h2>

                <p style={{ color: 'rgba(255, 255, 255, 0.68)', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '2.2rem' }}>
                  Cuéntanos sobre tu idea y te ayudaremos a encontrar la mejor solución tecnológica a la medida de tu presupuesto.
                </p>

                {/* Feature 1 */}
                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="contact-feature-icon">
                    <i className="fa-regular fa-calendar-check"></i>
                  </div>
                  <div>
                    <div className="contact-feature-title">Agenda una reunión</div>
                    <div className="contact-feature-desc">Conoce más sobre nuestras soluciones y metodologías.</div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="d-flex align-items-start gap-3">
                  <div className="contact-feature-icon">
                    <i className="fa-solid fa-file-invoice-dollar"></i>
                  </div>
                  <div>
                    <div className="contact-feature-title">Solicita una cotización</div>
                    <div className="contact-feature-desc">Recibe una propuesta detallada en menos de 24 horas.</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Center Column: Interactive Form */}
          <div className="col-lg-5">
            <ScrollReveal delay={150}>
              <div
                className="rounded-4 p-4 p-md-5 shadow-2xl"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                }}
              >
                <form onSubmit={handleSubmit} id="contact-form">
                  {/* Nombre */}
                  <div className="mb-3">
                    <label
                      className="form-label"
                      htmlFor="nombre"
                      style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1A1E29' }}
                    >
                      Nombre completo <span style={{ color: 'var(--sk-teal)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="form-control"
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.9rem',
                        color: '#1A1E29',
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label
                      className="form-label"
                      htmlFor="email"
                      style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1A1E29' }}
                    >
                      Correo electrónico <span style={{ color: 'var(--sk-teal)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="tu@correo.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.9rem',
                        color: '#1A1E29',
                      }}
                    />
                  </div>

                  {/* Servicio */}
                  <div className="mb-3">
                    <label
                      className="form-label"
                      htmlFor="servicio"
                      style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1A1E29' }}
                    >
                      ¿En qué estás interesado? <span style={{ color: 'var(--sk-teal)' }}>*</span>
                    </label>
                    <select
                      id="servicio"
                      name="servicio"
                      className="form-select"
                      value={formData.servicio}
                      onChange={handleChange}
                      required
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.9rem',
                        color: '#1A1E29',
                      }}
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="desarrollo-web">Desarrollo Web</option>
                      <option value="automatizacion">Automatización de Procesos</option>
                      <option value="sistema-medida">Sistema a Medida</option>
                      <option value="ecommerce">Tienda Online / E-commerce</option>
                      <option value="consultoria">Consultoría Tecnológica</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  {/* Mensaje */}
                  <div className="mb-4">
                    <label
                      className="form-label"
                      htmlFor="mensaje"
                      style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1A1E29' }}
                    >
                      Cuéntanos sobre tu proyecto <span style={{ color: 'var(--sk-teal)' }}>*</span>
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      className="form-control"
                      placeholder="Escribe un mensaje..."
                      rows={3}
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.9rem',
                        color: '#1A1E29',
                        resize: 'none',
                      }}
                    />
                  </div>

                  {/* Status Alerts */}
                  {status === 'success' && (
                    <div
                      className="p-3 mb-3 rounded-3 d-flex align-items-center gap-2"
                      style={{
                        background: 'rgba(25, 195, 160, 0.12)',
                        border: '1px solid rgba(25, 195, 160, 0.3)',
                        color: '#0fa882',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                      }}
                    >
                      <i className="fa-solid fa-circle-check"></i>
                      <span>¡Mensaje enviado con éxito! Te contactaremos muy pronto.</span>
                    </div>
                  )}

                  {status === 'error' && (
                    <div
                      className="p-3 mb-3 rounded-3 d-flex align-items-center gap-2"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#dc2626',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                      }}
                    >
                      <i className="fa-solid fa-circle-exclamation"></i>
                      <span>{errorMsg || 'Ocurrió un error. Intenta nuevamente.'}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={status === 'loading'}
                    id="contact-submit-btn"
                  >
                    {status === 'loading' ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Enviando solicitud...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar solicitud</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Meeting & Direct Info Cards */}
          <div className="col-lg-3">
            <ScrollReveal delay={300}>
              <div className="d-flex flex-column gap-4">
                {/* Meeting Card */}
                <div
                  className="rounded-4 p-4"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <div
                    className="rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: 44,
                      height: 44,
                      background: 'rgba(25, 195, 160, 0.12)',
                      color: 'var(--sk-teal)',
                      fontSize: '1.15rem',
                    }}
                  >
                    <i className="fa-regular fa-calendar-days"></i>
                  </div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#1A1E29', marginBottom: '0.4rem' }}>
                    ¿Prefieres agendar una reunión?
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                    Agenda una llamada directa con nuestro equipo y resolvemos tus dudas sin compromiso.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMeetingModal(true)
                      setMeetingSuccess(false)
                      setMeetingError(null)
                    }}
                    className="btn-schedule w-100 border-0"
                    id="schedule-meeting-btn"
                    style={{ cursor: 'pointer' }}
                  >
                    <span>Agendar reunión</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>

                {/* Direct Contact Card */}
                <div
                  className="rounded-4 p-4"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#94a3b8',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '1rem',
                    }}
                  >
                    También puedes contactarnos
                  </div>

                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 34,
                        height: 34,
                        background: 'rgba(25, 195, 160, 0.1)',
                        color: 'var(--sk-teal)',
                        fontSize: '0.85rem',
                        flexShrink: 0,
                      }}
                    >
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <a
                      href="mailto:saikorasupport@gmail.com"
                      style={{ color: '#1A1E29', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      saikorasupport@gmail.com
                    </a>
                  </div>

                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 34,
                        height: 34,
                        background: 'rgba(25, 195, 160, 0.1)',
                        color: 'var(--sk-teal)',
                        fontSize: '0.85rem',
                        flexShrink: 0,
                      }}
                    >
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <a
                      href="tel:+50688888888"
                      style={{ color: '#1A1E29', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      +506 8888 8888
                    </a>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 34,
                        height: 34,
                        background: 'rgba(25, 195, 160, 0.1)',
                        color: 'var(--sk-teal)',
                        fontSize: '0.85rem',
                        flexShrink: 0,
                      }}
                    >
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <span style={{ color: '#1A1E29', fontSize: '0.85rem', fontWeight: 600 }}>
                      San José, Costa Rica
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* MODAL: MINI FORMS PARA AGENDAR REUNIÓN */}
      {showMeetingModal && (
        <div
          className="position-fixed inset-0 d-flex align-items-center justify-content-center p-3"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 99999,
            animation: 'fadeIn 0.25s ease',
          }}
          onClick={() => setShowMeetingModal(false)}
        >
          <div
            className="p-4 p-md-5 position-relative shadow-2xl"
            style={{
              background: '#FFFFFF',
              borderRadius: '26px',
              maxWidth: '540px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              border: '1.5px solid rgba(226, 232, 240, 0.9)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
              animation: 'modalSlideUp 0.3s cubic-bezier(.22,1,.36,1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setShowMeetingModal(false)}
              className="position-absolute rounded-circle border-0 d-flex align-items-center justify-content-center shadow-xs"
              style={{
                top: '18px',
                right: '18px',
                width: '36px',
                height: '36px',
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

            {!meetingSuccess ? (
              <div>
                {/* Header */}
                <div className="mb-4 pe-4">
                  <span
                    className="badge rounded-pill mb-2 px-3 py-1"
                    style={{
                      background: 'rgba(25, 195, 160, 0.12)',
                      color: 'var(--sk-teal-mid)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  >
                    <i className="fa-regular fa-calendar-check me-1" /> AGENDAR REUNIÓN
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1A1E29', marginBottom: '0.35rem' }}>
                    ¿Prefieres agendar una reunión?
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    Agenda una llamada directa con nuestro equipo. Selecciona la fecha, hora y plataforma de tu preferencia.
                  </p>
                </div>

                {meetingError && (
                  <div
                    className="alert alert-danger py-2 px-3 mb-3 rounded-3"
                    style={{ fontSize: '0.82rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}
                  >
                    <i className="fa-solid fa-triangle-exclamation me-2" />
                    {meetingError}
                  </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleMeetingSubmit}>
                  {/* Nombre */}
                  <div className="mb-3">
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1E29', marginBottom: '0.3rem', display: 'block' }}>
                      Nombre completo o Empresa <span style={{ color: 'var(--sk-teal)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      placeholder="Ej: Carlos Rojas / Mi Negocio"
                      value={meetingForm.nombre}
                      onChange={handleMeetingChange}
                      style={{
                        width: '100%',
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.65rem 0.9rem',
                        fontSize: '0.88rem',
                        color: '#1A1E29',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Correo y Teléfono en dos columnas */}
                  <div className="row g-2 mb-3">
                    <div className="col-12 col-md-6">
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1E29', marginBottom: '0.3rem', display: 'block' }}>
                        Correo electrónico <span style={{ color: 'var(--sk-teal)' }}>*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="tu@empresa.com"
                        value={meetingForm.email}
                        onChange={handleMeetingChange}
                        style={{
                          width: '100%',
                          background: '#f8fafc',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.65rem 0.9rem',
                          fontSize: '0.88rem',
                          color: '#1A1E29',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1E29', marginBottom: '0.3rem', display: 'block' }}>
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        placeholder="+506 8888 8888"
                        value={meetingForm.telefono}
                        onChange={handleMeetingChange}
                        style={{
                          width: '100%',
                          background: '#f8fafc',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.65rem 0.9rem',
                          fontSize: '0.88rem',
                          color: '#1A1E29',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Fecha y Hora en dos columnas */}
                  <div className="row g-2 mb-3">
                    <div className="col-12 col-md-6">
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1E29', marginBottom: '0.3rem', display: 'block' }}>
                        Fecha de la reunión <span style={{ color: 'var(--sk-teal)' }}>*</span>
                      </label>
                      <input
                        type="date"
                        name="fecha"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={meetingForm.fecha}
                        onChange={handleMeetingChange}
                        style={{
                          width: '100%',
                          background: '#f8fafc',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.65rem 0.9rem',
                          fontSize: '0.88rem',
                          color: '#1A1E29',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1E29', marginBottom: '0.3rem', display: 'block' }}>
                        Hora preferida <span style={{ color: 'var(--sk-teal)' }}>*</span>
                      </label>
                      <select
                        name="hora"
                        required
                        value={meetingForm.hora}
                        onChange={handleMeetingChange}
                        style={{
                          width: '100%',
                          background: '#f8fafc',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.65rem 0.9rem',
                          fontSize: '0.88rem',
                          color: '#1A1E29',
                          outline: 'none',
                        }}
                      >
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Medio / Plataforma para la reunión */}
                  <div className="mb-3">
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1E29', marginBottom: '0.45rem', display: 'block' }}>
                      Plataforma de reunión <span style={{ color: 'var(--sk-teal)' }}>*</span>
                    </label>
                    <div className="d-flex flex-wrap gap-2">
                      {[
                        { id: 'Google Meet', label: 'Google Meet', icon: 'fa-solid fa-video', color: '#15803d' },
                        { id: 'Microsoft Teams', label: 'Teams', icon: 'fa-brands fa-microsoft', color: '#464eb8' },
                        { id: 'Zoom', label: 'Zoom', icon: 'fa-solid fa-headset', color: '#0284c7' },
                        { id: 'WhatsApp', label: 'WhatsApp', icon: 'fa-brands fa-whatsapp', color: '#16a34a' },
                      ].map((plat) => {
                        const isSelected = meetingForm.medio === plat.id
                        return (
                          <button
                            key={plat.id}
                            type="button"
                            onClick={() => setMeetingForm((prev) => ({ ...prev, medio: plat.id }))}
                            className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                            style={{
                              border: isSelected ? `2px solid ${plat.color}` : '1.5px solid #e2e8f0',
                              background: isSelected ? `${plat.color}15` : '#f8fafc',
                              color: isSelected ? plat.color : '#475569',
                              fontSize: '0.8rem',
                              fontWeight: isSelected ? 800 : 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <i className={plat.icon} style={{ fontSize: '0.9rem' }} />
                            <span>{plat.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Notas opcionales */}
                  <div className="mb-4">
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1E29', marginBottom: '0.3rem', display: 'block' }}>
                      Tema o notas adicionales (opcional)
                    </label>
                    <textarea
                      name="notas"
                      rows={2}
                      placeholder="Ej: Quiero una cotización para un sistema a medida..."
                      value={meetingForm.notas}
                      onChange={handleMeetingChange}
                      style={{
                        width: '100%',
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.65rem 0.9rem',
                        fontSize: '0.85rem',
                        color: '#1A1E29',
                        outline: 'none',
                        resize: 'none',
                      }}
                    />
                  </div>

                  {/* Botones de acción */}
                  <div className="d-flex align-items-center justify-content-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMeetingModal(false)}
                      className="btn rounded-pill px-3 py-2"
                      style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, border: 'none' }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={meetingSubmitting}
                      className="btn rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
                      style={{
                        background: 'var(--grad-primary)',
                        color: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        border: 'none',
                        boxShadow: '0 4px 14px rgba(25, 195, 160, 0.35)',
                      }}
                    >
                      {meetingSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirmar y Agendar</span>
                          <i className="fa-solid fa-arrow-right" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* PANTALLA DE ÉXITO */
              <div className="text-center py-3">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{
                    width: '64px',
                    height: '64px',
                    background: 'rgba(25, 195, 160, 0.15)',
                    color: 'var(--sk-teal)',
                    fontSize: '1.8rem',
                  }}
                >
                  <i className="fa-solid fa-circle-check" />
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1A1E29', marginBottom: '0.5rem' }}>
                  ¡Reunión Agendada con éxito!
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                  Hemos registrado tu sesión. Te enviaremos el enlace de conexión a tu correo electrónico.
                </p>

                {/* Resumen */}
                <div
                  className="p-3 rounded-4 mb-3 text-start"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                >
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span style={{ color: '#64748b' }}>📅 Fecha:</span>
                    <strong style={{ color: '#1A1E29' }}>{meetingForm.fecha}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span style={{ color: '#64748b' }}>⏰ Hora:</span>
                    <strong style={{ color: '#1A1E29' }}>{meetingForm.hora}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span style={{ color: '#64748b' }}>💻 Plataforma:</span>
                    <strong style={{ color: 'var(--sk-teal-mid)' }}>{meetingForm.medio}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span style={{ color: '#64748b' }}>👤 Contacto:</span>
                    <strong style={{ color: '#1A1E29' }}>{meetingForm.nombre}</strong>
                  </div>
                </div>

                {/* Aviso del archivo Excel */}
                <div
                  className="p-2 px-3 rounded-3 mb-4 d-inline-flex align-items-center gap-2"
                  style={{ background: 'rgba(25, 195, 160, 0.08)', border: '1px solid rgba(25, 195, 160, 0.25)', fontSize: '0.78rem', color: '#0f766e' }}
                >
                  <i className="fa-solid fa-file-excel" style={{ fontSize: '1rem', color: '#107c41' }} />
                  <span>Guardado en <strong>reuniones_agendadas.xlsx</strong> en este proyecto.</span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMeetingModal(false)
                      setMeetingForm({
                        nombre: '',
                        email: '',
                        telefono: '',
                        fecha: '',
                        hora: '10:00 AM',
                        medio: 'Google Meet',
                        notas: '',
                      })
                    }}
                    className="btn rounded-pill px-4 py-2"
                    style={{ background: 'var(--grad-primary)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem', border: 'none' }}
                  >
                    Entendido / Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
