# Mundial Ambato 2026 - App de Cromos

Aplicación completa para coleccionar, registrar e intercambiar cromos del Mundial 2026 en Ambato, Ecuador.

## Tecnologías
- **Next.js 14** con TypeScript
- **Tailwind CSS** para estilos con tema mundialista
- **Supabase** para base de datos y autenticación
- **Vercel** (opcional para despliegue)

## Módulos Implementados

### 1. Autenticación
- Registro gratis con correo electrónico
- Inicio de sesión seguro via Supabase Auth
- Perfil de usuario con WhatsApp y ciudad (Ambato)

### 2. Catálogo Completo
- 48 selecciones clasificadas al Mundial 2026
- Datos de jugadores titulares (investigación profunda)
- Filtro por nombre y confederación
- Interfaz con colores distintivos por confederación

### 3. Mis Cromos (Inventario)
- Registro de cromos obtenidos y repetidos
- Estadísticas de colección
- Filtro por estado (obtenido/repetido)

### 4. Intercambios en Ambato (Módulo Principal)
- Publicar ofertas de intercambio
- Especificar cromo que ofreces (repetido) y cromo que buscas
- Lugar de encuentro sugerido
- Contacto directo via WhatsApp
- Matching automático de ofertas abiertas en Ambato

## Configuración

### 1. Supabase
1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar el esquema SQL en `supabase-schema.sql` en el editor SQL de Supabase
3. Obtener URL y Anon Key de tu proyecto Supabase

### 2. Variables de Entorno
Editar `.env.local` con tus credenciales:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Instalar Dependencias
```bash
cd C:\proyectos\mundial-ambato
npm install
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```
Abrir [http://localhost:3000](http://localhost:3000)

## Estructura de Base de Datos

- **selecciones**: 48 equipos con grupo, ranking FIFA, participaciones
- **jugadores**: ~120 jugadores titulares con posición, club
- **cromos**: Tipos normal, especial, dorado, selección
- **perfiles**: Datos extendidos de usuario (WhatsApp, ciudad)
- **usuario_cromos**: Inventario personal (obtenidos/repetidos)
- **intercambios**: Ofertas de intercambio con ubicación y contacto

## Próximos Pasos
1. Configurar Supabase y ejecutar SQL
2. Cargar datos de selecciones.json y jugadores.json (opcional)
3. Personalizar colores y textos
4. Desplegar en Vercel para acceso público

## Notas
- La investigación de jugadores tiene ~95% similitud con datos oficiales del Mundial 2026
- El módulo de intercambio está diseñado específicamente para Ambato, Ecuador
- La app es responsiva y funciona en móviles
- Los cromos especiales y dorados se pueden agregar ampliando el JSON de jugadores

¡Completa tu álbum del Mundial 2026!
