# 📋 SAIKORA — Handoff Técnico y Documentación del Proyecto

> **Versión del Documento:** 2.0.0  
> **Última Actualización:** 09 de Noviembre, 2026  
> **Estado del Proyecto:** ✅ Fase 2 Completa — Frontend v2 · DB Supabase · Admin Dashboard · Tiempo Real  
> **Nota de Mantenimiento:** *Este archivo es un documento vivo que se actualiza continuamente conforme evoluciona el proyecto.*

---

## 📑 Tabla de Contenidos

1. [Visión General](#-visión-general)
2. [Estructura de Archivos y Carpetas](#-estructura-de-archivos-y-carpetas)
3. [Sistema de Diseño e Identidad Visual](#-sistema-de-diseño-e-identidad-visual)
4. [Detalle y Funcionamiento de Cada Componente](#-detalle-y-funcionamiento-de-cada-componente)
5. [Base de Datos — Arquitectura Supabase](#-base-de-datos--arquitectura-supabase)
6. [Backend, API y Conexión con Supabase](#-backend-api-y-conexión-con-supabase)
7. [Consola Administrativa /admin](#-consola-administrativa-admin)
8. [Variables de Entorno y Configuración](#-variables-de-entorno-y-configuración)
9. [Despliegue: GitHub + Vercel](#-despliegue-github--vercel)
10. [Seguridad](#️-seguridad)
11. [Backlog Activo y Roadmap](#-backlog-activo-y-roadmap)

---

## 🧭 Visión General

**Saikora** es una plataforma web corporativa moderna orientada a la venta y exposición de servicios tecnológicos especializados: Desarrollo Web, Automatización de Procesos y Sistemas a Medida.

### Stack Tecnológico
- **Framework:** Next.js 15.5.28 (App Router con React 19)
- **Lenguaje:** TypeScript 5.8+ (Target ES2020)
- **Estilos:** CSS Vanilla estructurado con Custom Properties + Bootstrap 5 para grid responsive
- **Iconos:** Font Awesome 6 (vía CDN global con soporte de marcas y SVGs)
- **Base de Datos / BaaS:** Supabase (PostgreSQL, Row Level Security, Triggers automáticos, Realtime)
- **Hosting:** Vercel (producción) · GitHub (repositorio)

### URLs de Producción
| Entorno | URL |
|---|---|
| Producción (Vercel) | `https://saikoraorg.vercel.app` |
| Dominio Personalizado | `https://saikora.org` *(requiere DNS en Vercel → ver sección Despliegue)* |
| Admin Dashboard | `https://saikoraorg.vercel.app/admin` |
| Repositorio | `https://github.com/Saikoraorg/SaikoraWebPage` |

---

## 📁 Estructura de Archivos y Carpetas

```text
Saikora Pagina/
├── public/                                # Activos estáticos públicos
│   ├── saikora-icon.png                   # Ícono de cinta 3D (sin fondo, RGBA, 510×682)
│   ├── saikora-logo.png                   # Logotipo completo oficial (cinta + tipografía)
│   ├── saikora-logo-darkbg.png            # Logotipo optimizado para fondos oscuros (texto blanco)
│   └── saikora-logo.jpg                   # Activo original de marca (referencia maestra)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts               # POST /api/contact — recepción de cotizaciones con rate limiter
│   │   │   ├── agendar-reunion/
│   │   │   │   └── route.ts               # POST /api/agendar-reunion — agendamiento de reuniones
│   │   │   └── admin/
│   │   │       └── data/
│   │   │           └── route.ts           # GET/PATCH /api/admin/data — datos del dashboard (protegido)
│   │   ├── admin/
│   │   │   └── page.tsx                   # Ruta /admin — Consola administrativa privada (PIN auth)
│   │   ├── globals.css                    # Design System v2, variables, animaciones y media queries
│   │   ├── layout.tsx                     # Root layout, CDN Bootstrap 5, Font Awesome 6 y metadatos SEO
│   │   └── page.tsx                       # Ensamblador de la página de inicio (HomePage)
│   ├── components/
│   │   ├── Navbar.tsx                     # Barra de navegación flotante con blur dinámico y menú móvil
│   │   ├── Hero.tsx                       # Hero section con escultura 3D, badges flotantes y CTA
│   │   ├── Services.tsx                   # Carrusel horizontal táctil/arrastrable de servicios
│   │   ├── Stats.tsx                      # Métricas clave en grid 2×2 responsive (navy bg)
│   │   ├── Cases.tsx                      # Casos de éxito con carrusel e interfaces de mockup
│   │   ├── Contact.tsx                    # Formulario de cotización + modal de agendamiento
│   │   ├── Footer.tsx                     # Pie de página corporativo con redes sociales
│   │   ├── SaikoraLogo.tsx                # Componente reutilizable del logo oficial (claro/oscuro)
│   │   └── ScrollReveal.tsx               # Wrapper de animación con IntersectionObserver
│   ├── lib/
│   │   └── supabase.ts                    # Clientes de Supabase (público y servidor service role)
│   └── types/
│       └── index.ts                       # Tipos TypeScript para formularios, leads, reuniones y analytics
├── supabase/
│   ├── schema.sql                         # Script SQL COMPLETO — tablas, RLS, vistas, triggers, seed data
│   └── SETUP.md                           # Guía paso a paso para configurar Supabase
├── .env.local.example                     # Plantilla de variables de entorno requeridas
├── HANDOFF.md                             # Este documento de handoff técnico (v2.0)
├── next.config.js                         # Configuración de compilación Next.js con headers de seguridad
├── package.json                           # Dependencias y scripts del proyecto
├── README.md                              # Documentación general del repositorio
└── tsconfig.json                          # Configuración de TypeScript
```

---

## 🎨 Sistema de Diseño e Identidad Visual

### Paleta de Colores Oficial

| Token CSS | Hex | Uso Principal |
| :--- | :--- | :--- |
| `--sk-teal` | `#19C3A0` | Verde azulado/turquesa de marca, botones principales, acentos |
| `--sk-navy` | `#1A1E29` | Azul marino oscuro profundo, títulos, fondos de contraste |
| `--sk-blue` | `#4C5BFF` | Azul cobalto/eléctrico, degradados complementarios, enlaces |
| `--sk-cream` | `#F5F4EF` | Crema/marfil suave, fondo principal del sitio |

### Degradados Clave
- **Primario (`--grad-primary`):** `linear-gradient(135deg, #19C3A0 0%, #4C5BFF 100%)`
- **Fondo Hero (`--grad-hero-bg`):** `linear-gradient(155deg, #eef9f6 0%, #f0f4ff 50%, #eef4ff 100%)`
- **Superficie Oscura (`--grad-dark`):** `linear-gradient(160deg, #1A1E29 0%, #252b3b 100%)`

### Tipografía
- **Familia:** `Inter` (Google Fonts), pesos 300–900.
- **Escala de títulos:** `clamp(2rem, 4vw, 3.8rem)` con `letter-spacing: -0.025em`.
- **Texto en degradado:** Clase `.grad-text` con clip sobre fondo transparente.

---

## 🧩 Detalle y Funcionamiento de Cada Componente

### 1. `Navbar.tsx`
- Escucha `window.onscroll` con umbral de `20px`. Al superarlo, inyecta clase `.scrolled` → fondo `rgba(245, 244, 239, 0.92)` con `backdrop-filter: blur(24px)`.
- Menú móvil con toggle React, cierre automático al seleccionar sección.

### 2. `Hero.tsx`
- Dos columnas: copy persuasivo (izq) + escultura 3D (der).
- **Escultura 3D:** Pedestal con doble elipse brillante + ícono `/saikora-icon.png` con animación `heroFloat`.
- **Tarjetas flotantes:** `fc-1` Automatiza · `fc-2` Sitios web · `fc-3` Sistemas a medida. Animadas con delays desfasados.
- **Scroll indicator:** ícono `fa-solid fa-computer-mouse` con línea vertical pulsante.

### 3. `Services.tsx` *(Carrusel Interactivo v2)*
- Carrusel horizontal infinito con:
  - **Touch swipe** en móvil (eventos `touchstart`/`touchend`).
  - **Drag-to-scroll** en desktop (eventos `mousedown`/`mousemove`/`mouseup`).
  - **Auto-scroll** con pausa de 1600ms tras interacción y retoma suave.
  - Loop infinito con clonado de tarjetas (3 duplicados al final).

### 4. `Stats.tsx` *(Grid Responsive v2)*
- 4 métricas clave en grid `2×2` responsive (evita clipping en mobile).
- Fondo `--sk-navy` con orbes de resplandor difuso.
- Modal popup glassmorphism de proyectos al hacer clic en `+10 Proyectos`.

### 5. `Cases.tsx`
- Carrusel de proyectos destacados con navegación `prev`/`next`.
- Incluye: Restaurante La Finca · Estudio Nicole Valerio · Logística Express · On Fleek.
- Tarjeta dark luxury con micro-pantalla simulada y medidor circular de porcentaje.

### 6. `Contact.tsx`
- Formulario controlado `useState` con validación en tiempo real.
- 3 columnas: valor de marca · formulario · tarjeta de llamada directa.
- **Modo Resiliente:** Si Supabase no está configurado, entra en modo demo (simula éxito sin romper UI).

### 7. `SaikoraLogo.tsx`
- Props: `size?: number`, `showText?: boolean`, `textColor?: string`.

### 8. `ScrollReveal.tsx`
- `IntersectionObserver` con umbral `0.12`.
- `.sr-hidden` → `.sr-visible`: opacidad 0→1, `translateY(36px)→0`, `blur(8px)→0`. Soporta `delay` en ms.

---

## 🗄️ Base de Datos — Arquitectura Supabase

> Script completo en [`supabase/schema.sql`](./supabase/schema.sql). Correrlo en el SQL Editor de Supabase.

### Tablas

| Tabla | Propósito |
|---|---|
| `public.contactos` | Leads/prospectos de cotización (formulario web) |
| `public.reuniones` | Citas agendadas desde el modal de llamadas |
| `public.servicios` | Catálogo dinámico de servicios de Saikora |
| `public.proyectos` | Portafolio de casos de éxito |
| `public.eventos_analitica` | Tracking del embudo de conversión (sin cookies) |

### Vistas Analíticas (SQL Views)

| Vista | Datos |
|---|---|
| `v_analisis_servicios` | Demanda por servicio, % del total, leads calificados |
| `v_analisis_reuniones` | Tasa de asistencia por plataforma (Meet, Zoom, etc.) |
| `v_leads_pendientes` | Bandeja operativa — leads nuevos/en revisión con urgencia |
| `v_proximas_reuniones` | Agenda próximos 7 días (estado agendada/confirmada) |

### Seguridad (RLS)
- **Contactos / Reuniones / Analytics:** Inserción pública ✅ · Lectura y edición solo autenticados 🔒
- **Servicios / Proyectos:** Lectura pública (solo activos) ✅ · Gestión completa solo autenticados 🔒

### Realtime
Las tablas `contactos` y `reuniones` están en la publicación `supabase_realtime` para sincronización bidireccional en el admin dashboard.

### Cómo correr el schema
1. Ir a [supabase.com](https://supabase.com) → tu proyecto → **SQL Editor**
2. Pegar el contenido de `supabase/schema.sql`
3. Presionar **Run** ✅
4. ¡Las tablas, índices, triggers, políticas RLS y datos semilla quedan listos!

---

## ⚡ Backend, API y Conexión con Supabase

### Endpoints disponibles

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/contact` | `POST` | Recepción de cotizaciones del formulario web |
| `/api/agendar-reunion` | `POST` | Creación de reuniones en Supabase + fallback Excel |
| `/api/admin/data` | `GET` | KPIs, leads y reuniones (requiere `x-admin-token`) |
| `/api/admin/data` | `PATCH` | Actualizar estado de lead/reunión (requiere `x-admin-token`) |

### Protección del endpoint admin
- Header requerido: `x-admin-token: saikora2026`
- Sin el header → `401 Unauthorized`

---

## 🔐 Consola Administrativa /admin

**URL:** `/admin` (producción: `https://saikoraorg.vercel.app/admin`)  
**PIN de acceso:** `saikora2026`  
**Autenticación:** `sessionStorage` del navegador + header `x-admin-token` en cada request de API.

### Funcionalidades del Dashboard

| Módulo | Descripción |
|---|---|
| **KPIs Ejecutivos** | Total leads, leads nuevos, tasa de conversión %, reuniones activas, reuniones completadas |
| **Demanda por Servicio** | Barras horizontales con % de solicitudes por categoría |
| **Plataformas de Reunión** | Desglose de Meet / Zoom / WhatsApp / Llamada / Presencial |
| **Calendario Mensual** | Calendario interactivo con reuniones agendadas por día, clic para ver detalle + link de reunión |
| **Bandeja CRM** | Lista de leads con filtros por estado, edición inline de estado (nuevo→contactado→cotizado→ganado/perdido) |
| **Tiempo Real** | Supabase Realtime suscriptions — se refresca automáticamente al llegar nuevos leads o reuniones |

### Para acceder en local
```
http://localhost:3000/admin
```

---

## ⚙️ Variables de Entorno y Configuración

Crear `.env.local` en la raíz del proyecto:

```env
# URL del proyecto en Supabase (Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co

# Llave anónima pública (Settings > API > anon/public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Llave de rol de servicio — SOLO servidor, NUNCA exponer al cliente
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

> **En Vercel:** Settings → Environment Variables → agregar las 3 variables arriba.

---

## 🚀 Despliegue: GitHub + Vercel

### Estado actual de commits en `main`

| Commit | Descripción |
|---|---|
| `f4eb79b` | feat(admin): consola administrativa privada con analytics, calendario y tiempo real |
| `b332fcd` | feat(db): arquitectura integral de base de datos Supabase y backend de reuniones |
| `6218920` | feat: optimizaciones responsive, nuevo ícono 3D Hero, carrusel táctil, corrección Stats |
| `f45b177` | Primer commit: web oficial de Saikora completa |

### Configurar dominio `saikora.org` en Vercel
1. En Vercel → tu proyecto → **Settings → Domains**
2. Agregar `saikora.org` y `www.saikora.org`
3. En tu proveedor DNS (Namecheap):
   - **A Record:** `@` → `76.76.21.21`
   - **CNAME:** `www` → `cname.vercel-dns.com`
4. Esperar propagación DNS (1–48 horas)

### Variables de entorno en Vercel (obligatorio para Supabase)
1. Vercel → proyecto → **Settings → Environment Variables**
2. Agregar: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. Hacer **Redeploy** para que las variables entren en efecto.

---

## 🛡️ Seguridad

### Headers HTTP (`next.config.js`)
- `X-Frame-Options: DENY` — bloquea clickjacking via iframes
- `X-Content-Type-Options: nosniff` — previene MIME sniffing
- `Strict-Transport-Security` — HTTPS forzado con `max-age=63072000`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — deshabilita camera, micrófono, geolocalización
- `Content-Security-Policy` — whitelist de Google Fonts, cdnjs, Supabase
- `poweredByHeader: false` — oculta fingerprint del stack

### API de Contacto (`/api/contact`)
- **Rate limiter por IP:** máx 5 req/min → `429 Too Many Requests`
- **Sanitización de inputs:** elimina HTML tags y caracteres de control
- **Límites de longitud:** nombre 2–100, email ≤120, mensaje 5–2000 chars
- **Isolación de secretos:** `SUPABASE_SERVICE_ROLE_KEY` solo en servidor

---

## 📌 Backlog Activo y Roadmap

### ✅ Fase 1 — Completada
- [x] Frontend v1: Navbar, Hero, Services, Stats, Cases, Contact, Footer
- [x] Seguridad blindada: headers, CSP, rate limiter, sanitización
- [x] Responsive mobile completo

### ✅ Fase 2 — Completada
- [x] Hero 3D: escultura con ícono recortado `saikora-icon.png` y pedestal luminoso
- [x] Services: carrusel táctil/arrastrable con auto-scroll infinito
- [x] Stats: grid 2×2 responsive (elimina clipping en mobile)
- [x] DB Supabase: 5 tablas, RLS, triggers, 4 vistas analíticas, seed data
- [x] API `/api/agendar-reunion`: insert en Supabase + fallback Excel
- [x] Admin dashboard `/admin`: PIN auth, KPIs, calendario, CRM, Realtime
- [x] API `/api/admin/data`: protegida con token, GET y PATCH

### 🔲 Fase 3 — Pendiente
- [ ] **Supabase configurado en Vercel:** agregar las 3 variables de entorno en Settings → Environment Variables
- [ ] **Dominio `saikora.org`:** configurar DNS en Namecheap → apuntar a Vercel
- [ ] **Link real de Calendly:** reemplazar placeholder en `Contact.tsx`
- [ ] **Teléfono y email definitivos:** confirmar datos de contacto en `Contact.tsx`
- [ ] **Notificaciones por email:** integrar Resend o SendGrid cuando llega un lead
- [ ] **Auto-respuesta al cliente:** email de confirmación automático al prospecto
- [ ] **Google Analytics 4 / Meta Pixel:** para campañas de marketing

---

> *Para actualizar este handoff, editar este archivo marcando las casillas `[x]` o añadiendo nuevas secciones.*
