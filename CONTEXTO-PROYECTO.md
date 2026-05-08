# 🏆 CONTEXTO COMPLETO DEL PROYECTO - MUNDIAL AMBATO 2026

> **Este archivo contiene TODO el contexto necesario para continuar el desarrollo.**
> **Úsalo como referencia en Claude Code o cualquier otra herramienta de IA.**

---

## 📋 DESCRIPCIÓN DEL PROYECTO

**Mundial Ambato 2026** es una plataforma web de colección e intercambio de cromos (stickers) del álbum Panini FIFA World Cup 2026, orientada a la comunidad de coleccionistas de la ciudad de **Ambato, Ecuador**.

### ¿Qué hace la app?
- Permite a los usuarios registrarse y mantener un perfil de coleccionista
- Muestra un catálogo completo de **980 cromos** organizados como en el álbum Panini real
- Los usuarios pueden registrar qué cromos tienen (obtenidos) y cuáles les salieron repetidos
- Los cromos repetidos se pueden publicar para intercambio con otros usuarios cercanos
- Integración con WhatsApp para contactar a otros coleccionistas
- Diseño responsive optimizado para uso móvil (la gente lo usa en la calle mientras compra cromos)

### ¿Qué NO hace todavía?
- **La base de datos no está cargada** — los archivos SQL están listos pero NO se han ejecutado en Supabase aún
- **El catálogo lee de un JSON local** (`/data/selecciones.json`) en vez de Supabase — no carga jugadores ni cromos reales
- **La página del álbum** (`/album`) es un placeholder que dice "en construcción"
- **No tiene diseño profesional** — la UI actual es funcional pero básica, necesita rediseño completo
- **No tiene mapa de intercambios** — los intercambios no muestran ubicación en mapa
- **No hay detección automática de repetidos** — el usuario debe marcar manualmente
- **No hay sistema de notificaciones** — cuando alguien quiere tu cromo, no te avisa

---

## 🏗️ STACK TECNOLÓGICO

| Tecnología | Versión | Uso |
|---|---|---|
| **Next.js** | 14.2.x | Framework React (App Router) |
| **React** | 18.2.x | UI |
| **TypeScript** | 5.4.x | Tipado |
| **TailwindCSS** | 3.4.x | Estilos |
| **Supabase** | 2.105.x | Base de datos + Auth + Storage |
| **@supabase/auth-helpers-nextjs** | 0.9.x | Helper de autenticación |
| **@supabase/ssr** | 0.10.x | Server-side rendering con Supabase |

---

## 📁 ESTRUCTURA DEL PROYECTO

```
c:\proyectos\mundial-ambato\
├── app/                          # Páginas (Next.js App Router)
│   ├── layout.tsx                # Layout principal (incluye Navbar)
│   ├── page.tsx                  # Home — Dashboard principal (requiere login)
│   ├── globals.css               # Estilos globales + clases Tailwind custom
│   ├── login/page.tsx            # Login y registro (Supabase Auth)
│   ├── catalogo/page.tsx         # ⚠️ Lee de JSON, no de Supabase
│   ├── album/page.tsx            # ⚠️ Placeholder "en construcción"
│   ├── mis-cromos/page.tsx       # Inventario personal del usuario
│   ├── intercambios/page.tsx     # Publicar y ver ofertas de intercambio
│   └── perfil/page.tsx           # Editar perfil + cerrar sesión
├── components/
│   └── Navbar.tsx                # Barra de navegación superior
├── lib/
│   └── supabase.ts               # Cliente Supabase (configurado)
├── data/
│   ├── selecciones.json          # ⚠️ JSON local de equipos (temporal)
│   └── jugadores.json            # ⚠️ JSON local de jugadores (temporal)
├── public/                       # Archivos estáticos
│                                 
│ --- ARCHIVOS SQL (para cargar en Supabase) ---
├── supabase-schema-final.sql     # ✅ Schema definitivo
├── supabase-data-final.sql       # ✅ 48 selecciones + 20 cromos (intro+museo)
├── supabase-jugadores-completo.sql # ✅ Jugadores equipos 1-5 (verificados)
├── supabase-complete.sql         # ✅ Jugadores equipos 1-21
├── supabase-complete-part2.sql   # ✅ Jugadores equipos 22-32
├── supabase-complete-part3.sql   # ✅ Jugadores equipos 33-48
├── supabase-generar-960-equipos.sql # ✅ Genera 960 cromos de equipos
├── GUIA-EJECUCION.md             # Pasos para cargar la BD
│                                 
│ --- CONFIG ---
├── .env.local                    # Variables de entorno (Supabase URL + Key)
├── .env.local.example            # Ejemplo de variables
├── package.json                  # Dependencias npm
├── tailwind.config.js            # Config Tailwind (colores: mundial-green, mundial-gold)
├── tsconfig.json                 # Config TypeScript
├── next.config.js                # Config Next.js
└── postcss.config.js             # Config PostCSS
```

---

## 🗄️ BASE DE DATOS (SUPABASE)

### Estado actual: ⚠️ SQL listo pero NO ejecutado
Los archivos SQL están listos y verificados. La BD tiene 6 tablas:

### Schema de tablas:

```
selecciones         jugadores           cromos
├── id (PK)         ├── id (PK)         ├── id (PK)
├── nombre          ├── seleccion_id → selecciones(id)
├── confederacion   ├── nombre          ├── numero_cromo (UNIQUE, 1-980)
├── codigo_fifa     ├── apellido        ├── jugador_id → jugadores(id)
├── grupo           ├── numero          ├── seleccion_id → selecciones(id)
├── orden_album     ├── posicion        ├── tipo (normal/escudo/foto_equipo/introduccion/museo_fifa)
├── ranking_fifa    ├── club            ├── descripcion
├── participaciones ├── edad            ├── seccion
├── mejor_resultado ├── es_titular      ├── rareza (1-5)
└── created_at      └── created_at      ├── es_foil
                                        └── created_at

perfiles            usuario_cromos      intercambios
├── id (UUID → auth)├── id (PK)         ├── id (PK)
├── email           ├── usuario_id → perfiles(id)
├── nombre          ├── cromo_id → cromos(id)
├── apellido        ├── estado (obtenido/repetido)
├── ciudad          ├── cantidad        ├── usuario_ofrece_id → perfiles(id)
├── whatsapp        └── fecha_registro  ├── usuario_recibe_id → perfiles(id)
├── avatar_url                          ├── cromo_ofrecido_id → cromos(id)
├── cromos_obtenidos                    ├── cromo_buscado_id → cromos(id)
└── cromos_repetidos                    ├── estado (abierto/en_proceso/completado/cancelado)
                                        ├── ubicacion
                                        ├── notas
                                        └── fecha_encuentro
```

### Distribución de los 980 cromos (verificado con el álbum Panini real):

```
Cromos  1-9:     INTRODUCCIÓN (9 cromos foil)
                 Emblema, Logo Panini, Mascota, Balón, Trofeo, USA, Canadá, México, Mapa

Cromos 10-20:    MUSEO FIFA (11 cromos foil)
                 Campeones: Uruguay 1930, Italia 1934, Brasil 1958, Inglaterra 1966,
                 Brasil 1970, Argentina 1978/1986, Brasil 1994, Francia 1998,
                 España 2010, Argentina 2022

Cromos 21-980:   48 EQUIPOS × 20 cromos cada uno (960 cromos)
                 Cada equipo tiene: 1 escudo (foil) + 1 foto equipo + 18 jugadores

Orden por grupos:
  Grupo A: México(21-40), Sudáfrica(41-60), Corea del Sur(61-80), Rep. Checa(81-100)
  Grupo B: Canadá(101-120), Bosnia(121-140), Catar(141-160), Suiza(161-180)
  Grupo C: Brasil(181-200), Marruecos(201-220), Haití(221-240), Escocia(241-260)
  Grupo D: USA(261-280), Paraguay(281-300), Australia(301-320), Turquía(321-340)
  Grupo E: Alemania(341-360), Curazao(361-380), Costa de Marfil(381-400), Ecuador(401-420)
  Grupo F: P. Bajos(421-440), Japón(441-460), Túnez(461-480), Suecia(481-500)
  Grupo G: Bélgica(501-520), Egipto(521-540), Irán(541-560), N. Zelanda(561-580)
  Grupo H: España(581-600), Cabo Verde(601-620), A. Saudí(621-640), Uruguay(641-660)
  Grupo I: Francia(661-680), Senegal(681-700), Irak(701-720), Noruega(721-740)
  Grupo J: Argentina(741-760), Argelia(761-780), Austria(781-800), Jordania(801-820)
  Grupo K: Portugal(821-840), RD Congo(841-860), Uzbekistán(861-880), Colombia(881-900)
  Grupo L: Inglaterra(901-920), Croacia(921-940), Ghana(941-960), Panamá(961-980)

TOTAL = 9 + 11 + 960 = 980 ✅

NOTA: Los 12 Coca-Cola son promoción separada (NO parte de los 980).
```

### Orden de ejecución SQL en Supabase:

```
1. supabase-schema-final.sql         → Crea tablas, índices, RLS, triggers
2. supabase-data-final.sql           → 48 selecciones + 9 intro + 11 museo = 20 cromos
3. supabase-jugadores-completo.sql   → Jugadores equipos 1-5 (MEX, RSA, KOR, CZE, CAN)
4. supabase-complete.sql             → Jugadores equipos 1-21 (duplicados de 1-5 se ignoran)
5. supabase-complete-part2.sql       → Jugadores equipos 22-32
6. supabase-complete-part3.sql       → Jugadores equipos 33-48
   ⚠️ NO EJECUTAR líneas 485-540 (es un generador de cromos viejo/incorrecto)
7. supabase-generar-960-equipos.sql  → Auto-genera 960 cromos de equipos
```

### Seguridad (RLS ya configurada):
- **selecciones, jugadores, cromos**: Lectura pública (catálogo abierto)
- **perfiles**: Solo el dueño puede ver/editar su perfil
- **usuario_cromos**: Solo el dueño puede CRUD sus cromos
- **intercambios**: Los abiertos son visibles para todos, solo el creador puede editar
- **Trigger automático**: Al registrarse, se crea perfil automáticamente (`handle_new_user`)

### Variables de entorno (.env.local):
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

---

## 🔌 CONEXIÓN SUPABASE (lib/supabase.ts)

El cliente ya está configurado pero lee de `.env.local`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null as any
```

### ⚠️ PROBLEMA ACTUAL CON LA INTEGRACIÓN:
El catálogo (`app/catalogo/page.tsx`) lee datos de un JSON local en vez de Supabase:
```typescript
// ❌ ACTUAL — lee de archivo JSON estático
fetch('/data/selecciones.json')
  .then(res => res.json())
  .then(data => setSelecciones(data))

// ✅ CORRECTO — debería leer de Supabase
const { data } = await supabase
  .from('selecciones')
  .select('*')
  .order('orden_album')
```

Todas las demás páginas (mis-cromos, intercambios, perfil) YA usan Supabase correctamente. Solo el catálogo y el álbum necesitan migración.

---

## 🎯 OBJETIVO FINAL — LO QUE FALTA HACER

### PRIORIDAD 1: Cargar la base de datos
1. Ejecutar los 7 archivos SQL en Supabase (en el orden indicado arriba)
2. Verificar que haya exactamente 980 cromos, 48 selecciones, ~1248 jugadores
3. Migrar `catalogo/page.tsx` para leer de Supabase en vez del JSON local

### PRIORIDAD 2: Integración completa con Supabase
1. **Catálogo**: Debe mostrar los 980 cromos organizados por grupo, con filtros por equipo, posición, tipo
2. **Registrar cromos**: Cuando el usuario escanea o selecciona un cromo:
   - Si es nuevo → se marca como "obtenido"
   - Si ya lo tiene → se marca como "repetido" automáticamente
   - El sistema debe detectar esto solo
3. **Album**: Mostrar el progreso del álbum del usuario (cuántos tiene de 980)
4. **Seguridad**: Configurar bien RLS en Supabase para que nadie pueda hackear los datos

### PRIORIDAD 3: Rediseño UI/UX completo
**El diseño actual es MUY básico y necesita ser reemplazado por uno premium.**

---

## 🎨 VISIÓN DE UI/UX (Para implementar con Claude Design)

### 1. MÓDULO ÁLBUM — Experiencia de pasar páginas reales

**Concepto**: Cada página del álbum muestra la misma disposición que el álbum físico de Panini. Al pasar de página, se debe ver una animación como si estuvieras pasando una página real de un álbum de cromos.

**Estructura de páginas del álbum**:
- **Páginas 1-2**: Portada (introducción, cromos 1-9)
- **Páginas 3-4**: Museo FIFA (cromos 10-20)
- **Páginas 5-6**: México (cromos 21-40) — 10 cromos por página
- **Páginas 7-8**: Sudáfrica (cromos 41-60)
- ... (continúa con cada equipo)
- **Páginas 99-100**: Panamá (cromos 961-980)

**Detalles de la animación**:
- Al hacer swipe o click en la esquina de la página, la página se voltea en 3D como un libro real
- Efecto de sombra mientras la página gira
- Los cromos que el usuario NO tiene se muestran como silueta gris/oscura
- Los cromos que SÍ tiene se muestran en color con brillo
- Los cromos foil (escudos, introducción, museo) deben tener efecto brillante/holográfico

**Navegación lateral izquierda** (sidebar del álbum):
- Menú fijo en la izquierda de la pantalla
- Lista de todos los grupos (A-L)
- Al hacer clic en un grupo, salta directamente a esa página
- Indicador visual de progreso por equipo (ej: "México 12/20")
- Barra de progreso global "450/980 cromos"
- Botón "Página anterior" / "Página siguiente"
- Botón "Ir a mi primer cromo faltante"

### 2. MÓDULO MIS CROMOS — Registro inteligente

**Concepto**: Cuando el usuario abre un sobre de cromos, puede registrarlos rápidamente:
- Ingresa el número del cromo (o busca por nombre)
- El sistema verifica automáticamente:
  - Si NO lo tiene → se registra como "obtenido" (confeti/celebración)
  - Si YA lo tiene → se registra como "repetido" (notificación de "ya lo tienes")
- Contador en tiempo real: "Obtenidos: 450 | Repetidos: 87 | Faltan: 530"

**Panel de repetidos**:
- Los cromos repetidos se muestran aparte con un badge de cantidad
- Botón "Publicar para intercambio" directamente desde el cromo repetido
- Filtros: por equipo, por grupo, por tipo

### 3. MÓDULO INTERCAMBIOS — Mapa social de coleccionistas

**Concepto**: Un mapa interactivo de Ambato que muestra:
- Puntos en el mapa de otros coleccionistas que quieren intercambiar
- Al hacer clic en un punto, ver:
  - Nombre del usuario
  - Qué cromos ofrece (repetidos)
  - Qué cromos busca (faltantes)
  - Botón de WhatsApp para contactar
  - Distancia aproximada

**Match automático**:
- El sistema cruza automáticamente: "Tú tienes repetido el cromo #247 que Juan busca, y Juan tiene repetido el #503 que tú buscas"
- Sección "Matches perfectos" que muestra coincidencias directas
- Notificación push cuando hay un match nuevo
- Filtro por distancia: "Solo mostrar gente a menos de 2km"

**Sistema de reputación**:
- Estrellas por intercambios completados exitosamente
- Badge de "coleccionista verificado" si tiene más de 50% del álbum

### 4. DISEÑO GENERAL

**Paleta de colores actual** (se puede mejorar):
- `mundial-green: #1E7D3B` — Verde principal
- `mundial-gold: #FFD700` — Dorado/amarillo
- `mundial-dark: #1a1a1a` — Negro
- `mundial-light: #f5f5f5` — Gris claro

**Tipografías**:
- `Inter` — Cuerpo de texto
- `Montserrat` — Títulos (font-display)

**Requisitos de diseño**:
- Mobile-first (la gente usa esto en la calle)
- Animaciones suaves pero no pesadas
- Glassmorphism en tarjetas y menús
- Efectos holográficos en cromos especiales
- Dark mode por defecto (es más premium)
- Micro-animaciones en botones y transiciones

---

## ⚙️ CÓMO EJECUTAR EL PROYECTO

```bash
cd c:\proyectos\mundial-ambato
npm install
npm run dev
# Abrir http://localhost:3000
```

### Para hacer build de producción:
```bash
npm run build
npm start
```

---

## 🚀 DEPLOY

### Supabase:
1. Crear proyecto en supabase.com
2. Ir a SQL Editor
3. Ejecutar los 7 archivos SQL en orden (ver sección de BD arriba)
4. Copiar URL y anon key de Settings → API

### Vercel:
1. Push a GitHub: `git push origin main`
2. Ir a vercel.com → Import project
3. Agregar variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

---

## 📝 NOTAS IMPORTANTES PARA EL DESARROLLADOR

1. **El catálogo lee de JSON local** — La línea 21 de `app/catalogo/page.tsx` hace `fetch('/data/selecciones.json')`. Esto debe cambiarse a `supabase.from('selecciones').select('*')`

2. **Los archivos en `/data/`** (selecciones.json, jugadores.json) son temporales y deben eliminarse después de migrar a Supabase

3. **El álbum es un placeholder** — `app/album/page.tsx` solo dice "en construcción". Hay que construir todo desde cero

4. **supabase-complete-part3.sql** tiene un generador de cromos VIEJO en las líneas 485-540 que NO se debe ejecutar (genera 1392 cromos con distribución incorrecta)

5. **La tabla `jugadores` tiene 26 por equipo** pero el generador de cromos solo selecciona 18 (los titulares primero, luego por posición). Los 8 restantes quedan en la BD pero no tienen cromo asignado

6. **RLS está habilitada** — Si ves errores tipo "permission denied" o datos vacíos en el frontend, revisa las políticas RLS en Supabase → Authentication → Policies

7. **El trigger `handle_new_user`** crea automáticamente un perfil cuando alguien se registra. Si el registro funciona pero el perfil no se crea, revisar que el trigger esté activo en Database → Functions

8. **No hay middleware de autenticación** — Cada página verifica el usuario individualmente con `supabase.auth.getUser()`. Idealmente se debería crear un middleware de Next.js para proteger rutas

---

## ❓ RESUMEN EJECUTIVO

**¿Qué es?** App web de álbum de cromos del Mundial 2026 para la comunidad de Ambato, Ecuador.

**¿Qué tiene?** Frontend Next.js + backend Supabase. 6 páginas funcionales. Archivos SQL listos con 980 cromos, 48 equipos, ~1248 jugadores.

**¿Qué falta?**
1. **Ejecutar el SQL en Supabase** (cargar la BD)
2. **Conectar catálogo a Supabase** (ahora lee de JSON)
3. **Construir el álbum virtual** (con páginas que se pasan como un libro)
4. **Rediseñar TODA la UI** (el diseño actual es MVP básico)
5. **Agregar el mapa de intercambios** (geolocalización de coleccionistas)
6. **Sistema inteligente de repetidos** (detección automática)
7. **Deploy a producción** (Vercel + Supabase)
