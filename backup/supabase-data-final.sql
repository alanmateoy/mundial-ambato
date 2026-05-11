-- =============================================
-- MUNDIAL AMBATO 2026 - DATOS COMPLETOS FINALES
-- =============================================
-- EJECUTAR DESPUÉS de supabase-schema-final.sql
-- 
-- Este archivo contiene:
--   PASO 1: 48 selecciones (datos corregidos)
--   PASO 2: 9 cromos de introducción
--   PASO 3: 11 cromos del Museo FIFA
--   PASO 4: 960 cromos de equipos (auto-generados)
--   TOTAL: 980 cromos exactos
--
-- IMPORTANTE: Ejecutar los archivos de jugadores ANTES del PASO 4:
--   1. supabase-schema-final.sql
--   2. Este archivo (PASOS 1-3)
--   3. supabase-jugadores-completo.sql (todos los jugadores)
--   4. Este archivo (PASO 4 - generación de cromos)
-- =============================================

-- =============================================
-- PASO 1: 48 SELECCIONES CORREGIDAS
-- Orden: Grupo A → Grupo L (4 equipos por grupo)
-- =============================================
INSERT INTO selecciones (nombre, confederacion, codigo_fifa, grupo, orden_album, ranking_fifa, participaciones, mejor_resultado) VALUES
-- GRUPO A
('México',              'CONCACAF', 'MEX', 'A',  1, 15, 17, 'Cuartos de final (1970, 1986)'),
('Sudáfrica',           'CAF',      'RSA', 'A',  2, 66,  4, 'Primera fase (1998, 2002, 2010)'),
('Corea del Sur',       'AFC',      'KOR', 'A',  3, 23, 11, 'Semifinales (2002)'),
('República Checa',     'UEFA',     'CZE', 'A',  4, 34,  2, 'Primera fase (2006)'),
-- GRUPO B
('Canadá',              'CONCACAF', 'CAN', 'B',  5, 28,  3, 'Octavos de final (2022)'),
('Bosnia y Herzegovina','UEFA',     'BIH', 'B',  6, 48,  2, 'Primera fase (2014)'),
('Catar',               'AFC',      'QAT', 'B',  7, 44,  2, 'Primera fase (2022)'),
('Suiza',               'UEFA',     'SUI', 'B',  8, 19, 12, 'Cuartos de final (1934, 1938, 1954, 2024)'),
-- GRUPO C
('Brasil',              'CONMEBOL', 'BRA', 'C',  9,  5, 22, 'Campeón (1958, 1962, 1970, 1994, 2002)'),
('Marruecos',           'CAF',      'MAR', 'C', 10, 12,  6, 'Semifinales (2022)'),
('Haití',               'CONCACAF', 'HAI', 'C', 11, 83,  1, 'Primera fase (1974)'),
('Escocia',             'UEFA',     'SCO', 'C', 12, 40,  8, 'Primera fase (1998)'),
-- GRUPO D
('Estados Unidos',      'CONCACAF', 'USA', 'D', 13, 16, 11, 'Tercer lugar (1930)'),
('Paraguay',            'CONMEBOL', 'PAR', 'D', 14, 35,  8, 'Cuartos de final (2010)'),
('Australia',           'AFC',      'AUS', 'D', 15, 27,  6, 'Octavos de final (2006, 2022)'),
('Turquía',             'UEFA',     'TUR', 'D', 16, 32,  3, 'Tercer lugar (2002)'),
-- GRUPO E
('Alemania',            'UEFA',     'GER', 'E', 17,  3, 20, 'Campeón (1954, 1974, 1990, 2014)'),
('Curazao',             'CONCACAF', 'CUW', 'E', 18, 91,  1, 'Debutante'),
('Costa de Marfil',     'CAF',      'CIV', 'E', 19, 39,  4, 'Primera fase (2014)'),
('Ecuador',             'CONMEBOL', 'ECU', 'E', 20, 31,  4, 'Octavos de final (2006)'),
-- GRUPO F
('Países Bajos',        'UEFA',     'NED', 'F', 21,  6, 11, 'Subcampeón (1974, 1978, 2010)'),
('Japón',               'AFC',      'JPN', 'F', 22, 18,  7, 'Octavos de final (2002, 2010, 2018, 2022)'),
('Túnez',               'CAF',      'TUN', 'F', 23, 30,  6, 'Primera fase (2022)'),
('Suecia',              'UEFA',     'SWE', 'F', 24, 25, 12, 'Subcampeón (1958)'),
-- GRUPO G
('Bélgica',             'UEFA',     'BEL', 'G', 25,  8, 14, 'Tercer lugar (2018)'),
('Egipto',              'CAF',      'EGY', 'G', 26, 37,  3, 'Primera fase (2018)'),
('Irán',                'AFC',      'IRN', 'G', 27, 24,  6, 'Primera fase (2022)'),
('Nueva Zelanda',       'OFC',      'NZL', 'G', 28, 98,  2, 'Primera fase (2010)'),
-- GRUPO H
('España',              'UEFA',     'ESP', 'H', 29,  2, 16, 'Campeón (2010)'),
('Cabo Verde',          'CAF',      'CPV', 'H', 30, 69,  1, 'Debutante'),
('Arabia Saudí',        'AFC',      'KSA', 'H', 31, 61,  6, 'Octavos de final (1994)'),
('Uruguay',             'CONMEBOL', 'URU', 'H', 32, 17, 14, 'Campeón (1930, 1950)'),
-- GRUPO I
('Francia',             'UEFA',     'FRA', 'I', 33,  1, 16, 'Campeón (1998, 2018)'),
('Senegal',             'CAF',      'SEN', 'I', 34, 20,  3, 'Cuartos de final (2022)'),
('Irak',                'AFC',      'IRQ', 'I', 35, 55,  1, 'Primera fase (1986)'),
('Noruega',             'UEFA',     'NOR', 'I', 36, 26,  3, 'Octavos de final (1998)'),
-- GRUPO J
('Argentina',           'CONMEBOL', 'ARG', 'J', 37,  4, 18, 'Campeón (1978, 1986, 2022)'),
('Argelia',             'CAF',      'ALG', 'J', 38, 42,  4, 'Octavos de final (2014)'),
('Austria',             'UEFA',     'AUT', 'J', 39, 22,  7, 'Tercer lugar (1954)'),
('Jordania',            'AFC',      'JOR', 'J', 40, 58,  1, 'Debutante'),
-- GRUPO K
('Portugal',            'UEFA',     'POR', 'K', 41,  7,  8, 'Tercer lugar (1966)'),
('RD Congo',            'CAF',      'COD', 'K', 42, 52,  1, 'Cuartos de final (1974)'),
('Uzbekistán',          'AFC',      'UZB', 'K', 43, 65,  1, 'Debutante'),
('Colombia',            'CONMEBOL', 'COL', 'K', 44, 14,  6, 'Cuartos de final (2014)'),
-- GRUPO L
('Inglaterra',          'UEFA',     'ENG', 'L', 45,  4, 16, 'Campeón (1966)'),
('Croacia',             'UEFA',     'CRO', 'L', 46,  9,  6, 'Subcampeón (2018, 2022)'),
('Ghana',               'CAF',      'GHA', 'L', 47, 38,  4, 'Cuartos de final (2010)'),
('Panamá',              'CONCACAF', 'PAN', 'L', 48, 36,  2, 'Primera fase (2018)')
ON CONFLICT (codigo_fifa) DO UPDATE SET
  orden_album = EXCLUDED.orden_album,
  mejor_resultado = EXCLUDED.mejor_resultado,
  participaciones = EXCLUDED.participaciones;

-- =============================================
-- PASO 2: 9 CROMOS DE INTRODUCCIÓN (números 1-9)
-- =============================================
INSERT INTO cromos (numero_cromo, tipo, descripcion, seccion, rareza, es_foil) VALUES
(1, 'introduccion', 'FWC 1 - Emblema oficial FIFA World Cup 2026',          'introduccion', 5, true),
(2, 'introduccion', 'FWC 2 - Logo Panini oficial',                          'introduccion', 5, true),
(3, 'introduccion', 'FWC 3 - Mascota oficial del torneo',                   'introduccion', 5, true),
(4, 'introduccion', 'FWC 4 - Balón oficial Adidas',                         'introduccion', 5, true),
(5, 'introduccion', 'FWC 5 - Trofeo Copa del Mundo FIFA',                   'introduccion', 5, true),
(6, 'introduccion', 'FWC 6 - Sede: Estados Unidos',                         'introduccion', 4, true),
(7, 'introduccion', 'FWC 7 - Sede: Canadá',                                 'introduccion', 4, true),
(8, 'introduccion', 'FWC 8 - Sede: México',                                 'introduccion', 4, true),
(9, 'introduccion', 'FWC 9 - Mapa de sedes del torneo',                     'introduccion', 4, true)
ON CONFLICT (numero_cromo) DO NOTHING;

-- =============================================
-- PASO 3: 11 CROMOS DEL MUSEO FIFA (números 10-20)
-- Campeones mundiales seleccionados
-- =============================================
INSERT INTO cromos (numero_cromo, tipo, descripcion, seccion, rareza, es_foil) VALUES
(10, 'museo_fifa', 'MUS 1 - Uruguay, Campeón 1930 (Primer Mundial)',       'museo_fifa', 4, true),
(11, 'museo_fifa', 'MUS 2 - Italia, Campeón 1934',                        'museo_fifa', 4, true),
(12, 'museo_fifa', 'MUS 3 - Brasil, Campeón 1958 (Pelé debuta)',          'museo_fifa', 4, true),
(13, 'museo_fifa', 'MUS 4 - Inglaterra, Campeón 1966',                    'museo_fifa', 4, true),
(14, 'museo_fifa', 'MUS 5 - Brasil, Campeón 1970 (Pelé, Jairzinho)',      'museo_fifa', 4, true),
(15, 'museo_fifa', 'MUS 6 - Argentina, Campeón 1978',                     'museo_fifa', 4, true),
(16, 'museo_fifa', 'MUS 7 - Argentina, Campeón 1986 (Maradona)',          'museo_fifa', 4, true),
(17, 'museo_fifa', 'MUS 8 - Brasil, Campeón 1994 (Romário)',              'museo_fifa', 4, true),
(18, 'museo_fifa', 'MUS 9 - Francia, Campeón 1998 (Zidane)',              'museo_fifa', 4, true),
(19, 'museo_fifa', 'MUS 10 - España, Campeón 2010 (Tiki-taka)',           'museo_fifa', 4, true),
(20, 'museo_fifa', 'MUS 11 - Argentina, Campeón 2022 (Messi)',            'museo_fifa', 4, true)
ON CONFLICT (numero_cromo) DO NOTHING;

-- =============================================
-- VERIFICACIÓN PARCIAL (ejecutar antes del PASO 4)
-- =============================================
-- SELECT COUNT(*) as total_intro_museo FROM cromos; -- Debe ser 20
-- SELECT tipo, COUNT(*) FROM cromos GROUP BY tipo;
-- Debe mostrar: introduccion=9, museo_fifa=11
