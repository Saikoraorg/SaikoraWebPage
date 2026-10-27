import { sendContactNotification } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter (5 requests per 60 seconds per IP)
const rateLimitMap = new Map<string, { count: number; firstRequestTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 60 seconds
const MAX_REQUESTS_PER_WINDOW = 5

// Allowed services whitelist
const ALLOWED_SERVICES = [
  'desarrollo-web',
  'automatizacion',
  'sistema-medida',
  'ecommerce',
  'consultoria',
  'otro',
]

// HTML / Script tag sanitizer
function sanitizeString(str: string): string {
  return str
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uD800-\uDFFF]/g, '') // Strip control chars
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'
    const now = Date.now()

    const clientRate = rateLimitMap.get(ip)
    if (clientRate) {
      if (now - clientRate.firstRequestTime < RATE_LIMIT_WINDOW) {
        if (clientRate.count >= MAX_REQUESTS_PER_WINDOW) {
          return NextResponse.json(
            { error: 'Demasiadas solicitudes. Por favor espera un minuto antes de reintentar.' },
            {
              status: 429,
              headers: {
                'Retry-After': '60',
              },
            }
          )
        }
        clientRate.count += 1
      } else {
        rateLimitMap.set(ip, { count: 1, firstRequestTime: now })
      }
    } else {
      rateLimitMap.set(ip, { count: 1, firstRequestTime: now })
    }

    // Clean up old rate limit entries periodically (every 100 entries)
    if (rateLimitMap.size > 100) {
      for (const [key, value] of rateLimitMap.entries()) {
        if (now - value.firstRequestTime > RATE_LIMIT_WINDOW) {
          rateLimitMap.delete(key)
        }
      }
    }

    // 2. Parse & Validate JSON payload
    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Cuerpo de solicitud inválido.' }, { status: 400 })
    }

    const { nombre, email, servicio, mensaje } = body

    // 3. Presence check
    if (!nombre || !email || !servicio || !mensaje) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados.' },
        { status: 400 }
      )
    }

    // 4. Type & length validation
    if (
      typeof nombre !== 'string' ||
      typeof email !== 'string' ||
      typeof servicio !== 'string' ||
      typeof mensaje !== 'string'
    ) {
      return NextResponse.json({ error: 'Tipos de datos inválidos.' }, { status: 400 })
    }

    const cleanNombre = sanitizeString(nombre)
    const cleanEmail = sanitizeString(email).toLowerCase()
    const cleanServicio = sanitizeString(servicio)
    const cleanMensaje = sanitizeString(mensaje)

    if (cleanNombre.length < 2 || cleanNombre.length > 100) {
      return NextResponse.json(
        { error: 'El nombre debe tener entre 2 y 100 caracteres.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (cleanEmail.length > 120 || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'El correo electrónico ingresado no tiene un formato válido.' },
        { status: 400 }
      )
    }

    if (!ALLOWED_SERVICES.includes(cleanServicio)) {
      return NextResponse.json(
        { error: 'El servicio seleccionado no es válido.' },
        { status: 400 }
      )
    }

    if (cleanMensaje.length < 5 || cleanMensaje.length > 2000) {
      return NextResponse.json(
        { error: 'El mensaje debe tener entre 5 y 2000 caracteres.' },
        { status: 400 }
      )
    }

    // 5. Enviar notificación por correo a saikorasupport@gmail.com
    await sendContactNotification({
      nombre: cleanNombre,
      email: cleanEmail,
      servicio: cleanServicio,
      mensaje: cleanMensaje,
    })

    // 6. Database check & insertion
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url') {
      // Demo Mode: Safe log without exposing sensitive tokens
      console.log('📧 [DEMO MODE] Solicitud segura recibida:', {
        nombre: cleanNombre,
        email: cleanEmail,
        servicio: cleanServicio,
        mensajeLength: cleanMensaje.length,
      })
      return NextResponse.json(
        { message: '¡Solicitud recibida correctamente! (Modo demo activo)' },
        { status: 200 }
      )
    }

    // Live Mode: Insert using server-side client
    const { createServerSupabaseClient } = await import('@/lib/supabase')
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from('contactos').insert([
      {
        nombre: cleanNombre,
        email: cleanEmail,
        servicio: cleanServicio,
        mensaje: cleanMensaje,
      },
    ])

    if (error) {
      console.error('Database insertion error:', error.message)
      return NextResponse.json(
        { error: 'No se pudo guardar la solicitud en este momento. Inténtalo de nuevo.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: '¡Solicitud enviada con éxito! Te contactaremos a la brevedad.' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Unhandled API error:', err)
    return NextResponse.json(
      { error: 'Error interno en el servidor.' },
      { status: 500 }
    )
  }
}
