// ============================================================
// Tipos de Datos — Saikora Web & Data Architecture
// ============================================================

export type ServicioId =
  | 'desarrollo-web'
  | 'automatizacion'
  | 'sistema-medida'
  | 'ecommerce'
  | 'consultoria'
  | 'otro'

export type EstadoContacto =
  | 'nuevo'
  | 'en_revision'
  | 'contactado'
  | 'en_cotizacion'
  | 'ganado'
  | 'perdido'
  | 'descartado'
  | 'spam'

export type PrioridadLead = 'baja' | 'media' | 'alta' | 'urgente'

export type MedioReunion =
  | 'Google Meet'
  | 'Microsoft Teams'
  | 'Zoom'
  | 'WhatsApp'
  | 'Llamada Telefónica'
  | 'Presencial'

export type EstadoReunion =
  | 'agendada'
  | 'confirmada'
  | 'reprogramada'
  | 'completada'
  | 'cancelada'
  | 'no_show'

// 1. Modelo de Contacto / Cotización (CRM)
export interface ContactoLead {
  id?: string
  nombre: string
  email: string
  telefono?: string
  servicio: ServicioId | string
  mensaje: string
  estado?: EstadoContacto
  prioridad?: PrioridadLead
  presupuesto_estimado?: string
  notas_internas?: string
  asignado_a?: string
  origen?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  dispositivo?: string
  ip_address?: string
  created_at?: string
  contacted_at?: string
  closed_at?: string
  updated_at?: string
}

// 2. Modelo de Agendamiento de Reunión
export interface ReunionAgendada {
  id?: string
  contacto_id?: string
  nombre: string
  email: string
  telefono?: string
  fecha_reunion: string // YYYY-MM-DD
  hora_reunion: string
  medio: MedioReunion | string
  tema?: string
  estado?: EstadoReunion
  link_reunion?: string
  resultado_reunion?: string
  duracion_minutos?: number
  created_at?: string
  updated_at?: string
}

// 3. Modelo de Servicio (Catálogo)
export interface Servicio {
  id?: string
  slug: string
  titulo: string
  descripcion: string
  icono: string
  icono_bg?: string
  color_acento?: string
  tags?: string[]
  activo?: boolean
  orden?: number
}

// 4. Modelo de Proyecto / Caso de Éxito
export interface ProyectoCaso {
  id?: string
  slug: string
  cliente: string
  categoria: string
  titulo_proyecto: string
  descripcion: string
  resultado_valor: string
  resultado_label: string
  icono?: string
  color_acento?: string
  caracteristicas?: string[]
  tecnologias?: string[]
  destacado?: boolean
  activo?: boolean
  orden?: number
}

// 5. Modelo de Evento de Conversión / Analítica Web
export interface EventoAnalitica {
  id?: string
  tipo_evento: string
  seccion: string
  metadata?: Record<string, any>
  dispositivo?: 'mobile' | 'desktop' | 'tablet'
  created_at?: string
}

// Alias legacy para retrocompatibilidad
export type ContactForm = ContactoLead
export type Service = Servicio
export type CaseStudy = ProyectoCaso
