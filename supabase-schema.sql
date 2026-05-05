-- Esquema de base de datos para Mundial Ambato - Cromos 2026

-- 1. Tabla de Selecciones (48 equipos)
CREATE TABLE selecciones (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  confederacion VARCHAR(10) NOT NULL CHECK (confederacion IN ('CONCACAF', 'CONMEBOL', 'UEFA', 'AFC', 'CAF', 'OFC')),
  codigo_fifa VARCHAR(3) NOT NULL UNIQUE,
  grupo VARCHAR(5),
  escudo_url TEXT,
  bandera_url TEXT,
  ranking_fifa INT,
  participaciones INT,
  mejor_resultado VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Jugadores (aprox 26 por selección)
CREATE TABLE jugadores (
  id SERIAL PRIMARY KEY,
  seleccion_id INT NOT NULL REFERENCES selecciones(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  numero INT,
  posicion VARCHAR(20) CHECK (posicion IN ('Portero', 'Defensor', 'Centrocampista', 'Delantero')),
  club VARCHAR(100),
  edad INT,
  es_titular BOOLEAN DEFAULT FALSE,
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Cromos (tipos: normal, especial, dorado)
CREATE TABLE cromos (
  id SERIAL PRIMARY KEY,
  jugador_id INT REFERENCES jugadores(id) ON DELETE CASCADE,
  seleccion_id INT NOT NULL REFERENCES selecciones(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('normal', 'especial', 'dorado', 'seleccion')),
  numero_cromo INT NOT NULL,
  imagen_url TEXT,
  rareza INT DEFAULT 1 CHECK (rareza BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Usuarios (perfil extendido, auth via Supabase)
CREATE TABLE perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  ciudad VARCHAR(50) DEFAULT 'Ambato',
  whatsapp VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de Cromos del Usuario (inventario)
CREATE TABLE usuario_cromos (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  cromo_id INT NOT NULL REFERENCES cromos(id) ON DELETE CASCADE,
  estado VARCHAR(10) NOT NULL CHECK (estado IN ('obtenido', 'repetido')),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, cromo_id, estado)
);

-- 6. Tabla de Solicitudes de Intercambio
CREATE TABLE intercambios (
  id SERIAL PRIMARY KEY,
  usuario_ofrece_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  usuario_recibe_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
  cromo_ofrecido_id INT NOT NULL REFERENCES cromos(id),
  cromo_buscado_id INT NOT NULL REFERENCES cromos(id),
  estado VARCHAR(20) DEFAULT 'abierto' CHECK (estado IN ('abierto', 'en_proceso', 'completado', 'cancelado')),
  ubicacion TEXT,
  fecha_encuentro DATE,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_jugadores_seleccion ON jugadores(seleccion_id);
CREATE INDEX idx_cromos_seleccion ON cromos(seleccion_id);
CREATE INDEX idx_cromos_jugador ON cromos(jugador_id);
CREATE INDEX idx_usuario_cromos_usuario ON usuario_cromos(usuario_id);
CREATE INDEX idx_usuario_cromos_cromo ON usuario_cromos(cromo_id);
CREATE INDEX idx_intercambios_usuario_ofrece ON intercambios(usuario_ofrece_id);
CREATE INDEX idx_intercambios_estado ON intercambios(estado);

-- RLS (Row Level Security) policies
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario_cromos ENABLE ROW LEVEL SECURITY;
ALTER TABLE intercambios ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles (cada usuario ve y edita solo su perfil)
CREATE POLICY "Usuarios pueden ver su propio perfil" ON perfiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON perfiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para cromos de usuario
CREATE POLICY "Usuarios ven sus propios cromos" ON usuario_cromos
  FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuarios registran sus cromos" ON usuario_cromos
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Políticas para intercambios
CREATE POLICY "Ver intercambios abiertos en Ambato" ON intercambios
  FOR SELECT USING (estado = 'abierto' OR auth.uid() = usuario_ofrece_id OR auth.uid() = usuario_recibe_id);
CREATE POLICY "Crear solicitud de intercambio" ON intercambios
  FOR INSERT WITH CHECK (auth.uid() = usuario_ofrece_id);
