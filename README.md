# Saikora - Soluciones Tecnológicas

Sitio web oficial de Saikora, desarrollado con Next.js, Bootstrap y Supabase.

## 🚀 Tecnologías

- **Next.js 15** - Framework React para producción
- **TypeScript** - Tipado estático
- **Bootstrap 5** - Responsive design
- **Supabase** - Backend como servicio (BaaS)
- **CSS Custom** - Estilos personalizados

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página de inicio
│   ├── globals.css         # Estilos globales
│   └── api/
│       └── contact/
│           └── route.ts    # API endpoint de contacto
├── components/
│   ├── Navbar.tsx          # Navegación
│   ├── Hero.tsx            # Sección hero
│   ├── Services.tsx        # Sección servicios
│   ├── Stats.tsx           # Estadísticas
│   ├── Cases.tsx           # Casos de éxito
│   ├── Contact.tsx         # Formulario de contacto
│   └── Footer.tsx          # Pie de página
├── lib/
│   └── supabase.ts         # Cliente Supabase
└── types/
    └── index.ts            # Tipos TypeScript
```

## ⚙️ Configuración

1. Copia `.env.local.example` a `.env.local`
2. Agrega tus credenciales de Supabase
3. Ejecuta `npm run dev`

## 🛠️ Comandos

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Iniciar en producción
npm run lint     # Verificar código
```

## 🔗 Supabase Setup

Ver archivo `supabase/schema.sql` para la estructura de la base de datos y `supabase/SETUP.md` para las instrucciones paso a paso.

## 📋 Handoff y Documentación Técnica

Para conocer el detalle del funcionamiento de cada componente, tokens de diseño y la lista de tareas pendientes en constante actualización, consulta [HANDOFF.md](./HANDOFF.md).

