import nodemailer from 'nodemailer'

export const TARGET_EMAIL = 'saikorasupport@gmail.com'

interface ContactData {
  nombre: string
  email: string
  servicio: string
  mensaje: string
}

interface MeetingData {
  nombre: string
  email: string
  telefono?: string
  fecha: string
  hora: string
  medio: string
  notas?: string
}

export async function sendContactNotification(data: ContactData): Promise<boolean> {
  const { nombre, email, servicio, mensaje } = data
  let sent = false

  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      await transporter.sendMail({
        from: `"Saikora Web" <${smtpUser}>`,
        to: TARGET_EMAIL,
        replyTo: email,
        subject: `🚀 Nueva solicitud de contacto: ${nombre} (${servicio})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff;">
            <h2 style="color: #1A1E29; border-bottom: 2px solid #19C3A0; padding-bottom: 12px; margin-top: 0;">
              🚀 Nueva Solicitud de Contacto - Saikora
            </h2>
            <p style="font-size: 15px; color: #334155;"><strong>Nombre:</strong> ${nombre}</p>
            <p style="font-size: 15px; color: #334155;"><strong>Email del cliente:</strong> <a href="mailto:${email}" style="color: #4C5BFF;">${email}</a></p>
            <p style="font-size: 15px; color: #334155;"><strong>Servicio de interés:</strong> <span style="background: #EEF2FF; color: #4C5BFF; padding: 3px 8px; border-radius: 6px; font-weight: 600;">${servicio}</span></p>
            <p style="font-size: 15px; color: #334155;"><strong>Mensaje:</strong></p>
            <div style="background: #f8fafc; padding: 14px 16px; border-radius: 10px; border: 1px solid #e2e8f0; color: #1e293b; line-height: 1.6; font-size: 14px;">
              ${mensaje.replace(/\n/g, '<br/>')}
            </div>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              Enviado automáticamente desde el formulario web de Saikora para <strong>${TARGET_EMAIL}</strong>.
            </p>
          </div>
        `,
      })
      sent = true
      console.log('✅ Correo de contacto enviado vía Nodemailer a', TARGET_EMAIL)
    } catch (err) {
      console.error('Error enviando contacto vía Nodemailer:', err)
    }
  }

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `🚀 Nueva solicitud de contacto: ${nombre} (${servicio})`,
        _replyto: email,
        Nombre: nombre,
        Email: email,
        Servicio: servicio,
        Mensaje: mensaje,
        _template: 'table',
      }),
    })
    if (res.ok) {
      sent = true
      console.log('✅ Notificación entregada a FormSubmit para', TARGET_EMAIL)
    }
  } catch (err) {
    console.error('Error enviando contacto vía FormSubmit:', err)
  }

  return sent
}

export async function sendMeetingNotification(data: MeetingData): Promise<boolean> {
  const { nombre, email, telefono, fecha, hora, medio, notas } = data
  let sent = false

  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      await transporter.sendMail({
        from: `"Saikora Web" <${smtpUser}>`,
        to: TARGET_EMAIL,
        replyTo: email,
        subject: `📅 ¡Nueva Reunión Agendada!: ${nombre} - ${fecha} a las ${hora}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff;">
            <h2 style="color: #1A1E29; border-bottom: 2px solid #4C5BFF; padding-bottom: 12px; margin-top: 0;">
              📅 Nueva Reunión Agendada - Saikora
            </h2>
            <p style="font-size: 15px; color: #334155;"><strong>Cliente / Empresa:</strong> ${nombre}</p>
            <p style="font-size: 15px; color: #334155;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #4C5BFF;">${email}</a></p>
            <p style="font-size: 15px; color: #334155;"><strong>Teléfono / WhatsApp:</strong> ${telefono || 'No proporcionado'}</p>
            <p style="font-size: 15px; color: #334155;"><strong>Fecha programada:</strong> <span style="font-weight: 700; color: #1e293b;">${fecha}</span></p>
            <p style="font-size: 15px; color: #334155;"><strong>Hora:</strong> <span style="font-weight: 700; color: #1e293b;">${hora}</span></p>
            <p style="font-size: 15px; color: #334155;"><strong>Plataforma:</strong> <span style="background: #E6FAF6; color: #19C3A0; padding: 3px 8px; border-radius: 6px; font-weight: 700;">${medio}</span></p>
            <p style="font-size: 15px; color: #334155;"><strong>Notas / Tema:</strong></p>
            <div style="background: #f8fafc; padding: 14px 16px; border-radius: 10px; border: 1px solid #e2e8f0; color: #1e293b; line-height: 1.6; font-size: 14px;">
              ${(notas || 'Sin notas adicionales').replace(/\n/g, '<br/>')}
            </div>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              Reunión registrada en Excel y notificada automáticamente para <strong>${TARGET_EMAIL}</strong>.
            </p>
          </div>
        `,
      })
      sent = true
      console.log('✅ Correo de reunión enviado vía Nodemailer a', TARGET_EMAIL)
    } catch (err) {
      console.error('Error enviando reunión vía Nodemailer:', err)
    }
  }

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `📅 ¡Nueva Reunión Agendada!: ${nombre} - ${fecha} (${hora})`,
        _replyto: email,
        Nombre: nombre,
        Email: email,
        Telefono: telefono || 'No proporcionado',
        Fecha: fecha,
        Hora: hora,
        Plataforma: medio,
        Notas: notas || 'Sin notas adicionales',
        _template: 'table',
      }),
    })
    if (res.ok) {
      sent = true
      console.log('✅ Notificación de reunión entregada a FormSubmit para', TARGET_EMAIL)
    }
  } catch (err) {
    console.error('Error enviando reunión vía FormSubmit:', err)
  }

  return sent
}
