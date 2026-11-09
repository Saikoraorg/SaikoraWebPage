'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

interface Contacto {
  id: string
  nombre: string
  email: string
  telefono?: string
  servicio: string
  mensaje: string
  estado: string
  prioridad: string
  presupuesto_estimado?: string
  origen?: string
  utm_source?: string
  created_at: string
}

interface Reunion {
  id: string
  nombre: string
  email: string
  telefono?: string
  fecha_reunion: string
  hora_reunion: string
  medio: string
  tema?: string
  estado: string
  link_reunion?: string
  created_at: string
}

interface Metrics {
  totalLeads: number
  leadsNuevos: number
  leadsGanados: number
  conversionRatePct: number
  totalReuniones: number
  reunionesCompletadas: number
  reunionesAgendadas: number
  demandByService: Record<string, number>
  meetingsByPlatform: Record<string, number>
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function AdminDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [pinInput, setPinInput] = useState<string>('')
  const [authError, setAuthError] = useState<string>('')

  // Dashboard data states
  const [activeTab, setActiveTab] = useState<'analytics' | 'calendar' | 'leads' | 'meetings'>('analytics')
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [reuniones, setReuniones] = useState<Reunion[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [isLiveFromSupabase, setIsLiveFromSupabase] = useState<boolean>(false)

  // Calendar states
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date())
  const [selectedMeeting, setSelectedMeeting] = useState<Reunion | null>(null)
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null)

  // CRM Search & Filter states
  const [leadSearch, setLeadSearch] = useState<string>('')
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('todos')

  // Check stored session token on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('saikora_admin_token')
    if (storedToken) {
      setIsAuthenticated(true)
    }
  }, [])

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const validPin = process.env.NEXT_PUBLIC_ADMIN_PIN || 'saikora2026'
    if (pinInput.trim() === validPin) {
      sessionStorage.setItem('saikora_admin_token', pinInput.trim())
      setIsAuthenticated(true)
      setAuthError('')
    } else {
      setAuthError('PIN o clave administrativa incorrecta.')
    }
  }

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem('saikora_admin_token')
    setIsAuthenticated(false)
    setPinInput('')
  }

  // Fetch admin data
  const fetchData = useCallback(async (isRefresh = false) => {
    const token = sessionStorage.getItem('saikora_admin_token') || 'saikora2026'
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const res = await fetch(`/api/admin/data?token=${encodeURIComponent(token)}`, {
        headers: { 'x-admin-token': token },
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setContactos(data.contactos || [])
        setReuniones(data.reuniones || [])
        setMetrics(data.metrics || null)
        setIsLiveFromSupabase(Boolean(data.isLiveFromSupabase))
      }
    } catch (err) {
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Initial load and periodic polling fallback
  useEffect(() => {
    if (!isAuthenticated) return

    fetchData()

    // Setup Supabase Realtime channel if available
    const channel = supabase
      .channel('saikora-admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contactos' }, () => {
        fetchData(true)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reuniones' }, () => {
        fetchData(true)
      })
      .subscribe()

    // 15 seconds polling interval as fallback
    const interval = setInterval(() => {
      fetchData(true)
    }, 15000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [isAuthenticated, fetchData])

  // Update status handler for contacts or meetings
  const updateStatus = async (type: 'contacto' | 'reunion', id: string, updates: Record<string, any>) => {
    const token = sessionStorage.getItem('saikora_admin_token') || 'saikora2026'

    // Optimistic UI update
    if (type === 'contacto') {
      setContactos((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
    } else {
      setReuniones((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
      if (selectedMeeting && selectedMeeting.id === id) {
        setSelectedMeeting((prev) => (prev ? { ...prev, ...updates } : null))
      }
    }

    try {
      await fetch('/api/admin/data', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify({ type, id, updates }),
      })
      fetchData(true)
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  // Calendar month days calculation
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear()
    const month = currentMonthDate.getMonth()

    const firstDayIndex = new Date(year, month, 1).getDay()
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate()
    const totalDaysPrevMonth = new Date(year, month, 0).getDate()

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; meetings: Reunion[] }[] = []

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = totalDaysPrevMonth - i
      const m = month === 0 ? 12 : month
      const y = month === 0 ? year - 1 : year
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        meetings: reuniones.filter((r) => r.fecha_reunion === dateStr),
      })
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        meetings: reuniones.filter((r) => r.fecha_reunion === dateStr),
      })
    }

    // Next month padding to reach multiple of 7
    const remaining = (7 - (days.length % 7)) % 7
    for (let i = 1; i <= remaining; i++) {
      const m = month + 2 > 12 ? 1 : month + 2
      const y = month + 2 > 12 ? year + 1 : year
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      days.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: false,
        meetings: reuniones.filter((r) => r.fecha_reunion === dateStr),
      })
    }

    return days
  }, [currentMonthDate, reuniones])

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))
  }
  const nextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))
  }
  const goToToday = () => {
    setCurrentMonthDate(new Date())
    const todayStr = new Date().toISOString().split('T')[0]
    setSelectedDateFilter(todayStr)
  }

  // Filtered contacts list
  const filteredContactos = useMemo(() => {
    return contactos.filter((c) => {
      const matchesSearch =
        c.nombre.toLowerCase().includes(leadSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
        c.mensaje.toLowerCase().includes(leadSearch.toLowerCase())
      const matchesStatus = leadStatusFilter === 'todos' || c.estado === leadStatusFilter
      return matchesSearch && matchesStatus
    })
  }, [contactos, leadSearch, leadStatusFilter])

  // Today string for highlighting
  const todayStr = new Date().toISOString().split('T')[0]

  // ============================================================
  // LOGIN SCREEN (ACCESS CONTROL)
  // ============================================================
  if (!isAuthenticated) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center p-3"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          className="p-4 p-md-5 rounded-4 shadow-2xl position-relative text-center"
          style={{
            maxWidth: '420px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1.5px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Badge */}
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: 'rgba(25,195,160,0.12)', color: '#0fa882', fontSize: '0.75rem', fontWeight: 700 }}>
            <i className="fa-solid fa-lock" /> ACCESO EXCLUSIVO ADMIN
          </div>

          <h2 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
            Saikora Console
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
            Ingresa tu clave de acceso o PIN administrativo para gestionar las analíticas, el calendario y los clientes.
          </p>

          {authError && (
            <div className="alert alert-danger py-2 px-3 mb-3 rounded-3 text-start" style={{ fontSize: '0.82rem' }}>
              <i className="fa-solid fa-triangle-exclamation me-2" />
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3 text-start">
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                PIN o Contraseña Administrativa
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Ingresa tu clave..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                style={{
                  width: '100%',
                  background: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                Clave por defecto: <code style={{ color: '#4c5bff' }}>saikora2026</code>
              </div>
            </div>

            <button
              type="submit"
              className="w-100 btn rounded-pill py-2 mt-2"
              style={{
                background: 'linear-gradient(135deg, #19C3A0 0%, #4C5BFF 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.92rem',
                border: 'none',
                boxShadow: '0 4px 15px rgba(25,195,160,0.35)',
              }}
            >
              <span>Ingresar al Dashboard</span>
              <i className="fa-solid fa-arrow-right ms-2" />
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ============================================================
  // MAIN ADMIN DASHBOARD INTERFACE
  // ============================================================
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B0F19',
        color: '#F8FAFC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* TOPBAR */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div className="container-fluid px-3 px-md-4 py-3 d-flex align-items-center justify-content-between flex-wrap gap-3">
          {/* Left: Brand & Status */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: '#FFFFFF',
                }}
              >
                SAIKORA<span style={{ color: '#19C3A0' }}>.</span>
              </span>
              <span
                className="badge rounded-pill"
                style={{
                  background: 'rgba(25, 195, 160, 0.15)',
                  color: '#19C3A0',
                  border: '1px solid rgba(25, 195, 160, 0.3)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                }}
              >
                ADMIN CONSOLE
              </span>
            </div>

            {/* Live Indicator */}
            <div className="d-none d-sm-flex align-items-center gap-2 px-2 py-1 rounded-pill" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.72rem', color: '#94a3b8' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isLiveFromSupabase ? '#10b981' : '#f59e0b',
                  boxShadow: isLiveFromSupabase ? '0 0 10px #10b981' : '0 0 10px #f59e0b',
                  display: 'inline-block',
                }}
              />
              <span>{isLiveFromSupabase ? 'Supabase Live' : 'Demo Local'}</span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="d-flex align-items-center gap-1 p-1 rounded-pill" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {[
              { id: 'analytics', label: 'Analíticas', icon: 'fa-solid fa-chart-line' },
              { id: 'calendar', label: 'Calendario', icon: 'fa-regular fa-calendar-days' },
              { id: 'leads', label: 'Leads CRM', icon: 'fa-solid fa-users' },
              { id: 'meetings', label: 'Reuniones', icon: 'fa-solid fa-video' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="btn btn-sm rounded-pill d-inline-flex align-items-center gap-2 px-3 py-1"
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #19C3A0 0%, #4C5BFF 100%)' : 'transparent',
                  color: activeTab === tab.id ? '#FFFFFF' : '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <i className={tab.icon} style={{ fontSize: '0.8rem' }} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => fetchData(true)}
              className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '34px',
                height: '34px',
                background: 'rgba(255,255,255,0.08)',
                color: '#cbd5e1',
                border: 'none',
              }}
              title="Refrescar datos"
            >
              <i className={`fa-solid fa-rotate-right ${refreshing ? 'fa-spin' : ''}`} style={{ fontSize: '0.85rem' }} />
            </button>
            <a
              href="/"
              target="_blank"
              className="btn btn-sm rounded-pill px-3 py-1 d-none d-md-inline-flex align-items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: '0.76rem', fontWeight: 600, border: 'none', textDecoration: 'none' }}
            >
              <span>Ver Sitio Web</span>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.7rem' }} />
            </a>
            <button
              onClick={handleLogout}
              className="btn btn-sm rounded-pill px-3 py-1"
              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.76rem', fontWeight: 700 }}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT BODY */}
      <main className="container-fluid px-3 px-md-4 py-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info mb-3" role="status" />
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Cargando datos en tiempo real...</div>
          </div>
        ) : (
          <>
            {/* ============================================================
                TAB 1: ANALÍTICAS & KPIS
               ============================================================ */}
            {activeTab === 'analytics' && (
              <div>
                {/* Metrics Cards Grid */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-sm-6 col-xl-3">
                    <div
                      className="p-3 rounded-4"
                      style={{
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL PROSPECTOS</span>
                        <div className="rounded-3 p-2" style={{ background: 'rgba(25, 195, 160, 0.12)', color: '#19C3A0' }}>
                          <i className="fa-solid fa-users" />
                        </div>
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                        {metrics?.totalLeads || 0}
                      </div>
                      <div className="mt-2" style={{ fontSize: '0.76rem', color: '#10b981' }}>
                        <i className="fa-solid fa-circle-exclamation me-1" />
                        <strong>{metrics?.leadsNuevos || 0}</strong> pendientes de contacto
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-xl-3">
                    <div
                      className="p-3 rounded-4"
                      style={{
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>REUNIONES AGENDADAS</span>
                        <div className="rounded-3 p-2" style={{ background: 'rgba(76, 91, 255, 0.15)', color: '#818cf8' }}>
                          <i className="fa-solid fa-calendar-check" />
                        </div>
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                        {metrics?.totalReuniones || 0}
                      </div>
                      <div className="mt-2" style={{ fontSize: '0.76rem', color: '#818cf8' }}>
                        <strong>{metrics?.reunionesAgendadas || 0}</strong> programadas próximas
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-xl-3">
                    <div
                      className="p-3 rounded-4"
                      style={{
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>TASA DE CIERRE</span>
                        <div className="rounded-3 p-2" style={{ background: 'rgba(234, 179, 8, 0.12)', color: '#facc15' }}>
                          <i className="fa-solid fa-award" />
                        </div>
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                        {metrics?.conversionRatePct || 0}%
                      </div>
                      <div className="mt-2" style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                        <strong>{metrics?.leadsGanados || 0}</strong> contratos ganados
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-xl-3">
                    <div
                      className="p-3 rounded-4"
                      style={{
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>REUNIONES COMPLETADAS</span>
                        <div className="rounded-3 p-2" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                          <i className="fa-solid fa-handshake" />
                        </div>
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                        {metrics?.reunionesCompletadas || 0}
                      </div>
                      <div className="mt-2" style={{ fontSize: '0.76rem', color: '#34d399' }}>
                        Llamadas de valor realizadas
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts & Breakdown Row */}
                <div className="row g-4 mb-4">
                  {/* Service Demand Breakdown */}
                  <div className="col-12 col-lg-7">
                    <div
                      className="p-4 rounded-4 h-100"
                      style={{
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem' }}>
                        📊 Demanda por Solución Tecnológica
                      </h4>

                      {Object.keys(metrics?.demandByService || {}).length === 0 ? (
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Sin solicitudes registradas aún.</div>
                      ) : (
                        <div className="d-flex flex-column gap-3">
                          {Object.entries(metrics?.demandByService || {}).map(([srv, count]) => {
                            const total = metrics?.totalLeads || 1
                            const pct = Math.round((count / total) * 100)
                            return (
                              <div key={srv}>
                                <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.82rem' }}>
                                  <span style={{ fontWeight: 600, color: '#e2e8f0', textTransform: 'capitalize' }}>
                                    {srv.replace(/-/g, ' ')}
                                  </span>
                                  <span style={{ color: '#94a3b8' }}>
                                    <strong>{count}</strong> ({pct}%)
                                  </span>
                                </div>
                                <div className="progress" style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: `${pct}%`,
                                      background: 'linear-gradient(90deg, #19C3A0 0%, #4C5BFF 100%)',
                                      borderRadius: '10px',
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Platforms Breakdown */}
                  <div className="col-12 col-lg-5">
                    <div
                      className="p-4 rounded-4 h-100"
                      style={{
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem' }}>
                        🌐 Canales de Reunión Preferidos
                      </h4>

                      <div className="d-flex flex-column gap-2">
                        {Object.entries(metrics?.meetingsByPlatform || {}).map(([plat, count]) => (
                          <div
                            key={plat}
                            className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#e2e8f0' }}>{plat}</span>
                            <span className="badge rounded-pill px-3 py-1" style={{ background: 'rgba(25,195,160,0.15)', color: '#19C3A0', fontSize: '0.8rem' }}>
                              {count} citas
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Leads Quick Table */}
                <div
                  className="p-4 rounded-4"
                  style={{
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      ⚡ Últimos Prospectos Ingresados
                    </h4>
                    <button
                      onClick={() => setActiveTab('leads')}
                      className="btn btn-sm rounded-pill px-3 py-1"
                      style={{ background: 'rgba(255,255,255,0.06)', color: '#19C3A0', fontSize: '0.78rem', fontWeight: 700, border: 'none' }}
                    >
                      Ver todos ({contactos.length}) →
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0" style={{ background: 'transparent', fontSize: '0.84rem' }}>
                      <thead>
                        <tr style={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <th style={{ background: 'transparent' }}>Cliente</th>
                          <th style={{ background: 'transparent' }}>Servicio</th>
                          <th style={{ background: 'transparent' }}>Mensaje</th>
                          <th style={{ background: 'transparent' }}>Estado</th>
                          <th style={{ background: 'transparent' }}>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contactos.slice(0, 5).map((c) => (
                          <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ background: 'transparent' }}>
                              <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{c.nombre}</div>
                              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{c.email}</div>
                            </td>
                            <td style={{ background: 'transparent' }}>
                              <span className="badge rounded-pill" style={{ background: 'rgba(76,91,255,0.2)', color: '#818cf8', fontSize: '0.72rem' }}>
                                {c.servicio}
                              </span>
                            </td>
                            <td style={{ background: 'transparent', maxWidth: '280px' }}>
                              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#cbd5e1' }}>
                                {c.mensaje}
                              </div>
                            </td>
                            <td style={{ background: 'transparent' }}>
                              <select
                                value={c.estado}
                                onChange={(e) => updateStatus('contacto', c.id, { estado: e.target.value })}
                                style={{
                                  background: '#1e293b',
                                  color: c.estado === 'nuevo' ? '#10b981' : c.estado === 'ganado' ? '#38bdf8' : '#e2e8f0',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  borderRadius: '8px',
                                  padding: '0.2rem 0.5rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              >
                                <option value="nuevo">Nuevo</option>
                                <option value="contactado">Contactado</option>
                                <option value="en_cotizacion">En Cotización</option>
                                <option value="ganado">Ganado</option>
                                <option value="perdido">Perdido</option>
                              </select>
                            </td>
                            <td style={{ background: 'transparent', color: '#94a3b8', fontSize: '0.75rem' }}>
                              {new Date(c.created_at).toLocaleDateString('es-CR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 2: CALENDARIO DE REUNIONES INTERACTIVO
               ============================================================ */}
            {activeTab === 'calendar' && (
              <div className="row g-4">
                {/* Left: Interactive Calendar Grid */}
                <div className="col-12 col-xl-8">
                  <div
                    className="p-4 rounded-4"
                    style={{
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {/* Month Navigator Header */}
                    <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-3">
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                          {MONTH_NAMES[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
                        </h3>
                        <span className="badge rounded-pill px-3 py-1" style={{ background: 'rgba(25,195,160,0.15)', color: '#19C3A0', fontSize: '0.75rem' }}>
                          {reuniones.length} reuniones programadas
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          onClick={goToToday}
                          className="btn btn-sm rounded-pill px-3 py-1"
                          style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 700, border: 'none' }}
                        >
                          Hoy
                        </button>
                        <button
                          onClick={prevMonth}
                          className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: 'none' }}
                        >
                          <i className="fa-solid fa-chevron-left" />
                        </button>
                        <button
                          onClick={nextMonth}
                          className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: 'none' }}
                        >
                          <i className="fa-solid fa-chevron-right" />
                        </button>
                      </div>
                    </div>

                    {/* Weekday Names Header */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '6px',
                        marginBottom: '8px',
                        textAlign: 'center',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: '#94a3b8',
                      }}
                    >
                      {DAY_NAMES.map((name) => (
                        <div key={name} className="py-1">
                          {name}
                        </div>
                      ))}
                    </div>

                    {/* Month Days Matrix */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '6px',
                      }}
                    >
                      {calendarDays.map((d, idx) => {
                        const isToday = d.dateStr === todayStr
                        const isSelected = selectedDateFilter === d.dateStr
                        const hasMeetings = d.meetings.length > 0

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedDateFilter(d.dateStr)
                              if (d.meetings.length > 0) {
                                setSelectedMeeting(d.meetings[0])
                              }
                            }}
                            className="p-2 rounded-3 text-start position-relative"
                            style={{
                              minHeight: '84px',
                              background: isSelected
                                ? 'rgba(76, 91, 255, 0.25)'
                                : isToday
                                ? 'rgba(25, 195, 160, 0.12)'
                                : 'rgba(255, 255, 255, 0.03)',
                              border: isSelected
                                ? '1.5px solid #4C5BFF'
                                : isToday
                                ? '1.5px solid #19C3A0'
                                : '1px solid rgba(255, 255, 255, 0.06)',
                              opacity: d.isCurrentMonth ? 1 : 0.4,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: isToday || isSelected ? 800 : 500,
                                  color: isToday ? '#19C3A0' : '#e2e8f0',
                                }}
                              >
                                {d.dayNum}
                              </span>
                              {hasMeetings && (
                                <span
                                  style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: '#19C3A0',
                                    boxShadow: '0 0 6px #19C3A0',
                                  }}
                                />
                              )}
                            </div>

                            {/* Meeting Pills inside calendar cell */}
                            <div className="d-flex flex-column gap-1">
                              {d.meetings.slice(0, 2).map((m) => (
                                <div
                                  key={m.id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedMeeting(m)
                                    setSelectedDateFilter(d.dateStr)
                                  }}
                                  className="p-1 rounded text-truncate"
                                  style={{
                                    fontSize: '0.66rem',
                                    fontWeight: 700,
                                    background:
                                      m.estado === 'completada'
                                        ? 'rgba(16, 185, 129, 0.25)'
                                        : 'rgba(76, 91, 255, 0.35)',
                                    color: '#FFFFFF',
                                    lineHeight: 1.2,
                                  }}
                                  title={`${m.hora_reunion} - ${m.nombre}`}
                                >
                                  {m.hora_reunion} {m.nombre.split(' ')[0]}
                                </div>
                              ))}
                              {d.meetings.length > 2 && (
                                <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>
                                  +{d.meetings.length - 2} más
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Selected Day & Meeting Details Drawer */}
                <div className="col-12 col-xl-4">
                  <div
                    className="p-4 rounded-4"
                    style={{
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                        📋 Ficha de Reunión
                      </h4>
                      {selectedDateFilter && (
                        <button
                          onClick={() => {
                            setSelectedDateFilter(null)
                            setSelectedMeeting(null)
                          }}
                          className="btn btn-sm btn-link text-decoration-none p-0 text-muted"
                          style={{ fontSize: '0.75rem' }}
                        >
                          Limpiar filtro
                        </button>
                      )}
                    </div>

                    {selectedMeeting ? (
                      <div>
                        {/* Status Badge & Actions */}
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span
                            className="badge rounded-pill px-3 py-1"
                            style={{
                              background:
                                selectedMeeting.estado === 'confirmada'
                                  ? 'rgba(16, 185, 129, 0.2)'
                                  : selectedMeeting.estado === 'completada'
                                  ? 'rgba(56, 189, 248, 0.2)'
                                  : 'rgba(234, 179, 8, 0.2)',
                              color:
                                selectedMeeting.estado === 'confirmada'
                                  ? '#34d399'
                                  : selectedMeeting.estado === 'completada'
                                  ? '#38bdf8'
                                  : '#facc15',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                            }}
                          >
                            {selectedMeeting.estado}
                          </span>

                          {/* Quick Change State */}
                          <select
                            value={selectedMeeting.estado}
                            onChange={(e) => updateStatus('reunion', selectedMeeting.id, { estado: e.target.value })}
                            style={{
                              background: '#1e293b',
                              color: '#cbd5e1',
                              border: '1px solid rgba(255,255,255,0.15)',
                              borderRadius: '8px',
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                            }}
                          >
                            <option value="agendada">Agendada</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="completada">Completada</option>
                            <option value="no_show">No Asistió (No-show)</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                        </div>

                        {/* Client details */}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                          {selectedMeeting.nombre}
                        </h3>

                        <div className="d-flex flex-column gap-2 my-3" style={{ fontSize: '0.84rem' }}>
                          <div className="d-flex align-items-center gap-2 text-secondary">
                            <i className="fa-regular fa-clock" style={{ width: '16px', color: '#19C3A0' }} />
                            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
                              {selectedMeeting.fecha_reunion} a las {selectedMeeting.hora_reunion}
                            </span>
                          </div>

                          <div className="d-flex align-items-center gap-2 text-secondary">
                            <i className="fa-solid fa-video" style={{ width: '16px', color: '#818cf8' }} />
                            <span style={{ color: '#e2e8f0' }}>Plataforma: <strong>{selectedMeeting.medio}</strong></span>
                          </div>

                          <div className="d-flex align-items-center gap-2 text-secondary">
                            <i className="fa-solid fa-envelope" style={{ width: '16px', color: '#facc15' }} />
                            <a href={`mailto:${selectedMeeting.email}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>
                              {selectedMeeting.email}
                            </a>
                          </div>

                          {selectedMeeting.telefono && (
                            <div className="d-flex align-items-center gap-2 text-secondary">
                              <i className="fa-brands fa-whatsapp" style={{ width: '16px', color: '#22c55e' }} />
                              <a
                                href={`https://wa.me/${selectedMeeting.telefono.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: '#4ade80', textDecoration: 'none' }}
                              >
                                {selectedMeeting.telefono}
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Meeting Notes */}
                        <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.25rem' }}>
                            TEMA O NOTAS DEL CLIENTE:
                          </div>
                          <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                            {selectedMeeting.tema || 'Sin notas adicionales.'}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="d-flex flex-column gap-2">
                          {selectedMeeting.link_reunion ? (
                            <a
                              href={selectedMeeting.link_reunion}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm rounded-pill py-2 d-flex align-items-center justify-content-center gap-2"
                              style={{ background: 'linear-gradient(135deg, #19C3A0 0%, #4C5BFF 100%)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.84rem', textDecoration: 'none' }}
                            >
                              <i className="fa-solid fa-video" />
                              <span>Entrar a la Videollamada</span>
                            </a>
                          ) : (
                            <button
                              onClick={() => {
                                const link = prompt('Ingresa el link de Google Meet o Teams para esta reunión:')
                                if (link) updateStatus('reunion', selectedMeeting.id, { link_reunion: link })
                              }}
                              className="btn btn-sm rounded-pill py-2 d-flex align-items-center justify-content-center gap-2"
                              style={{ background: 'rgba(76,91,255,0.2)', color: '#818cf8', fontWeight: 700, fontSize: '0.84rem', border: '1px solid rgba(76,91,255,0.4)' }}
                            >
                              <i className="fa-solid fa-link" />
                              <span>Agregar Link de Reunión</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-5" style={{ color: '#64748b' }}>
                        <i className="fa-regular fa-calendar-xmark fa-2x mb-2" />
                        <div style={{ fontSize: '0.85rem' }}>Selecciona un día o una reunión en el calendario para ver todos sus detalles.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 3: GESTIÓN DE LEADS (BANDEJA CRM)
               ============================================================ */}
            {activeTab === 'leads' && (
              <div
                className="p-4 rounded-4"
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Search & Filters Bar */}
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      💼 Bandeja de Prospectos & Cotizaciones
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
                      Gestiona el estado de cada solicitud recibida desde el formulario web en tiempo real.
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {/* Search Input */}
                    <input
                      type="text"
                      placeholder="Buscar por nombre, correo..."
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '20px',
                        padding: '0.35rem 0.9rem',
                        fontSize: '0.82rem',
                        color: '#FFFFFF',
                        outline: 'none',
                      }}
                    />

                    {/* Filter status */}
                    <select
                      value={leadStatusFilter}
                      onChange={(e) => setLeadStatusFilter(e.target.value)}
                      style={{
                        background: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '20px',
                        padding: '0.35rem 0.9rem',
                        fontSize: '0.82rem',
                        color: '#cbd5e1',
                      }}
                    >
                      <option value="todos">Todos los Estados</option>
                      <option value="nuevo">Nuevos</option>
                      <option value="contactado">Contactados</option>
                      <option value="en_cotizacion">En Cotización</option>
                      <option value="ganado">Ganados</option>
                      <option value="perdido">Perdidos</option>
                    </select>
                  </div>
                </div>

                {/* Contacts Table */}
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0" style={{ background: 'transparent', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ background: 'transparent' }}>Cliente</th>
                        <th style={{ background: 'transparent' }}>Servicio</th>
                        <th style={{ background: 'transparent' }}>Prioridad</th>
                        <th style={{ background: 'transparent' }}>Mensaje del Proyecto</th>
                        <th style={{ background: 'transparent' }}>Estado CRM</th>
                        <th style={{ background: 'transparent' }}>Fecha</th>
                        <th style={{ background: 'transparent' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContactos.map((c) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ background: 'transparent' }}>
                            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{c.nombre}</div>
                            <div style={{ fontSize: '0.74rem', color: '#38bdf8' }}>{c.email}</div>
                            {c.telefono && <div style={{ fontSize: '0.72rem', color: '#4ade80' }}>{c.telefono}</div>}
                          </td>
                          <td style={{ background: 'transparent' }}>
                            <span className="badge rounded-pill" style={{ background: 'rgba(76,91,255,0.2)', color: '#818cf8', fontSize: '0.72rem' }}>
                              {c.servicio}
                            </span>
                          </td>
                          <td style={{ background: 'transparent' }}>
                            <span
                              className="badge rounded-pill"
                              style={{
                                background:
                                  c.prioridad === 'urgente'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : c.prioridad === 'alta'
                                    ? 'rgba(245, 158, 11, 0.2)'
                                    : 'rgba(100, 116, 139, 0.2)',
                                color:
                                  c.prioridad === 'urgente'
                                    ? '#f87171'
                                    : c.prioridad === 'alta'
                                    ? '#fbbf24'
                                    : '#94a3b8',
                                fontSize: '0.7rem',
                                textTransform: 'uppercase',
                              }}
                            >
                              {c.prioridad}
                            </span>
                          </td>
                          <td style={{ background: 'transparent', maxWidth: '320px' }}>
                            <div style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.4 }}>
                              {c.mensaje}
                            </div>
                          </td>
                          <td style={{ background: 'transparent' }}>
                            <select
                              value={c.estado}
                              onChange={(e) => updateStatus('contacto', c.id, { estado: e.target.value })}
                              style={{
                                background: '#1e293b',
                                color: c.estado === 'nuevo' ? '#10b981' : c.estado === 'ganado' ? '#38bdf8' : '#e2e8f0',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                              }}
                            >
                              <option value="nuevo">Nuevo</option>
                              <option value="contactado">Contactado</option>
                              <option value="en_cotizacion">En Cotización</option>
                              <option value="ganado">Ganado</option>
                              <option value="perdido">Perdido</option>
                            </select>
                          </td>
                          <td style={{ background: 'transparent', color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                            {new Date(c.created_at).toLocaleDateString('es-CR')}
                          </td>
                          <td style={{ background: 'transparent' }}>
                            <a
                              href={`mailto:${c.email}?subject=Cotización%20Saikora%20-%20${encodeURIComponent(c.servicio)}`}
                              className="btn btn-sm rounded-pill px-2 py-1"
                              style={{ background: 'rgba(25,195,160,0.15)', color: '#19C3A0', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}
                            >
                              Responder
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================
                TAB 4: LISTADO GENERAL DE REUNIONES
               ============================================================ */}
            {activeTab === 'meetings' && (
              <div
                className="p-4 rounded-4"
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      📞 Listado Histórico de Reuniones
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
                      Control de llamadas agendadas, asistencias y links de videollamada.
                    </p>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0" style={{ background: 'transparent', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ background: 'transparent' }}>Fecha & Hora</th>
                        <th style={{ background: 'transparent' }}>Cliente</th>
                        <th style={{ background: 'transparent' }}>Plataforma</th>
                        <th style={{ background: 'transparent' }}>Tema / Notas</th>
                        <th style={{ background: 'transparent' }}>Estado</th>
                        <th style={{ background: 'transparent' }}>Enlace</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reuniones.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ background: 'transparent', whiteSpace: 'nowrap' }}>
                            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{r.fecha_reunion}</div>
                            <div style={{ fontSize: '0.74rem', color: '#19C3A0' }}>{r.hora_reunion}</div>
                          </td>
                          <td style={{ background: 'transparent' }}>
                            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{r.nombre}</div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{r.email}</div>
                            {r.telefono && <div style={{ fontSize: '0.72rem', color: '#4ade80' }}>{r.telefono}</div>}
                          </td>
                          <td style={{ background: 'transparent' }}>
                            <span className="badge rounded-pill px-2 py-1" style={{ background: 'rgba(76,91,255,0.2)', color: '#818cf8' }}>
                              {r.medio}
                            </span>
                          </td>
                          <td style={{ background: 'transparent', maxWidth: '250px' }}>
                            <div style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>{r.tema || 'Sin notas.'}</div>
                          </td>
                          <td style={{ background: 'transparent' }}>
                            <select
                              value={r.estado}
                              onChange={(e) => updateStatus('reunion', r.id, { estado: e.target.value })}
                              style={{
                                background: '#1e293b',
                                color: r.estado === 'confirmada' ? '#34d399' : r.estado === 'completada' ? '#38bdf8' : '#facc15',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                              }}
                            >
                              <option value="agendada">Agendada</option>
                              <option value="confirmada">Confirmada</option>
                              <option value="completada">Completada</option>
                              <option value="no_show">No Asistió</option>
                              <option value="cancelada">Cancelada</option>
                            </select>
                          </td>
                          <td style={{ background: 'transparent' }}>
                            {r.link_reunion ? (
                              <a
                                href={r.link_reunion}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm rounded-pill px-3 py-1"
                                style={{ background: 'rgba(25,195,160,0.15)', color: '#19C3A0', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}
                              >
                                Unirse
                              </a>
                            ) : (
                              <button
                                onClick={() => {
                                  const link = prompt('Ingresa el link de reunión:')
                                  if (link) updateStatus('reunion', r.id, { link_reunion: link })
                                }}
                                className="btn btn-sm rounded-pill px-2 py-1"
                                style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: '0.72rem', border: 'none' }}
                              >
                                + Link
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
