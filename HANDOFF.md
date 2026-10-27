# 📋 SAIKORA — Handoff Técnico y Documentación del Proyecto

> **Versión del Documento:** 1.1.0  
> **Última Actualización:** 18 de Octubre, 2026  
> **Estado del Proyecto:** ✅ Frontend v1.1 Completo / Cards Rediseñadas / Modal de Clientes Activo / Seguridad Blindada y Verificada  
> **Nota de Mantenimiento:** *Este archivo es un documento vivo que se actualiza continuamente conforme evoluciona el proyecto, se completan tareas pendientes o se añaden nuevas funcionalidades.*

---

## 📑 Tabla de Contenidos

1. [Visión General](#-visión-general)
2. [Estructura de Archivos y Carpetas](#-estructura-de-archivos-y-carpetas)
3. [Sistema de Diseño e Identidad Visual](#-sistema-de-diseño-e-identidad-visual)
4. [Detalle y Funcionamiento de Cada Componente](#-detalle-y-funcionamiento-de-cada-componente)
5. [Backend, API y Conexión con Supabase](#-backend-api-y-conexión-con-supabase)
6. [Flujo de Ejecución y Comandos Útiles](#-flujo-de-ejecución-y-comandos-útiles)
7. [Backlog Activo y Tareas Pendientes (Roadmap)](#-backlog-activo-y-tareas-pendientes-roadmap)

---

## 🧭 Visión General

**Saikora** es una plataforma web corporativa moderna y de alta gama orientada a la venta y exposición de servicios tecnológicos especializados:
- **Desarrollo Web:** Sitios modernos, rápidos y optimizados para conversión.
- **Automatización de Procesos:** Flujos inteligentes que reducen tareas repetitivas y tiempos operativos.
- **Sistemas a Medida:** Plataformas SaaS, software interno y aplicaciones empresariales.

### Stack Tecnológico
- **Framework:** Next.js 15+ (App Router con React 19)
- **Lenguaje:** TypeScript 5.8+ (Target ES2020)
- **Estilos:** CSS Vanilla estructurado con Custom Properties + Bootstrap 5 para grid responsive
- **Iconos:** Font Awesome 6 (vía CDN global con soporte de marcas y SVGs)
- **Base de Datos / BaaS:** Supabase (PostgreSQL, Row Level Security, Triggers automáticos)

---

## 📁 Estructura de Archivos y Carpetas

```text
Saikora Pagina/
├── public/                                # Activos estáticos públicos
│   ├── saikora-icon.png                   # Ícono de cinta 3D con fondo transparente
│   ├── saikora-logo.png                   # Logotipo completo oficial (cinta + tipografía)
│   ├── saikora-logo-darkbg.png            # Logotipo optimizado con texto blanco para fondos oscuros
│   └── saikora-logo.jpg                   # Activo original de marca (master reference)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts               # Endpoint POST para recepción de solicitudes y guardado
│   │   ├── globals.css                    # Design System v2, variables de color, animaciones y media queries
│   │   ├── layout.tsx                     # Root layout, CDN de Bootstrap 5, Font Awesome 6 y metadatos SEO
│   │   └── page.tsx                       # Ensamblador de la página de inicio (HomePage)
│   ├── components/
│   │   ├── Navbar.tsx                     # Barra de navegación flotante con blur dinámico y menú móvil
│   │   ├── Hero.tsx                       # Hero section con escultura 3D, badges flotantes y CTA
│   │   ├── Services.tsx                   # Grid de servicios con mockups ilustrados y hover effects
│   │   ├── Stats.tsx                      # Métricas clave en fondo dark navy con resplandores
│   │   ├── Cases.tsx                      # Casos de éxito con carrusel, interfaces y badges de porcentaje
│   │   ├── Contact.tsx                    # Formulario de cotización conectado + tarjetas de reunión directa
│   │   ├── Footer.tsx                     # Pie de página corporativo con enlaces y redes sociales
│   │   ├── SaikoraLogo.tsx                # Componente reutilizable del logo oficial (claro/oscuro)
│   │   └── ScrollReveal.tsx               # Wrapper de animación con IntersectionObserver y blur progresivo
│   ├── lib/
│   │   └── supabase.ts                    # Clientes de Supabase (público y servidor con service role)
│   └── types/
│       └── index.ts                       # Definiciones de tipos TypeScript para formularios y modelos
├── supabase/
│   ├── schema.sql                         # Script SQL DDL con tablas, RLS, políticas y triggers
│   └── SETUP.md                           # Guía rápida paso a paso para configurar Supabase
├── .env.local.example                     # Plantilla de variables de entorno requeridas
├── HANDOFF.md                             # Este documento de handoff técnico
├── next.config.js                         # Configuración de compilación Next.js
├── package.json                           # Dependencias y scripts del proyecto
├── README.md                              # Documentación general del repositorio
└── tsconfig.json                          # Configuración de TypeScript
```

---

## 🎨 Sistema de Diseño e Identidad Visual

### Paleta de Colores Oficial

| Token CSS | Hex | Uso Principal |
| :--- | :--- | :--- |
| `--sk-teal` | `#19C3A0` | Verde azulado/turquesa de marca, botones principales, acentos destacados |
| `--sk-navy` | `#1A1E29` | Azul marino oscuro profundo, títulos principales, fondos de contraste |
| `--sk-blue` | `#4C5BFF` | Azul cobalto/eléctrico, degradados complementarios, enlaces |
| `--sk-cream` | `#F5F4EF` | Crema/marfil suave, fondo principal del sitio, transmite elegancia |

### Degradados Clave
- **Primario (`--grad-primary`):** `linear-gradient(135deg, #19C3A0 0%, #4C5BFF 100%)`
- **Fondo Hero (`--grad-hero-bg`):** `linear-gradient(155deg, #eef9f6 0%, #f0f4ff 50%, #eef4ff 100%)`
- **Superficie Oscura (`--grad-dark`):** `linear-gradient(160deg, #1A1E29 0%, #252b3b 100%)`

### Tipografía
- **Familia:** `Inter` (Google Fonts), cargada con pesos 300 a 900.
- **Escala de títulos:** `clamp(2rem, 4vw, 3.8rem)` con `letter-spacing: -0.025em`.
- **Efecto de texto en degradado:** Clase `.grad-text` con recorte de fondo sobre texto transparente.

---

## 🧩 Detalle y Funcionamiento de Cada Componente

### 1. `Navbar.tsx` ([src/components/Navbar.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/Navbar.tsx))
- **Mecanismo:** Escucha el evento `window.onscroll` con un umbral de `20px`. Al superarlo, inyecta la clase `.scrolled`.
- **Estilos:**
  - En estado inicial: Fondo transparente.
  - En estado `.scrolled`: Fondo `rgba(245, 244, 239, 0.92)` con `backdrop-filter: blur(24px)` y borde inferior sutil.
- **Enlaces:** Clase `.sk-nav-link` con pseudoelemento `::after` animado que se expande horizontalmente al hacer hover.
- **Menú Móvil:** Toggle controlado por estado React con animaciones y cierre automático al seleccionar una sección.
- **CTA:** Botón `.btn-sk-primary` con flecha `fa-solid fa-arrow-right`.

### 2. `Hero.tsx` ([src/components/Hero.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/Hero.tsx))
- **Mecanismo:** Estructura en dos columnas (Copy persuasivo a la izquierda + Escultura visual a la derecha).
- **Escultura 3D:**
  - Pedestal con doble elipse brillante y resplandor radial difuminado (`box-shadow: 0 0 60px rgba(25, 195, 160, 0.35)`).
  - Ícono oficial de Saikora (`/saikora-icon.png`) con animación `heroFloat` de levitación continua.
- **Tarjetas Flotantes:**
  - `fc-1`: "Automatiza tus procesos" (`fa-solid fa-gears`).
  - `fc-2`: "Sitios web que impulsan" (`fa-solid fa-globe`).
  - `fc-3`: "Sistemas a medida" (`fa-solid fa-code`).
  - Animadas con delays desfasados para generar sensación de tridimensionalidad viva.
- **Scroll Indicator:** Icono de ratón (`fa-solid fa-computer-mouse`) con línea vertical pulsante que guía al usuario hacia la siguiente sección.

### 3. `Services.tsx` ([src/components/Services.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/Services.tsx))
- **Mecanismo:** Renderiza las 3 ofertas centrales de Saikora mediante un array dinámico de datos.
- **Previsualizaciones en vivo (Mockups UI):**
  - **Desarrollo Web:** Mini navegador con barra de URL (`saikora.com/web`), botones de ventana y tarjetas de contenido.
  - **Automatización:** Nodos de flujo interconectados con badges de robot y rayo.
  - **Sistemas a Medida:** Gráfico de barras ascendente con indicador de crecimiento `+98.4%`.
- **Efectos Hover:**
  - Elevación vertical de `10px`.
  - Despliegue de línea superior en degradado mediante `scaleX(1)`.
  - El botón circular inferior transiciona a degradado completo y desplaza su flecha hacia la derecha.

### 4. `Stats.tsx` ([src/components/Stats.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/Stats.tsx))
- **Mecanismo:** 4 tarjetas de métricas en fondo oscuro (`--sk-navy`) con dos orbes de resplandor difuso de fondo.
- **Métricas:**
  - `+10` Proyectos completados (`fa-solid fa-rocket`)
  - `100%` Clientes satisfechos (`fa-solid fa-users`)
  - `+3` Años de experiencia (`fa-solid fa-chart-line`)
  - `24/7` Soporte y mantenimiento (`fa-solid fa-shield-halved`)
- **Valores:** Tipografía en 2.4rem con relleno en degradado turquesa-azul.

### 5. `Cases.tsx` ([src/components/Cases.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/Cases.tsx))
- **Mecanismo:** Carrusel de proyectos destacados con navegación cíclica anterior/siguiente (`prev` y `next`).
- **Casos Implementados:**
  - **Restaurante La Finca:** Sistema de comandas y stock (`60% en tiempo de pedidos`).
  - **Tienda Online:** E-commerce escalable (`45% en ventas`).
  - **Logística Express:** Seguimiento en tiempo real y CRM (`70% en tiempos de respuesta`).
- **Diseño de Tarjeta:** Contenedor dark luxury con micro-pantalla simulada según categoría y medidor circular de porcentaje en la base.

### 6. `Contact.tsx` ([src/components/Contact.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/Contact.tsx))
- **Mecanismo:** Formulario controlado mediante `useState` con validación en tiempo real.
- **Estructura en 3 Columnas:**
  - **Izquierda:** Propuesta de valor, logo Saikora blanco y beneficios (`Agenda una reunión`, `Solicita una cotización`).
  - **Centro:** Tarjeta blanca flotante de alta legibilidad con inputs redondeados y botón submit con estado de carga (`spinner`).
  - **Derecha:** Tarjeta blanca para agendar llamada directa vía Calendly y datos de contacto rápido (email, teléfono y ubicación en San José, Costa Rica).
- **Modo Resiliente:** Si Supabase no tiene llaves válidas aún, el formulario entra automáticamente en **Modo Demo**, validando datos, simulando el envío exitoso e imprimiendo el payload en consola para no bloquear pruebas de interfaz.

### 7. `Footer.tsx` ([src/components/Footer.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/Footer.tsx))
- **Mecanismo:** Pie de página sobrio (`#10131c`) con divisor superior de 1px.
- **Elementos:**
  - Logotipo oficial en blanco (`textColor="#FFFFFF"`).
  - Enlaces de navegación con scroll suave a anchors de la página.
  - Botones sociales con iconos de Font Awesome: LinkedIn (`fa-brands fa-linkedin-in`), Instagram (`fa-brands fa-instagram`), YouTube (`fa-brands fa-youtube`).
  - Tags de marca con rombos separadores: `Ideas ✦ Tecnología ✦ Resultados`.

### 8. `SaikoraLogo.tsx` ([src/components/SaikoraLogo.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/SaikoraLogo.tsx))
- **Propósito:** Componente único y centralizado para la renderización del logo.
- **Props:**
  - `size?: number` (controla tanto la cinta como la escala de la tipografía proporcionalmente, por defecto `38`).
  - `showText?: boolean` (permite ocultar la tipografía si solo se necesita el isotipo).
  - `textColor?: string` (color del texto "KORA", por defecto `#1A1E29`; en modo oscuro se pasa `#FFFFFF`).

### 9. `ScrollReveal.tsx` ([src/components/ScrollReveal.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/ScrollReveal.tsx))
- **Mecanismo:** Utiliza la API nativa de `IntersectionObserver` con un umbral de `0.12`.
- **Efecto Visual:** Inicialmente los elementos tienen `.sr-hidden` (`opacity: 0`, `translateY(36px)` y `filter: blur(8px)`). Al intersectar la pantalla, se añade `.sr-visible`, transformando de forma fluida el elemento hacia opacidad 1, posición neutral y nitidez total (`blur(0px)`). Soporta `delay` en milisegundos para animaciones escalonadas.

---

## ⚡ Backend, API y Conexión con Supabase

### 1. Endpoint de Contacto (`/api/contact`)
- **Ubicación:** [src/app/api/contact/route.ts](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/app/api/contact/route.ts)
- **Método:** `POST`
- **Validaciones:**
  - Existencia de todos los campos obligatorios (`nombre`, `email`, `servicio`, `mensaje`).
  - Formato válido de dirección de correo electrónico mediante expresión regular.
- **Lógica de Conexión:**
  - Verifica si `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` están definidas y no corresponden al valor placeholder.
  - Si no están configuradas: Responde con status 200 en modo demo.
  - Si están configuradas: Inserta el registro en la tabla `contactos` de Supabase usando el cliente seguro de servidor.

### 2. Configuración de Variables de Entorno (`.env.local`)
Crea un archivo llamado `.env.local` en la raíz del proyecto con la siguiente estructura:

```env
# URL de tu proyecto en Supabase (Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co

# Llave anónima pública (Settings > API > Project API Keys > anon/public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Llave de rol de servicio privada (Settings > API > Project API Keys > service_role)
# NUNCA compartir ni exponer en el cliente
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### 3. Ejecución del Schema en Supabase
El script completo con tablas, índices, políticas de seguridad RLS y disparadores está listo en [supabase/schema.sql](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/supabase/schema.sql).

Pasos para aplicarlo:
1. Entra a tu dashboard en [supabase.com](https://supabase.com).
2. Selecciona tu proyecto y abre la pestaña **SQL Editor**.
3. Pega el contenido de [supabase/schema.sql](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/supabase/schema.sql) y presiona **Run**.
4. ¡Listo! Las tablas `contactos`, `proyectos` y `servicios` quedarán operativas con seguridad RLS activada.

## 🛡️ Auditoría y Blindaje de Seguridad (Test de Seguridad)

Se realizó un análisis defensivo integral sobre la aplicación y el endpoint de API. A continuación se detallan las protecciones implementadas y probadas con éxito:

### 1. Cabeceras HTTP de Seguridad ([next.config.js](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/next.config.js))
- **`X-Frame-Options: DENY`**: Bloquea la incrustación del sitio en iframes de terceros, previniendo ataques de Clickjacking.
- **`X-Content-Type-Options: nosniff`**: Impide que los navegadores interpreten archivos con tipos MIME incorrectos (MIME sniffing).
- **`Strict-Transport-Security (HSTS)`**: Fuerza el uso exclusivo de conexiones HTTPS cifradas (`max-age=63072000; includeSubDomains; preload`).
- **`Referrer-Policy: strict-origin-when-cross-origin`**: Protege la privacidad evitando la fuga de URLs internas en enlaces salientes.
- **`Permissions-Policy`**: Deshabilita accesos innecesarios a hardware sensible (`camera=(), microphone=(), geolocation=()`).
- **`Content-Security-Policy (CSP)`**: Restringe la carga de scripts, fuentes y estilos a orígenes de confianza (Google Fonts, cdnjs, jsdelivr, Supabase).
- **`poweredByHeader: false`**: Oculta el banner `X-Powered-By: Next.js` para evitar el fingerprinting del stack técnico.

### 2. Blindaje de la API de Contacto ([src/app/api/contact/route.ts](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/app/api/contact/route.ts))
- **Limitador de Tasa por IP (Rate Limiter)**: Permite un máximo de **5 solicitudes por minuto por IP**. A la 6ª solicitud devuelve status `429 Too Many Requests`, protegiendo la base de datos contra ataques DoS y flooding de bots.
- **Sanitización de Entradas**: Eliminación automática de etiquetas HTML (`<script>`, etc.) y caracteres de control para mitigar inyecciones XSS y ataques de payload malicioso.
- **Límites de Longitud Estrictos**:
  - `nombre`: 2 - 100 caracteres.
  - `email`: Máximo 120 caracteres validado contra RFC regex.
  - `servicio`: Validación estricta contra whitelist permitida.
  - `mensaje`: 5 - 2000 caracteres.
- **Aislamiento de Secretos**: `SUPABASE_SERVICE_ROLE_KEY` reside exclusivamente en el entorno del servidor y nunca se expone al cliente.

---

## 👥 Módulo de Clientes y Pop-up de Casos ([src/components/Stats.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/Stats.tsx))

El bloque de estadísticas inferior (`+10 Proyectos completados`, etc.) fue rediseñado como una barra flotante en píldora idéntica al diseño de referencia e integrado con un sistema interactivo de proyectos:
- **Clientes destacados disponibles**:
  1. **On Fleek**: Sistema de agendamiento y reserva de citas 24/7 con recordatorios por WhatsApp.
  2. **Restaurante La Finca**: Automatización de comandas táctiles POS e inventario en cocina en tiempo real.
  3. **Aura Store**: Tienda online de alta conversión con checkout móvil y pagos seguros.
  4. **Logística Express**: Plataforma de tracking en tiempo real con geolocalización de mensajeros.
- **Interacción**: Al hacer clic en "+10 Proyectos" o en cualquiera de las píldoras de clientes, se abre un **Modal Popup** con diseño glassmorphism que detalla:
  - Ficha del proyecto con tags de categoría.
  - Descripción completa del problema resuelto y la solución creada.
  - Métricas de impacto cuantificables (ej. *85% reducción de citas perdidas*).
  - Lista de funcionalidades implementadas con checkmarks.
  - Tecnologías utilizadas y botón directo para solicitar una cotización similar.

---

## 📌 Backlog Activo y Tareas Pendientes (Roadmap)

Este apartado contiene las tareas en curso, pendientes de configuración externa o mejoras planificadas para las siguientes fases:

### Fase 1: Despliegue y Conexión en Vivo (Prioridad Inmediata)
- [ ] **Configurar llaves de Supabase en `.env.local`**: El usuario debe vincular su cuenta y proyecto real de Supabase siguiendo [supabase/SETUP.md](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/supabase/SETUP.md).
- [ ] **Vincular enlace real de Calendly**: Reemplazar `https://calendly.com` en [Contact.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/Contact.tsx) por la URL del calendario oficial de Saikora.
- [ ] **Actualizar canales de contacto definitivos**: Confirmar teléfono oficial de WhatsApp y correo de soporte en [Contact.tsx](file:///c:/Users/santi/OneDrive/Desktop/Saikora%20Pagina/src/components/Contact.tsx).
- [ ] **Despliegue a producción (Vercel / Netlify / Host propio)**:
  - Configurar las 3 variables de entorno de Supabase en el panel de hosting.
  - Apuntar el dominio personalizado (ej. `saikora.com`) mediante registros DNS A / CNAME.

### Fase 2: Automatizaciones y Notificaciones
- [ ] **Notificaciones por Correo Electrónico**: Implementar webhook o integración con Resend / SendGrid para enviar una alerta instantánea al equipo de Saikora cada vez que un lead completa el formulario de cotización.
- [ ] **Auto-respuesta al cliente**: Enviar un email de confirmación automático al prospecto asegurando que su mensaje fue recibido.
- [ ] **Integración con WhatsApp Business API / Webhook**: Botón directo para iniciar conversación con mensaje prellenado desde el sitio.

### Fase 3: Mejoras de Contenido y Expansión
- [ ] **Páginas de Detalle para Casos de Éxito**: Rutas dinámicas `/proyectos/[id]` con capturas detalladas del sistema de Restaurante La Finca, métricas y testimonios de clientes.
- [ ] **Panel de Administración Interno (CMS)**: Interfaz protegida para consultar solicitudes recibidas desde Supabase y gestionar el estado (`pendiente`, `revisado`, `respondido`).
- [ ] **Soporte Multilenguaje (i18n)**: Soporte para alternar entre Español e Inglés para clientes internacionales.
- [ ] **Google Analytics 4 / Meta Pixel**: Inserción de scripts de seguimiento de conversiones para campañas de marketing digital.

---

> *Para actualizar este handoff conforme se completen tareas o se añadan nuevos requerimientos, simplemente edita este archivo marcando las casillas `[x]` o agregando nuevas secciones según corresponda.*
