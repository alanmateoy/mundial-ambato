-- =============================================
-- MUNDIAL AMBATO 2026 - SCHEMA FINAL CORREGIDO
-- Basado en la estructura REAL del álbum Panini FIFA 2026
-- Total: 980 cromos exactos
-- Distribución: 9 intro + 11 museo + (48 equipos × 20) = 980
-- EJECUTAR ESTE ARCHIVO PRIMERO en Supabase SQL Editor
-- =============================================

-- Limpiar tablas existentes (DESCOMENTAR solo si quieres empezar de cero)
-- DROP TABLE IF EXISTS intercambios CASCADE;
-- DROP TABLE IF EXISTS usuario_cromos CASCADE;
-- DROP TABLE IF EXISTS cromos CASCADE;
-- DROP TABLE IF EXISTS jugadores CASCADE;
-- DROP TABLE IF EXISTS selecciones CASCADE;
-- DROP TABLE IF EXISTS perfiles CASCADE;

-- =============================================
-- TABLA 1: selecciones (48 equipos)
-- =============================================
CREATE TABLE IF NOT EXISTS selecciones (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  confederacion VARCHAR(10) NOT NULL CHECK (confederacion IN ('CONCACAF', 'CONMEBOL', 'UEFA', 'AFC', 'CAF', 'OFC')),
  codigo_fifa VARCHAR(3) NOT NULL UNIQUE,
  grupo VARCHAR(5),
  orden_album INT UNIQUE, -- orden en que aparecen en el álbum (1-48)
  escudo_url TEXT,
  bandera_url TEXT,
  ranking_fifa INT,
  participaciones INT,
  mejor_resultado VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABLA 2: jugadores
-- =============================================
CREATE TABLE IF NOT EXISTS jugadores (
  id SERIAL PRIMARY KEY,
  seleccion_id INT NOT NULL REFERENCES selecciones(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  numero INT,                  -- número de camiseta
  posicion VARCHAR(20) CHECK (posicion IN ('Portero', 'Defensor', 'Centrocampista', 'Delantero')),
  club VARCHAR(100),
  edad INT,
  es_titular BOOLEAN DEFAULT FALSE, -- true = titular/estrella para selección de cromos
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABLA 3: cromos (980 total - DISTRIBUCIÓN REAL PANINI 2026)
-- =============================================
-- Distribución verificada con fuentes oficiales:
--   9  introducción (emblema, mascota, balón, trofeo, sedes)
--   11 Museo FIFA (campeones históricos)
--   48 escudos (1 por selección, foil)
--   48 fotos de equipo (1 por selección)
--   864 jugadores (18 por selección × 48)
--   TOTAL = 9 + 11 + 48 + 48 + 864 = 980
--
-- NOTA: Los 12 Coca-Cola son una PROMOCIÓN SEPARADA
--       No cuentan dentro de los 980 del set base.
-- =============================================
CREATE TABLE IF NOT EXISTS cromos (
  id SERIAL PRIMARY KEY,
  numero_cromo INT NOT NULL UNIQUE,          -- número global 1-980
  jugador_id INT REFERENCES jugadores(id) ON DELETE SET NULL,
  seleccion_id INT REFERENCES selecciones(id) ON DELETE SET NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN (
    'normal',       -- jugador estándar (864 total)
    'escudo',       -- escudo del equipo en foil (48 total)
    'foto_equipo',  -- foto grupal del equipo (48 total)
    'introduccion', -- páginas intro: emblema, mascota, balón, sedes (9 total)
    'museo_fifa'    -- campeones históricos del Mundial (11 total)
  )),
  descripcion VARCHAR(300),
  seccion VARCHAR(50),                       -- ej: 'intro', 'museo', 'grupo_a', etc.
  rareza INT DEFAULT 1 CHECK (rareza BETWEEN 1 AND 5),
  -- Rareza:
  --   1 = común (jugadores normales)
  --   2 = poco común (fotos de equipo)
  --   3 = especial (escudos foil)
  --   4 = raro (museo fifa, intro foil)
  --   5 = ultra raro (emblema, trofeo holográfico)
  es_foil BOOLEAN DEFAULT FALSE,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABLA 4: perfiles (usuarios)
-- =============================================
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  ciudad VARCHAR(50) DEFAULT 'Ambato',
  whatsapp VARCHAR(20),
  avatar_url TEXT,
  cromos_obtenidos INT DEFAULT 0,
  cromos_repetidos INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABLA 5: usuario_cromos (inventario)
-- =============================================
CREATE TABLE IF NOT EXISTS usuario_cromos (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  cromo_id INT NOT NULL REFERENCES cromos(id) ON DELETE CASCADE,
  estado VARCHAR(10) NOT NULL CHECK (estado IN ('obtenido', 'repetido')),
  cantidad INT DEFAULT 1,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, cromo_id)
);

-- =============================================
-- TABLA 6: intercambios
-- =============================================
CREATE TABLE IF NOT EXISTS intercambios (
  id SERIAL PRIMARY KEY,
  usuario_ofrece_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  usuario_recibe_id UUID REFERENCES perfiles(id) ON DELETE SET NULL,
  cromo_ofrecido_id INT NOT NULL REFERENCES cromos(id),
  cromo_buscado_id INT NOT NULL REFERENCES cromos(id),
  estado VARCHAR(20) DEFAULT 'abierto' CHECK (estado IN ('abierto', 'en_proceso', 'completado', 'cancelado')),
  ubicacion TEXT DEFAULT 'Ambato',
  fecha_encuentro DATE,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ÍNDICES PARA RENDIMIENTO
-- =============================================
CREATE INDEX IF NOT EXISTS idx_jugadores_seleccion ON jugadores(seleccion_id);
CREATE INDEX IF NOT EXISTS idx_cromos_numero ON cromos(numero_cromo);
CREATE INDEX IF NOT EXISTS idx_cromos_tipo ON cromos(tipo);
CREATE INDEX IF NOT EXISTS idx_cromos_seleccion ON cromos(seleccion_id);
CREATE INDEX IF NOT EXISTS idx_cromos_jugador ON cromos(jugador_id);
CREATE INDEX IF NOT EXISTS idx_usuario_cromos_usuario ON usuario_cromos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_cromos_cromo ON usuario_cromos(cromo_id);
CREATE INDEX IF NOT EXISTS idx_usuario_cromos_estado ON usuario_cromos(estado);
CREATE INDEX IF NOT EXISTS idx_intercambios_estado ON intercambios(estado);
CREATE INDEX IF NOT EXISTS idx_intercambios_usuario ON intercambios(usuario_ofrece_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario_cromos ENABLE ROW LEVEL SECURITY;
ALTER TABLE intercambios ENABLE ROW LEVEL SECURITY;
ALTER TABLE cromos ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE selecciones ENABLE ROW LEVEL SECURITY;

-- Políticas para PERFILES
CREATE POLICY IF NOT EXISTS "perfiles_select_own" ON perfiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "perfiles_insert_own" ON perfiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "perfiles_update_own" ON perfiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para USUARIO_CROMOS
CREATE POLICY IF NOT EXISTS "usuario_cromos_select_own" ON usuario_cromos
  FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY IF NOT EXISTS "usuario_cromos_insert_own" ON usuario_cromos
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY IF NOT EXISTS "usuario_cromos_update_own" ON usuario_cromos
  FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY IF NOT EXISTS "usuario_cromos_delete_own" ON usuario_cromos
  FOR DELETE USING (auth.uid() = usuario_id);

-- Políticas para INTERCAMBIOS
CREATE POLICY IF NOT EXISTS "intercambios_select_abiertos" ON intercambios
  FOR SELECT USING (estado = 'abierto' OR auth.uid() = usuario_ofrece_id OR auth.uid() = usuario_recibe_id);
CREATE POLICY IF NOT EXISTS "intercambios_insert_own" ON intercambios
  FOR INSERT WITH CHECK (auth.uid() = usuario_ofrece_id);
CREATE POLICY IF NOT EXISTS "intercambios_update_own" ON intercambios
  FOR UPDATE USING (auth.uid() = usuario_ofrece_id);

-- Políticas PÚBLICAS para catálogo (cualquier usuario autenticado puede leer)
CREATE POLICY IF NOT EXISTS "cromos_select_all" ON cromos
  FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "jugadores_select_all" ON jugadores
  FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "selecciones_select_all" ON selecciones
  FOR SELECT USING (true);

-- =============================================
-- FUNCIÓN: auto-crear perfil al registrarse
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, nombre)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================
-- VERIFICACIÓN
-- =============================================
-- Ejecuta esto para verificar:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
