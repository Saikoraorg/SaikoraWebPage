import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const DEFAULT_ADMIN_TOKEN = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PIN || 'saikora2026'

// In-memory demo data store for immediate evaluation when Supabase is not connected
let demoContactos = [
  {
    id: 'c-001',
    nombre: 'Elena Morales',
    email: 'elena@novatech.cr',
    telefono: '+506 8844 1122',
    servicio: 'automatizacion',
    mensaje: 'Buscamos automatizar la sincronización de leads de Facebook Ads hacia WhatsApp y nuestro CRM interno con n8n.',
    estado: 'en_cotizacion',
    prioridad: 'alta',
    presupuesto_estimado: '$1,500 - $3,000',
    origen: 'formulario_web',
    utm_source: 'linkedin',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'c-002',
    nombre: 'Dr. Alejandro Solís',
    email: 'alejandro@clinicadental.com',
    telefono: '+506 7012 3344',
    servicio: 'sistema-medida',
    mensaje: 'Necesitamos una plataforma web para agendamiento de pacientes con confirmación de citas por WhatsApp y recordatorios.',
    estado: 'contactado',
    prioridad: 'urgente',
    presupuesto_estimado: '$3,000 - $5,000',
    origen: 'formulario_web',
    utm_source: 'google',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'c-003',
    nombre: 'Mariana Castro',
    email: 'mcastro@boutiquemoda.cr',
    telefono: '+506 8765 4321',
    servicio: 'ecommerce',
    mensaje: 'Queremos renovar nuestra tienda en línea para recibir pagos locales con SINPE Móvil y tarjetas internacionales con Stripe.',
    estado: 'nuevo',
    prioridad: 'media',
    presupuesto_estimado: '$1,200 - $2,500',
    origen: 'formulario_web',
    utm_source: 'instagram',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'c-004',
    nombre: 'Roberto Brenes',
    email: 'roberto@logisticaexpress.net',
    telefono: '+506 8333 9900',
    servicio: 'desarrollo-web',
    mensaje: 'Requerimos rediseño completo de nuestro sitio corporativo con optimización SEO y velocidad de carga.',
    estado: 'ganado',
    prioridad: 'media',
    presupuesto_estimado: '$2,000',
    origen: 'formulario_web',
    utm_source: 'directo',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
]

// Get date in YYYY-MM-DD format
const getRelativeDate = (dayOffset: number) => {
  const d = new Date()
  d.setDate(d.getDate() + dayOffset)
  return d.toISOString().split('T')[0]
}

let demoReuniones = [
  {
    id: 'r-001',
    nombre: 'Elena Morales (NovaTech)',
    email: 'elena@novatech.cr',
    telefono: '+506 8844 1122',
    fecha_reunion: getRelativeDate(0), // Today
    hora_reunion: '10:00 AM',
    medio: 'Google Meet',
    tema: 'Revisión técnica de flujos n8n y WhatsApp Business API',
    estado: 'confirmada',
    link_reunion: 'https://meet.google.com/abc-defg-hij',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'r-002',
    nombre: 'Dr. Alejandro Solís',
    email: 'alejandro@clinicadental.com',
    telefono: '+506 7012 3344',
    fecha_reunion: getRelativeDate(1), // Tomorrow
    hora_reunion: '02:00 PM',
    medio: 'Microsoft Teams',
    tema: 'Demostración de sistema de citas similar a caso On Fleek',
    estado: 'agendada',
    link_reunion: 'https://teams.microsoft.com/l/meetup-join/...',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'r-003',
    nombre: 'Mariana Castro',
    email: 'mcastro@boutiquemoda.cr',
    telefono: '+506 8765 4321',
    fecha_reunion: getRelativeDate(3), // In 3 days
    hora_reunion: '11:00 AM',
    medio: 'Zoom',
    tema: 'Planificación de catálogo e-commerce y pasarelas de pago',
    estado: 'agendada',
    link_reunion: '',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'r-004',
    nombre: 'Carlos Jiménez',
    email: 'carlos@inmobiliariacr.com',
    telefono: '+506 8999 1234',
    fecha_reunion: getRelativeDate(-2), // 2 days ago
    hora_reunion: '04:00 PM',
    medio: 'Google Meet',
    tema: 'Portal inmobiliario con búsqueda avanzada por zonas',
    estado: 'completada',
    link_reunion: 'https://meet.google.com/xyz-uvwx-rst',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
]

function verifyAuth(request: NextRequest): boolean {
  const token = request.headers.get('x-admin-token') || request.nextUrl.searchParams.get('token')
  return token === DEFAULT_ADMIN_TOKEN
}

// GET: Carga analíticas, contactos y reuniones en tiempo real
export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Acceso no autorizado al panel administrativo.' }, { status: 401 })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const isSupabaseConfigured =
      supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url' && !supabaseUrl.includes('placeholder')

    let contactosList = demoContactos
    let reunionesList = demoReuniones
    let isLiveFromSupabase = false

    if (isSupabaseConfigured) {
      try {
        const supabase = createServerSupabaseClient()
        const [cRes, rRes] = await Promise.all([
          supabase.from('contactos').select('*').order('created_at', { ascending: false }),
          supabase.from('reuniones').select('*').order('fecha_reunion', { ascending: true }),
        ])

        if (!cRes.error && cRes.data && cRes.data.length > 0) {
          contactosList = cRes.data
          isLiveFromSupabase = true
        }

        if (!rRes.error && rRes.data && rRes.data.length > 0) {
          reunionesList = rRes.data
          isLiveFromSupabase = true
        }
      } catch (err) {
        console.warn('Fallback a datos demo para dashboard admin:', err)
      }
    }

    // Calcular KPIs y analíticas
    const totalLeads = contactosList.length
    const leadsNuevos = contactosList.filter((c) => c.estado === 'nuevo').length
    const leadsGanados = contactosList.filter((c) => c.estado === 'ganado').length
    const conversionRatePct = totalLeads > 0 ? Math.round((leadsGanados / totalLeads) * 100) : 0

    const totalReuniones = reunionesList.length
    const reunionesCompletadas = reunionesList.filter((r) => r.estado === 'completada').length
    const reunionesAgendadas = reunionesList.filter((r) => r.estado === 'agendada' || r.estado === 'confirmada').length

    // Desglose por servicio
    const demandByService: Record<string, number> = {}
    contactosList.forEach((c) => {
      const s = c.servicio || 'otro'
      demandByService[s] = (demandByService[s] || 0) + 1
    })

    // Desglose por plataforma de reunión
    const meetingsByPlatform: Record<string, number> = {}
    reunionesList.forEach((r) => {
      const p = r.medio || 'Otro'
      meetingsByPlatform[p] = (meetingsByPlatform[p] || 0) + 1
    })

    return NextResponse.json({
      success: true,
      isLiveFromSupabase,
      metrics: {
        totalLeads,
        leadsNuevos,
        leadsGanados,
        conversionRatePct,
        totalReuniones,
        reunionesCompletadas,
        reunionesAgendadas,
        demandByService,
        meetingsByPlatform,
      },
      contactos: contactosList,
      reuniones: reunionesList,
    })
  } catch (error: any) {
    console.error('Error en GET /api/admin/data:', error)
    return NextResponse.json({ error: 'Error al consultar datos administrativos.' }, { status: 500 })
  }
}

// PATCH: Actualiza estado o notas de un contacto o reunión
export async function PATCH(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, id, updates } = body

    if (!type || !id || !updates) {
      return NextResponse.json({ error: 'Parámetros incompletos (type, id, updates).' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const isSupabaseConfigured =
      supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url' && !supabaseUrl.includes('placeholder')

    if (isSupabaseConfigured) {
      try {
        const supabase = createServerSupabaseClient()
        const table = type === 'contacto' ? 'contactos' : 'reuniones'
        const { error } = await supabase.from(table).update(updates).eq('id', id)

        if (error) {
          throw new Error(error.message)
        }

        return NextResponse.json({ success: true, message: 'Registro actualizado en Supabase.' })
      } catch (err: any) {
        console.error('Error al actualizar en Supabase:', err)
      }
    }

    // Actualización en memoria demo
    if (type === 'contacto') {
      demoContactos = demoContactos.map((c) => (c.id === id ? { ...c, ...updates } : c))
    } else if (type === 'reunion') {
      demoReuniones = demoReuniones.map((r) => (r.id === id ? { ...r, ...updates } : r))
    }

    return NextResponse.json({
      success: true,
      message: 'Registro actualizado con éxito.',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al actualizar.' }, { status: 500 })
  }
}
