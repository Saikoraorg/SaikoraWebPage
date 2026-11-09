-- ============================================================
-- SAIKORA — Arquitectura de Base de Datos Integral
-- Roles: Data Analyst & Web Management
-- Motor: PostgreSQL / Supabase
-- ============================================================

-- Habilitar extensión para UUIDs criptográficos
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. TABLA: CONTACTOS / LEADS (Prospectos de Cotización)
-- Propósito: Captura y ciclo de vida de prospectos del formulario web
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contactos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Datos ingresados por el prospecto (Formulario Web)
  nombre TEXT NOT NULL CHECK (char_length(trim(nombre)) >= 2),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  telefono TEXT,
  servicio TEXT NOT NULL CHECK (
    servicio IN (
      'desarrollo-web',
      'automatizacion',
      'sistema-medida',
      'ecommerce',
      'consultoria',
      'otro'
    )
  ),
  mensaje TEXT NOT NULL CHECK (char_length(trim(mensaje)) >= 5),

  -- Gestión Web & CRM (Web Management)
  estado TEXT DEFAULT 'nuevo' CHECK (
    estado IN (
      'nuevo',
      'en_revision',
      'contactado',
      'en_cotizacion',
      'ganado',
      'perdido',
      'descartado',
      'spam'
    )
  ),
  prioridad TEXT DEFAULT 'media' CHECK (
    prioridad IN ('baja', 'media', 'alta', 'urgente')
  ),
  presupuesto_estimado TEXT,
  notas_internas TEXT,
  asignado_a TEXT,

  -- Atribución y Métricas (Data Analyst)
  origen TEXT DEFAULT 'formulario_web',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  dispositivo TEXT,
  ip_address TEXT,

  -- Marcas temporales de trazabilidad
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  contacted_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 2. TABLA: REUNIONES (Llamadas de Descubrimiento / Calendario)
-- Propósito: Almacena las citas agendadas desde el modal interactivo
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reuniones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Vinculación opcional con la tabla de contactos (Relación 1:N)
  contacto_id UUID REFERENCES public.contactos(id) ON DELETE SET NULL,

  -- Datos del cliente para la reunión
  nombre TEXT NOT NULL CHECK (char_length(trim(nombre)) >= 2),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  telefono TEXT,

  -- Coordinación de la llamada
  fecha_reunion DATE NOT NULL,
  hora_reunion TEXT NOT NULL,
  medio TEXT NOT NULL CHECK (
    medio IN ('Google Meet', 'Microsoft Teams', 'Zoom', 'WhatsApp', 'Llamada Telefónica', 'Presencial')
  ),
  tema TEXT,

  -- Gestión Operativa (Web Management)
  estado TEXT DEFAULT 'agendada' CHECK (
    estado IN (
      'agendada',
      'confirmada',
      'reprogramada',
      'completada',
      'cancelada',
      'no_show'
    )
  ),
  link_reunion TEXT,
  resultado_reunion TEXT,

  -- Datos Analíticos
  duracion_minutos INT DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 3. TABLA: SERVICIOS (Catálogo Central de Soluciones)
-- Propósito: Administración dinámica de las soluciones tecnológicas
-- ============================================================
CREATE TABLE IF NOT EXISTS public.servicios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  icono TEXT NOT NULL,
  icono_bg TEXT DEFAULT '#EEF2FF',
  color_acento TEXT DEFAULT '#19C3A0',
  tags TEXT[] DEFAULT '{}',
  activo BOOLEAN DEFAULT true NOT NULL,
  orden INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 4. TABLA: PROYECTOS / CASOS DE ÉXITO (Portafolio Dinámico)
-- Propósito: Exposición de clientes, métricas reales y tecnologías
-- ============================================================
CREATE TABLE IF NOT EXISTS public.proyectos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  cliente TEXT NOT NULL,
  categoria TEXT NOT NULL,
  titulo_proyecto TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  resultado_valor TEXT NOT NULL,
  resultado_label TEXT NOT NULL,
  icono TEXT DEFAULT 'fa-solid fa-rocket',
  color_acento TEXT DEFAULT '#19C3A0',
  caracteristicas TEXT[] DEFAULT '{}',
  tecnologias TEXT[] DEFAULT '{}',
  destacado BOOLEAN DEFAULT false NOT NULL,
  activo BOOLEAN DEFAULT true NOT NULL,
  orden INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 5. TABLA: EVENTOS ANALÍTICOS (Conversion & Funnel Tracking)
-- Propósito: Trazabilidad del embudo de conversión sin cookies invasivas
-- ============================================================
CREATE TABLE IF NOT EXISTS public.eventos_analitica (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_evento TEXT NOT NULL,      -- 'click_cta_hero', 'abrir_modal_reunion', 'envio_contacto'
  seccion TEXT NOT NULL,          -- 'hero', 'servicios', 'stats', 'contacto'
  metadata JSONB DEFAULT '{}'::jsonb,
  dispositivo TEXT,               -- 'mobile', 'desktop', 'tablet'
  ip_hash TEXT,                   -- Hash anónimo unidireccional para privacidad
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 6. ÍNDICES DE RENDIMIENTO (Performance & Queries)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_contactos_email ON public.contactos(email);
CREATE INDEX IF NOT EXISTS idx_contactos_estado ON public.contactos(estado);
CREATE INDEX IF NOT EXISTS idx_contactos_servicio ON public.contactos(servicio);
CREATE INDEX IF NOT EXISTS idx_contactos_created_at ON public.contactos(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reuniones_fecha ON public.reuniones(fecha_reunion, hora_reunion);
CREATE INDEX IF NOT EXISTS idx_reuniones_estado ON public.reuniones(estado);
CREATE INDEX IF NOT EXISTS idx_reuniones_email ON public.reuniones(email);

CREATE INDEX IF NOT EXISTS idx_eventos_tipo_fecha ON public.eventos_analitica(tipo_evento, created_at DESC);

-- ============================================================
-- 7. TRIGGERS: AUTOMATIZACIÓN DE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_contactos_updated_at ON public.contactos;
CREATE TRIGGER tr_contactos_updated_at
  BEFORE UPDATE ON public.contactos
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_reuniones_updated_at ON public.reuniones;
CREATE TRIGGER tr_reuniones_updated_at
  BEFORE UPDATE ON public.reuniones
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_servicios_updated_at ON public.servicios;
CREATE TRIGGER tr_servicios_updated_at
  BEFORE UPDATE ON public.servicios
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_proyectos_updated_at ON public.proyectos;
CREATE TRIGGER tr_proyectos_updated_at
  BEFORE UPDATE ON public.proyectos
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================================
-- 8. SEGURIDAD: ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reuniones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_analitica ENABLE ROW LEVEL SECURITY;

-- Políticas para CONTACTOS
CREATE POLICY "Permitir inserción pública de cotizaciones"
  ON public.contactos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Solo equipo autenticado lee cotizaciones"
  ON public.contactos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Solo equipo autenticado actualiza cotizaciones"
  ON public.contactos FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Políticas para REUNIONES
CREATE POLICY "Permitir inserción pública de reuniones"
  ON public.reuniones FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Solo equipo autenticado lee reuniones"
  ON public.reuniones FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Solo equipo autenticado actualiza reuniones"
  ON public.reuniones FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Políticas para SERVICIOS y PROYECTOS (Lectura pública, edición autenticada)
CREATE POLICY "Lectura pública de servicios activos"
  ON public.servicios FOR SELECT
  USING (activo = true);

CREATE POLICY "Gestión de servicios para autenticados"
  ON public.servicios FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Lectura pública de proyectos activos"
  ON public.proyectos FOR SELECT
  USING (activo = true);

CREATE POLICY "Gestión de proyectos para autenticados"
  ON public.proyectos FOR ALL
  USING (auth.role() = 'authenticated');

-- Políticas para EVENTOS ANALÍTICOS
CREATE POLICY "Permitir inserción pública de eventos analíticos"
  ON public.eventos_analitica FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Solo equipo autenticado consulta analítica"
  ON public.eventos_analitica FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- 9. VISTAS ANALÍTICAS (SQL Views para Dashboards & BI)
-- ============================================================

-- Vista 1: Resumen de Demanda por Servicio (Data Analyst KPI)
CREATE OR REPLACE VIEW public.v_analisis_servicios AS
SELECT 
  servicio,
  COUNT(*) AS total_solicitudes,
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 1) AS porcentaje_demanda,
  COUNT(CASE WHEN estado IN ('ganado', 'en_cotizacion') THEN 1 END) AS leads_calificados,
  MIN(created_at) AS primer_contacto,
  MAX(created_at) AS ultimo_contacto
FROM public.contactos
GROUP BY servicio
ORDER BY total_solicitudes DESC;

-- Vista 2: Embudo de Reuniones & Efectividad (Conversion Funnel)
CREATE OR REPLACE VIEW public.v_analisis_reuniones AS
SELECT 
  medio AS plataforma,
  COUNT(*) AS total_agendadas,
  COUNT(CASE WHEN estado = 'completada' THEN 1 END) AS completadas,
  COUNT(CASE WHEN estado = 'no_show' THEN 1 END) AS ausencias,
  COUNT(CASE WHEN estado = 'cancelada' THEN 1 END) AS canceladas,
  ROUND(
    COUNT(CASE WHEN estado = 'completada' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 1
  ) AS tasa_asistencia_pct
FROM public.reuniones
GROUP BY medio
ORDER BY total_agendadas DESC;

-- Vista 3: Bandeja Operativa de Seguimiento Inmediato (Web Management)
CREATE OR REPLACE VIEW public.v_leads_pendientes AS
SELECT 
  id,
  nombre,
  email,
  telefono,
  servicio,
  mensaje,
  estado,
  prioridad,
  created_at,
  ROUND(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600.0, 1) AS horas_desde_ingreso
FROM public.contactos
WHERE estado IN ('nuevo', 'en_revision')
ORDER BY 
  CASE prioridad 
    WHEN 'urgente' THEN 1 
    WHEN 'alta' THEN 2 
    WHEN 'media' THEN 3 
    ELSE 4 
  END,
  created_at ASC;

-- Vista 4: Agenda de los Próximos 7 Días (Web Management)
CREATE OR REPLACE VIEW public.v_proximas_reuniones AS
SELECT 
  r.id,
  r.fecha_reunion,
  r.hora_reunion,
  r.nombre AS cliente,
  r.email,
  r.telefono,
  r.medio,
  r.estado,
  r.link_reunion,
  r.tema
FROM public.reuniones r
WHERE r.fecha_reunion >= CURRENT_DATE 
  AND r.fecha_reunion <= CURRENT_DATE + INTERVAL '7 days'
  AND r.estado IN ('agendada', 'confirmada')
ORDER BY r.fecha_reunion ASC, r.hora_reunion ASC;

-- ============================================================
-- 10. POBLACIÓN DE DATOS MAESTROS INICIALES (Seed Data)
-- ============================================================

-- Servicios oficiales de Saikora
INSERT INTO public.servicios (slug, titulo, descripcion, icono, icono_bg, color_acento, tags, orden)
VALUES
  ('desarrollo-web', 'Desarrollo Web', 'Sitios web modernos, rápidos y personalizados para tu marca con tecnología de vanguardia.', 'fa-solid fa-code', '#1A1E29', '#5C6CFF', ARRAY['Next.js', 'React', 'Tailored UI'], 1),
  ('automatizacion', 'Automatización', 'Optimiza tus procesos con soluciones inteligentes, escalables y conectadas a tus herramientas.', 'fa-solid fa-gear', '#E6FAF6', '#19C3A0', ARRAY['WhatsApp API', 'n8n', 'AI Flows'], 2),
  ('sistema-medida', 'Sistemas a Medida', 'Aplicaciones y plataformas adaptadas exactamente a tus necesidades operativas.', 'fa-solid fa-cloud', '#EEF2FF', '#4C5BFF', ARRAY['CRM', 'Dashboard', 'API Custom'], 3),
  ('ecommerce', 'E-Commerce', 'Tiendas en línea de alta conversión con pasarela de pagos, inventario y logística integrados.', 'fa-solid fa-cart-shopping', '#FFF0F6', '#e040a0', ARRAY['Stripe', 'Supabase', 'SEO'], 4),
  ('analytics', 'Analytics & Data', 'Paneles de control en tiempo real para tomar decisiones basadas en datos precisos.', 'fa-solid fa-chart-line', '#FFF8E1', '#f59e0b', ARRAY['Dashboards', 'KPIs', 'Reportes'], 5),
  ('crm', 'CRM & Clientes', 'Gestiona tu base de clientes, seguimientos y ventas desde un solo lugar.', 'fa-solid fa-users', '#F3E8FF', '#9333ea', ARRAY['Pipeline', 'Follow-up', 'Reportes'], 6)
ON CONFLICT (slug) DO UPDATE 
SET 
  titulo = EXCLUDED.titulo,
  descripcion = EXCLUDED.descripcion,
  tags = EXCLUDED.tags;

-- Casos de éxito destacados de clientes
INSERT INTO public.proyectos (slug, cliente, categoria, titulo_proyecto, descripcion, resultado_valor, resultado_label, icono, color_acento, caracteristicas, tecnologias, destacado, orden)
VALUES
  (
    'on-fleek',
    'On Fleek',
    'Salud, Estilo & Belleza',
    'Sistema de Agendamiento y Control de Citas 24/7',
    'Desarrollamos una plataforma digital integral de reservas para On Fleek, permitiendo a los clientes agendar citas en línea en tiempo real eligiendo su especialista, servicio y horario disponible.',
    '85%',
    'menos citas perdidas',
    'fa-solid fa-calendar-check',
    '#19C3A0',
    ARRAY['Reserva de citas 24/7 sin llamadas', 'Recordatorios automáticos por WhatsApp y correo', 'Panel de métricas de ocupación e ingresos en tiempo real', 'Sincronización para calendarización'],
    ARRAY['Next.js', 'Supabase', 'WhatsApp API', 'CSS Custom'],
    true,
    1
  ),
  (
    'estudio-nicole-valerio',
    'Estudio Fotográfico Nicole Valerio',
    'Fotografía & Creativos',
    'Página Web para Estudio Fotográfico Profesional',
    'Diseñamos y desarrollamos un sitio web elegante y veloz para un estudio fotográfico profesional, con galería dinámica de portafolio, sistema de reserva de sesiones y formulario inteligente.',
    '+60%',
    'en reservas online',
    'fa-solid fa-camera',
    '#4C5BFF',
    ARRAY['Galería de portafolio con categorías y lightbox', 'Sistema de reserva de sesiones fotográficas en línea', 'Integración con Instagram para mostrar publicaciones', 'Confirmación automática al cliente'],
    ARRAY['Next.js', 'Framer Motion', 'Instagram API', 'Vercel'],
    true,
    2
  ),
  (
    'restaurante-la-finca',
    'Restaurante La Finca',
    'Gastronomía & Restauración',
    'Automatización de Pedidos y Control de Inventario',
    'Implementación de comandas táctiles digitales (POS) para meseros y pantalla en cocina en tiempo real, conectado a la gestión de inventario automatizada que descuenta insumos con cada orden.',
    '60%',
    'menos tiempo en pedidos',
    'fa-solid fa-utensils',
    '#19C3A0',
    ARRAY['Comandas digitales instantáneas a cocina', 'Descuento automático de stock de ingredientes', 'Alertas de inventario bajo', 'Cierre de caja y facturación en 1 clic'],
    ARRAY['Next.js', 'PostgreSQL / Supabase', 'WebSockets', 'PWA Táctil'],
    false,
    3
  ),
  (
    'logistica-express',
    'Logística Express',
    'Transporte & Envíos',
    'Plataforma de Tracking y Despacho en Tiempo Real',
    'Sistema web centralizado para asignación inteligente de rutas de mensajería, lectura de códigos QR en bodegas y enlace de seguimiento en vivo por GPS para clientes finales.',
    '70%',
    'menos reclamos de rastreo',
    'fa-solid fa-truck-fast',
    '#4C5BFF',
    ARRAY['Enlace de seguimiento en vivo por mapa', 'Asignación inteligente de rutas para optimizar combustible', 'Firma digital y fotografía como comprobante de entrega', 'Dashboard gerencial de tiempos de entrega'],
    ARRAY['Next.js', 'Mapbox', 'Supabase Realtime', 'React Native'],
    false,
    4
  )
ON CONFLICT (slug) DO UPDATE 
SET 
  titulo_proyecto = EXCLUDED.titulo_proyecto,
  descripcion = EXCLUDED.descripcion,
  resultado_valor = EXCLUDED.resultado_valor;

-- ============================================================
-- 11. HABILITAR TIEMPO REAL (Supabase Realtime para Dashboard Admin)
-- ============================================================
-- Habilita réplica de eventos en tiempo real para las tablas operativas
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contactos;
  EXCEPTION WHEN duplicate_object THEN
    -- Ya existe en la publicación
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reuniones;
  EXCEPTION WHEN duplicate_object THEN
    -- Ya existe en la publicación
  END;
END $$;

