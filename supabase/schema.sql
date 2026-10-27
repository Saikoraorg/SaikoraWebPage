-- ============================================================
-- SAIKORA - Schema Supabase
-- Ejecuta este SQL en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- Tabla de contactos / cotizaciones
CREATE TABLE IF NOT EXISTS public.contactos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  servicio TEXT,
  mensaje TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'revisado', 'respondido')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de proyectos (casos de éxito)
CREATE TABLE IF NOT EXISTS public.proyectos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  categoria TEXT,
  resultado TEXT,
  resultado_valor TEXT,
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  orden INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS public.servicios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  icono TEXT,
  activo BOOLEAN DEFAULT true,
  orden INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE public.contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;

-- Políticas: cualquiera puede insertar contactos (formulario público)
CREATE POLICY "Insertar contacto público" ON public.contactos
  FOR INSERT WITH CHECK (true);

-- Solo usuarios autenticados pueden leer contactos
CREATE POLICY "Leer contactos autenticado" ON public.contactos
  FOR SELECT USING (auth.role() = 'authenticated');

-- Proyectos y servicios son públicos para lectura
CREATE POLICY "Leer proyectos público" ON public.proyectos
  FOR SELECT USING (activo = true);

CREATE POLICY "Leer servicios público" ON public.servicios
  FOR SELECT USING (activo = true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contactos_updated_at
  BEFORE UPDATE ON public.contactos
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Datos de ejemplo para proyectos
INSERT INTO public.proyectos (titulo, descripcion, categoria, resultado, resultado_valor, orden) VALUES
('Automatización de pedidos y control de inventario', 'Implementamos un sistema a medida que optimizó la gestión de ventas y redujo el tiempo en pedidos en un 60%.', 'Restaurante La Finca', '60%', 'en tiempo de pedidos', 1),
('Sitio web y tienda en línea', 'Desarrollamos una plataforma moderna y segura que incrementó sus ventas en un 45% en los primeros 3 meses.', 'Tienda Online', '45%', 'en ventas', 2);

-- Datos de ejemplo para servicios
INSERT INTO public.servicios (titulo, descripcion, icono, orden) VALUES
('Desarrollo Web', 'Sitios web modernos, rápidos y personalizados para tu marca.', 'code', 1),
('Automatización', 'Optimiza tus procesos con soluciones inteligentes y escalables.', 'settings', 2),
('Sistemas a Medida', 'Aplicaciones y plataformas adaptadas a tus necesidades.', 'cloud', 3);
