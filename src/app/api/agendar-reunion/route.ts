import { sendMeetingNotification } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Sanitize inputs
function sanitize(str: string): string {
  return str
    .replace(/<[^>]*>?/gm, '')
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uD800-\uDFFF]/g, '')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, fecha, hora, medio, notas } = body

    if (!nombre || !email || !fecha || !hora || !medio) {
      return NextResponse.json(
        { error: 'Por favor completa todos los campos requeridos (nombre, email, fecha, hora y plataforma).' },
        { status: 400 }
      )
    }

    const cleanNombre = sanitize(nombre)
    const cleanEmail = sanitize(email).toLowerCase()
    const cleanTelefono = telefono ? sanitize(telefono) : ''
    const cleanFecha = sanitize(fecha)
    const cleanHora = sanitize(hora)
    const cleanMedio = sanitize(medio)
    const cleanNotas = notas ? sanitize(notas) : ''

    // 1. Guardado en Supabase (PostgreSQL) si las llaves están configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url') {
      try {
        const { createServerSupabaseClient } = await import('@/lib/supabase')
        const supabase = createServerSupabaseClient()
        const { error: dbError } = await supabase.from('reuniones').insert([
          {
            nombre: cleanNombre,
            email: cleanEmail,
            telefono: cleanTelefono || null,
            fecha_reunion: cleanFecha,
            hora_reunion: cleanHora,
            medio: cleanMedio,
            tema: cleanNotas || 'Consulta general',
            estado: 'agendada',
          },
        ])
        if (dbError) {
          console.warn('Aviso: no se pudo insertar en Supabase (verifique schema):', dbError.message)
        } else {
          console.log('✅ Reunión guardada exitosamente en Supabase (PostgreSQL)')
        }
      } catch (dbErr) {
        console.warn('Error de conexión con Supabase en agendar-reunion:', dbErr)
      }
    }

    // 2. Respaldo en Excel local (reuniones_agendadas.xlsx) con manejo resiliente en Serverless
    try {
      const XLSX = await import('xlsx')
      const filePath = path.join(process.cwd(), 'reuniones_agendadas.xlsx')
      let existingData: Record<string, string | number>[] = []

      if (fs.existsSync(filePath)) {
        try {
          const fileBuffer = fs.readFileSync(filePath)
          const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
          const sheetName = workbook.SheetNames[0] || 'Reuniones'
          const sheet = workbook.Sheets[sheetName]
          if (sheet) {
            existingData = XLSX.utils.sheet_to_json(sheet)
          }
        } catch {
          existingData = []
        }
      }

      const newMeeting = {
        'N°': existingData.length + 1,
        'Fecha Registro': new Date().toLocaleString('es-CR'),
        'Nombre / Cliente': cleanNombre,
        'Correo Electrónico': cleanEmail,
        'Teléfono / WhatsApp': cleanTelefono || 'No proporcionado',
        'Fecha de Reunión': cleanFecha,
        'Hora de Reunión': cleanHora,
        'Medio / Plataforma': cleanMedio,
        'Tema / Notas': cleanNotas || 'Consulta general',
        'Estado': 'Agendada',
      }

      const updatedData = [...existingData, newMeeting]
      const newWorksheet = XLSX.utils.json_to_sheet(updatedData)

      newWorksheet['!cols'] = [
        { wch: 6 },  // N°
        { wch: 20 }, // Fecha Registro
        { wch: 25 }, // Nombre
        { wch: 28 }, // Correo
        { wch: 20 }, // Teléfono
        { wch: 16 }, // Fecha Reunión
        { wch: 16 }, // Hora Reunión
        { wch: 20 }, // Medio
        { wch: 35 }, // Tema
        { wch: 14 }, // Estado
      ]

      const newWorkbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Reuniones')
      const buffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'buffer' })
      fs.writeFileSync(filePath, buffer)
    } catch (fsErr) {
      // En entornos Serverless de solo lectura (como Vercel lambda), no bloquea la respuesta exitosa
      console.warn('Nota: archivo Excel omitido en entorno de solo lectura:', fsErr)
    }

    // 3. Notificación por correo electrónico
    try {
      await sendMeetingNotification({
        nombre: cleanNombre,
        email: cleanEmail,
        telefono: cleanTelefono,
        fecha: cleanFecha,
        hora: cleanHora,
        medio: cleanMedio,
        notas: cleanNotas,
      })
    } catch (mailErr) {
      console.error('Error enviando notificación por correo:', mailErr)
    }

    return NextResponse.json({
      success: true,
      message: '¡Reunión agendada exitosamente!',
      meeting: {
        nombre: cleanNombre,
        email: cleanEmail,
        fecha: cleanFecha,
        hora: cleanHora,
        medio: cleanMedio,
      },
    })
  } catch (error: any) {
    console.error('Error al agendar reunión:', error)
    return NextResponse.json(
      { error: error?.message || 'Ocurrió un error al procesar la reunión. Inténtalo de nuevo.' },
      { status: 500 }
    )
  }
}
