# 🏆 GUÍA DE EJECUCIÓN - Mundial Ambato 2026

## Base de Datos de 980 Cromos

### ✅ Archivos Creados

| # | Archivo | Descripción | Orden |
|---|---|---|---|
| 1 | `supabase-schema-final.sql` | Schema corregido (tablas, índices, RLS, triggers) | PRIMERO |
| 2 | `supabase-data-final.sql` | 48 selecciones + 9 intro + 11 museo (20 cromos) | SEGUNDO |
| 3 | `supabase-jugadores-completo.sql` | 5 equipos nuevos (MEX, RSA, KOR, CZE, CAN) | TERCERO |
| 3b | `supabase-complete.sql` (existente) | Jugadores equipos 6-21 | TERCERO |
| 3c | `supabase-complete-part2.sql` (existente) | Jugadores equipos 22-32 | TERCERO |
| 3d | `supabase-complete-part3.sql` (existente) | Jugadores equipos 33-48 | TERCERO |
| 4 | `supabase-generar-960-equipos.sql` | Auto-genera 960 cromos de equipos | CUARTO |

---

## 📋 PASOS PARA EJECUTAR EN SUPABASE

### Paso 0: Preparación
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **SQL Editor** (menú izquierdo)
3. **IMPORTANTE**: Si ya tienes datos, haz un backup primero

### Paso 1: Schema (tablas y estructura)
1. Abre `supabase-schema-final.sql`
2. **DESCOMENTA las líneas 10-15** (DROP TABLE) si quieres empezar limpio:
   ```sql
   DROP TABLE IF EXISTS intercambios CASCADE;
   DROP TABLE IF EXISTS usuario_cromos CASCADE;
   DROP TABLE IF EXISTS cromos CASCADE;
   DROP TABLE IF EXISTS jugadores CASCADE;
   DROP TABLE IF EXISTS selecciones CASCADE;
   DROP TABLE IF EXISTS perfiles CASCADE;
   ```
3. Copia TODO el contenido
4. Pégalo en el SQL Editor de Supabase
5. Haz clic en **RUN**
6. Verifica que no haya errores

### Paso 2: Selecciones + Intro + Museo
1. Abre `supabase-data-final.sql`
2. Copia TODO el contenido
3. Pégalo en el SQL Editor
4. Haz clic en **RUN**
5. **Verificación**: Ejecuta:
   ```sql
   SELECT COUNT(*) FROM selecciones; -- Debe ser 48
   SELECT COUNT(*) FROM cromos; -- Debe ser 20
   ```

### Paso 3: Jugadores (TODOS los equipos)
Ejecuta TODOS estos archivos en orden:

**3a.** `supabase-jugadores-completo.sql` → Equipos 1-5 (MEX, RSA, KOR, CZE, CAN)

**3b.** `supabase-complete.sql` → **SOLO las secciones de jugadores** (equipos 6-21)
   - ⚠️ Las selecciones del inicio se ignorarán (ON CONFLICT)
   - ⚠️ NO ejecutar la sección final de cromos si la tiene

**3c.** `supabase-complete-part2.sql` → Equipos 22-32

**3d.** `supabase-complete-part3.sql` → Equipos 33-48
   - ⚠️ **NO ejecutar las líneas 485-540** (generador de cromos viejo)

**Verificación**:
```sql
SELECT COUNT(*) FROM jugadores; 
-- Debe ser ~1248 (48 equipos × 26 jugadores)

-- Verificar equipos con jugadores:
SELECT s.nombre, COUNT(j.id) as jugadores 
FROM selecciones s 
LEFT JOIN jugadores j ON j.seleccion_id = s.id 
GROUP BY s.nombre, s.orden_album 
ORDER BY s.orden_album;
-- Todos deben tener 26 jugadores
```

### Paso 4: Generar los 960 Cromos de Equipos
1. Abre `supabase-generar-960-equipos.sql`
2. Copia TODO el contenido
3. Pégalo en el SQL Editor
4. Haz clic en **RUN**
5. Ejecuta las queries de verificación al final del archivo

### ✅ Verificación FINAL
```sql
-- TOTAL = 980
SELECT COUNT(*) as total_cromos FROM cromos;

-- Distribución correcta
SELECT tipo, COUNT(*) as cantidad FROM cromos GROUP BY tipo ORDER BY tipo;
-- introduccion = 9
-- museo_fifa   = 11
-- escudo       = 48
-- foto_equipo  = 48
-- normal       = 864
-- TOTAL        = 980

-- Sin huecos en la numeración
SELECT MIN(numero_cromo), MAX(numero_cromo), COUNT(DISTINCT numero_cromo) FROM cromos;
-- 1, 980, 980
```

---

## 🚀 SUBIR A GIT Y VERCEL

### Paso 1: Subir a Git
```bash
cd c:\proyectos\mundial-ambato

# Inicializar git (si no está)
git init

# Crear .gitignore
echo "node_modules/" > .gitignore
echo ".env.local" >> .gitignore
echo ".next/" >> .gitignore

# Agregar archivos
git add .

# Primer commit
git commit -m "feat: Base de datos 980 cromos - Album Panini FIFA 2026"

# Crear repositorio en GitHub (ir a github.com/new)
# Luego conectar:
git remote add origin https://github.com/TU-USUARIO/mundial-ambato.git
git branch -M main
git push -u origin main
```

### Paso 2: Desplegar en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. **Variables de entorno** - Agrega estas en Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL = tu-url-de-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY = tu-anon-key-de-supabase
   ```
   (Las encuentras en Supabase → Settings → API)
5. Haz clic en **Deploy**
6. ¡Listo! Tu app estará en `https://tu-proyecto.vercel.app`

### Paso 3: Verificar en producción
- Abre la URL de Vercel
- Ve a la sección de Catálogo
- Verifica que se muestren los 980 cromos
- Prueba el registro de usuario

---

## 📊 Resumen de la Base de Datos

| Concepto | Cantidad |
|---|---|
| Selecciones | 48 |
| Jugadores totales | 1,248 (26 × 48) |
| Jugadores en cromos | 864 (18 × 48) |
| Cromos introducción | 9 |
| Cromos Museo FIFA | 11 |
| Cromos escudo (foil) | 48 |
| Cromos foto equipo | 48 |
| Cromos jugadores | 864 |
| **TOTAL CROMOS** | **980** |

## 🔑 Distribución por Grupo

| Grupo | Equipos | Cromos |
|---|---|---|
| A | MEX, RSA, KOR, CZE | 21-100 |
| B | CAN, BIH, QAT, SUI | 101-180 |
| C | BRA, MAR, HAI, SCO | 181-260 |
| D | USA, PAR, AUS, TUR | 261-340 |
| E | GER, CUW, CIV, ECU | 341-420 |
| F | NED, JPN, TUN, SWE | 421-500 |
| G | BEL, EGY, IRN, NZL | 501-580 |
| H | ESP, CPV, KSA, URU | 581-660 |
| I | FRA, SEN, IRQ, NOR | 661-740 |
| J | ARG, ALG, AUT, JOR | 741-820 |
| K | POR, COD, UZB, COL | 821-900 |
| L | ENG, CRO, GHA, PAN | 901-980 |
