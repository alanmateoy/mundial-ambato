# Instrucciones para Ejecutar Mundial Ambato 2026 en Local

## Estado Actual
✅ Proyecto Next.js + Supabase creado y compilado
✅ Módulos completados:
   - Autenticación (registro gratis con correo)
   - Catálogo de 48 selecciones del Mundial 2026
   - Inventario personal de cromos
   - Sistema de intercambios en Ambato (módulo principal)
   - Interfaz con tema mundialista

## Pasos para Ejecutar Localmente

### 1. Iniciar el servidor de desarrollo
Abre una terminal (PowerShell) y ejecuta:
```powershell
cd C:\proyectos\mundial-ambato
npm run dev
```

Deberías ver:
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
✓ Ready in 2.6s
```

### 2. Abrir en el navegador
Visita: **http://localhost:3000**

### 3. Configurar Supabase (Requerido para funcionalidad completa)

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a "SQL Editor" y ejecuta el contenido de `supabase-schema.sql`
4. Ve a "Project Settings" > "API" y copia:
   - URL del proyecto (anónimo)
   - clave anón (anon/public)
5. Edita el archivo `.env.local` con tus credenciales:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```
6. Reinicia el servidor (Ctrl+C y luego `npm run dev`)

### 4. Cargar datos iniciales (Opcional)
Puedes cargar las selecciones y jugadores desde:
- `data/selecciones.json` (48 selecciones)
- `data/jugadores.json` (120+ jugadores titulares)

## Funcionalidades Disponibles

1. **Página Principal** (`/`): Menú principal con acceso a todos los módulos
2. **Login** (`/login`): Registro y acceso con correo
3. **Catálogo** (`/catalogo`): 48 selecciones con filtro por confederación
4. **Mis Cromos** (`/mis-cromos`): Registra obtenidos y repetidos
5. **Intercambios** (`/intercambios`): Publica ofertas y encuentra personas en Ambato
6. **Perfil** (`/perfil`): Configura WhatsApp para contacto

## Próximos Pasos Sugeridos

1. **Configurar Supabase** para tener base de datos real
2. **Cargar datos completos** de jugadores (investigación 95% similitud)
3. **Agregar imágenes** de jugadores y equipos (usar URLs de Supabase Storage)
4. **Desplegar en Vercel** para acceso público

## Estructura del Proyecto
```
C:\proyectos\mundial-ambato\
├── app\                    # Páginas de la aplicación
│   ├── login\page.tsx      # Autenticación
│   ├── catalogo\page.tsx    # Catálogo de selecciones
│   ├── mis-cromos\page.tsx  # Inventario personal
│   ├── intercambios\page.tsx # Sistema de intercambios
│   └── perfil\page.tsx     # Perfil de usuario
├── components\Navbar.tsx    # Barra de navegación
├── lib\supabase.ts        # Cliente de Supabase
├── data\                   # Datos JSON (selecciones, jugadores)
├── supabase-schema.sql     # Esquema de base de datos
└── README.md              # Documentación
```

¡La app está lista para usarse en local!
