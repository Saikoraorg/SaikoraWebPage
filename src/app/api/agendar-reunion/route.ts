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
    const XLSX = await import('xlsx')
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

    // File path in the root of the project
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
      } catch (e) {
        console.warn('No se pudo leer archivo existente, se creará uno nuevo:', e)
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

    // Create new workbook and sheet
    const newWorksheet = XLSX.utils.json_to_sheet(updatedData)

    // Set column widths for a polished look in Excel
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

    // Write file to disk
    const buffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'buffer' })
    fs.writeFileSync(filePath, buffer)

    // Enviar notificación por correo a saikorasupport@gmail.com
    await sendMeetingNotification({
      nombre: cleanNombre,
      email: cleanEmail,
      telefono: cleanTelefono,
      fecha: cleanFecha,
      hora: cleanHora,
      medio: cleanMedio,
      notas: cleanNotas,
    })

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
    console.error('Error al agendar reunión en Excel:', error)
    return NextResponse.json(
      { error: error?.message || 'Ocurrió un error al guardar la reunión. Inténtalo de nuevo.' },
      { status: 500 }
    )
  }
}
