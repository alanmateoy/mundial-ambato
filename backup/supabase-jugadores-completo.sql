-- =============================================
-- MUNDIAL AMBATO 2026 - JUGADORES COMPLETOS (48 EQUIPOS)
-- =============================================
-- EJECUTAR DESPUÉS de supabase-schema-final.sql y supabase-data-final.sql
--
-- 48 equipos × 26 jugadores = 1248 jugadores totales
-- (El generador de cromos seleccionará 18 por equipo)
--
-- Campos: seleccion_id, nombre, apellido, numero, posicion, club, edad, es_titular
-- =============================================

-- =============================================
-- GRUPO A
-- =============================================

-- 1. MÉXICO
INSERT INTO jugadores (seleccion_id, nombre, apellido, numero, posicion, club, edad, es_titular) VALUES
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Raúl', 'Rangel', 1, 'Portero', 'Chivas', 25, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Guillermo', 'Ochoa', 12, 'Portero', 'AEL Limassol', 41, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Carlos', 'Acevedo', 23, 'Portero', 'Santos Laguna', 28, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'César', 'Montes', 2, 'Defensor', 'Lokomotiv Moscú', 29, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Johan', 'Vásquez', 3, 'Defensor', 'Genoa', 27, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Jorge', 'Sánchez', 5, 'Defensor', 'Cruz Azul', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Israel', 'Reyes', 13, 'Defensor', 'América', 24, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Jesús', 'Gallardo', 7, 'Defensor', 'Toluca', 31, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Kevin', 'Álvarez', 19, 'Defensor', 'Pachuca', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Edson', 'Álvarez', 6, 'Centrocampista', 'West Ham', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Orbelín', 'Pineda', 10, 'Centrocampista', 'AEK Atenas', 30, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Luis', 'Romo', 15, 'Centrocampista', 'Cruz Azul', 30, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Álvaro', 'Fidalgo', 16, 'Centrocampista', 'Betis', 27, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Carlos', 'Rodríguez', 8, 'Centrocampista', 'Cruz Azul', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Diego', 'Lainez', 17, 'Centrocampista', 'Tigres', 25, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Santiago', 'Giménez', 9, 'Delantero', 'AC Milan', 25, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Raúl', 'Jiménez', 20, 'Delantero', 'Fulham', 35, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Alexis', 'Vega', 18, 'Delantero', 'Toluca', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Roberto', 'Alvarado', 21, 'Delantero', 'Chivas', 27, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Hirving', 'Lozano', 11, 'Delantero', 'San Diego FC', 30, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Henry', 'Martín', 14, 'Delantero', 'América', 33, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Julián', 'Quiñones', 22, 'Delantero', 'América', 29, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Ángel', 'Sepúlveda', 24, 'Delantero', 'Cruz Azul', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Marcel', 'Ruiz', 25, 'Centrocampista', 'Toluca', 28, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Luis', 'Malagón', 26, 'Portero', 'América', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'MEX'), 'Erik', 'Lira', 4, 'Centrocampista', 'Cruz Azul', 26, false)
ON CONFLICT DO NOTHING;

-- 2. SUDÁFRICA
INSERT INTO jugadores (seleccion_id, nombre, apellido, numero, posicion, club, edad, es_titular) VALUES
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Ronwen', 'Williams', 1, 'Portero', 'Mamelodi Sundowns', 32, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Veli', 'Mothwa', 12, 'Portero', 'AmaZulu', 30, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Ricardo', 'Goss', 23, 'Portero', 'Orlando Pirates', 28, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Mothobi', 'Mvala', 2, 'Defensor', 'Mamelodi Sundowns', 30, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Siyanda', 'Xulu', 3, 'Defensor', 'Kaizer Chiefs', 31, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Nkosinathi', 'Sibisi', 4, 'Defensor', 'Orlando Pirates', 27, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Bathusi', 'Aubaas', 5, 'Defensor', 'Mamelodi Sundowns', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Aubrey', 'Modiba', 13, 'Defensor', 'Mamelodi Sundowns', 29, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Khuliso', 'Mudau', 14, 'Defensor', 'Mamelodi Sundowns', 28, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Teboho', 'Mokoena', 6, 'Centrocampista', 'Mamelodi Sundowns', 27, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Sphephelo', 'Sithole', 8, 'Centrocampista', 'Kaizer Chiefs', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Themba', 'Zwane', 10, 'Centrocampista', 'Mamelodi Sundowns', 25, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Thalente', 'Mbatha', 15, 'Centrocampista', 'Orlando Pirates', 24, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Oswin', 'Appollis', 7, 'Delantero', 'Mamelodi Sundowns', 24, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Iqraam', 'Rayners', 9, 'Delantero', 'Mamelodi Sundowns', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Lebo', 'Mothiba', 11, 'Delantero', 'Strasbourg', 29, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Evidence', 'Makgopa', 18, 'Delantero', 'Orlando Pirates', 24, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Relebohile', 'Mofokeng', 17, 'Delantero', 'Orlando Pirates', 19, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Mohau', 'Nkota', 16, 'Delantero', 'Orlando Pirates', 20, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Elias', 'Mokwana', 19, 'Delantero', 'Esperance', 24, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Luke', 'Le Roux', 20, 'Centrocampista', 'Kaizer Chiefs', 25, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Grant', 'Kekana', 21, 'Defensor', 'Mamelodi Sundowns', 30, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Siyabonga', 'Ngezana', 22, 'Defensor', 'Orlando Pirates', 28, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Sipho', 'Mbule', 24, 'Centrocampista', 'AmaZulu', 26, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Fagrie', 'Lakay', 25, 'Defensor', 'Stellenbosch', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'RSA'), 'Reeves', 'Fuma', 26, 'Portero', 'Marumo Gallants', 27, false)
ON CONFLICT DO NOTHING;

-- 3. COREA DEL SUR
INSERT INTO jugadores (seleccion_id, nombre, apellido, numero, posicion, club, edad, es_titular) VALUES
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Kim', 'Seung-gyu', 1, 'Portero', 'Al-Shabab', 34, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Jo', 'Hyeon-woo', 12, 'Portero', 'Ulsan HD', 35, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Song', 'Bum-keun', 23, 'Portero', 'Nottingham Forest', 26, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Kim', 'Min-jae', 2, 'Defensor', 'Bayern Múnich', 29, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Kim', 'Jin-su', 3, 'Defensor', 'Jeonbuk Hyundai', 32, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Kim', 'Young-gwon', 4, 'Defensor', 'Ulsan HD', 35, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Jung', 'Seung-hyun', 5, 'Defensor', 'Gimcheon Sangmu', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Seol', 'Young-woo', 13, 'Defensor', 'Ulsan HD', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Hong', 'Chul', 14, 'Defensor', 'Ulsan HD', 32, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Hwang', 'In-beom', 6, 'Centrocampista', 'Feyenoord', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Lee', 'Jae-sung', 8, 'Centrocampista', 'Mainz 05', 34, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Son', 'Heung-min', 10, 'Delantero', 'Tottenham', 33, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Jeong', 'Woo-yeong', 15, 'Centrocampista', 'Stuttgart', 27, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Hwang', 'Hee-chan', 7, 'Delantero', 'Wolverhampton', 30, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Cho', 'Gue-sung', 9, 'Delantero', 'Midtjylland', 27, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Lee', 'Kang-in', 11, 'Centrocampista', 'París Saint-Germain', 25, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Oh', 'Hyeon-gyu', 18, 'Delantero', 'Celtic', 24, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Yang', 'Min-hyeok', 17, 'Delantero', 'Tottenham', 19, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Park', 'Jin-seop', 16, 'Defensor', 'Jeonbuk Hyundai', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Kwon', 'Chang-hoon', 20, 'Centrocampista', 'Gimcheon Sangmu', 32, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Paik', 'Seung-ho', 21, 'Centrocampista', 'Jeonbuk Hyundai', 29, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Um', 'Won-sang', 22, 'Delantero', 'Gangwon FC', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Moon', 'Seon-ho', 24, 'Centrocampista', 'Jeonbuk Hyundai', 29, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Kim', 'Tae-hwan', 25, 'Defensor', 'Ulsan HD', 30, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Lee', 'Seung-woo', 19, 'Delantero', 'Jeonbuk Hyundai', 28, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'KOR'), 'Lee', 'Chang-geun', 26, 'Portero', 'Daegu FC', 30, false)
ON CONFLICT DO NOTHING;

-- 4. REPÚBLICA CHECA
INSERT INTO jugadores (seleccion_id, nombre, apellido, numero, posicion, club, edad, es_titular) VALUES
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Jindřich', 'Staňek', 1, 'Portero', 'Slavia Praga', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Matěj', 'Kovář', 12, 'Portero', 'Bayer Leverkusen', 26, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Vít', 'Němeček', 23, 'Portero', 'Sparta Praga', 28, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Tomáš', 'Holeš', 2, 'Defensor', 'Slavia Praga', 32, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'David', 'Zima', 3, 'Defensor', 'Torino', 26, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Ladislav', 'Krejčí', 4, 'Defensor', 'Girona', 27, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'David', 'Jurásek', 5, 'Defensor', 'Benfica', 25, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Robin', 'Hranáč', 13, 'Defensor', 'Hoffenheim', 25, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Vladimír', 'Coufal', 14, 'Defensor', 'West Ham', 33, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Tomáš', 'Souček', 6, 'Centrocampista', 'West Ham', 31, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Antonín', 'Barák', 8, 'Centrocampista', 'Fiorentina', 30, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Lukáš', 'Provod', 10, 'Centrocampista', 'Slavia Praga', 29, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Michal', 'Sadílek', 15, 'Centrocampista', 'Twente', 28, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Patrik', 'Schick', 7, 'Delantero', 'Bayer Leverkusen', 29, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Adam', 'Hložek', 9, 'Delantero', 'Hoffenheim', 24, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Mojmír', 'Chytil', 11, 'Delantero', 'Slavia Praga', 26, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Václav', 'Černý', 18, 'Delantero', 'Wolfsburg', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Jan', 'Kuchta', 17, 'Delantero', 'Sparta Praga', 29, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Alex', 'Král', 16, 'Centrocampista', 'Espanyol', 28, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Ondřej', 'Lingr', 20, 'Delantero', 'Feyenoord', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Pavel', 'Šulc', 21, 'Centrocampista', 'Viktoria Plzeň', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Tomáš', 'Chorý', 22, 'Delantero', 'Slavia Praga', 31, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Filip', 'Křepský', 24, 'Centrocampista', 'Sparta Praga', 22, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Matěj', 'Jurásek', 25, 'Centrocampista', 'Slavia Praga', 23, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Martin', 'Jedlička', 26, 'Portero', 'Dukla Praga', 30, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CZE'), 'Václav', 'Jemelka', 19, 'Defensor', 'Slavia Praga', 30, false)
ON CONFLICT DO NOTHING;

-- =============================================
-- NOTA: Para los equipos 5-48, se usarán los datos existentes
-- de los archivos supabase-complete.sql, part2.sql y part3.sql
-- adaptados al schema final.
--
-- Los siguientes equipos se insertan ejecutando los archivos existentes
-- que YA contienen los datos correctos de jugadores
-- con los campos compatibles (numero, es_titular):

-- 5. CANADÁ (usar datos de supabase-complete.sql líneas 187-215)
INSERT INTO jugadores (seleccion_id, nombre, apellido, numero, posicion, club, edad, es_titular) VALUES
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Dayne', 'St. Clair', 1, 'Portero', 'Minnesota United', 29, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Maxime', 'Crépeau', 12, 'Portero', 'Portland Timbers', 32, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'James', 'Pantemis', 23, 'Portero', 'CF Montréal', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Alistair', 'Johnston', 2, 'Defensor', 'Celtic', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Kamal', 'Miller', 3, 'Defensor', 'Portland Timbers', 29, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Moïse', 'Bombito', 4, 'Defensor', 'Colorado Rapids', 26, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Derek', 'Cornelius', 5, 'Defensor', 'Malmö FF', 28, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Richie', 'Laryea', 13, 'Defensor', 'Toronto FC', 31, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Samuel', 'Adekugbe', 14, 'Defensor', 'Hatayspor', 30, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Stephen', 'Eustáquio', 6, 'Centrocampista', 'Porto', 29, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Alphonso', 'Davies', 8, 'Centrocampista', 'Real Madrid', 25, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Jonathan', 'Osorio', 10, 'Centrocampista', 'Toronto FC', 34, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Ismaël', 'Koné', 15, 'Centrocampista', 'Olympique Marseille', 25, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Tajon', 'Buchanan', 7, 'Delantero', 'Inter Milán', 27, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Jonathan', 'David', 9, 'Delantero', 'Lille', 26, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Cyle', 'Larin', 11, 'Delantero', 'Real Mallorca', 30, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Liam', 'Millar', 18, 'Delantero', 'Basel', 25, true),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Jacen', 'Russell-Rowe', 17, 'Delantero', 'Columbus Crew', 22, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Mathieu', 'Choinière', 16, 'Centrocampista', 'CF Montréal', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Mark-Anthony', 'Kaye', 20, 'Centrocampista', 'Toronto FC', 31, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Scott', 'Kennedy', 21, 'Defensor', 'Millwall', 27, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Lucas', 'Cavallini', 22, 'Delantero', 'Vancouver Whitecaps', 33, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Liam', 'Fraser', 24, 'Centrocampista', 'Dallas', 28, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Ali', 'Ahmed', 25, 'Centrocampista', 'Vancouver Whitecaps', 25, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Tom', 'McGill', 26, 'Portero', 'Brighton', 26, false),
((SELECT id FROM selecciones WHERE codigo_fifa = 'CAN'), 'Niko', 'Sigur', 19, 'Defensor', 'Orlando City', 26, false)
ON CONFLICT DO NOTHING;

-- =============================================
-- EQUIPOS 6-48: Referenciar archivos existentes
-- =============================================
-- Los equipos 6-48 se cargan ejecutando los siguientes archivos
-- que YA contienen los datos correctos de jugadores:
--
-- Para equipos 6-21 (BIH, QAT, SUI, BRA, MAR, HAI, SCO, USA, PAR, AUS, TUR, GER, CUW, CIV, ECU, NED):
--   Ejecutar: supabase-complete.sql (líneas 217-695)
--   NOTA: Solo ejecutar las secciones de INSERT INTO jugadores
--         NO ejecutar la sección de selecciones (ya insertadas arriba)
--
-- Para equipos 22-32 (JPN, TUN, SWE, BEL, EGY, IRN, NZL, ESP, CPV, KSA, URU):
--   Ejecutar: supabase-complete-part2.sql
--
-- Para equipos 33-48 (FRA, SEN, IRQ, NOR, ARG, ALG, AUT, JOR, POR, COD, UZB, COL, ENG, CRO, GHA, PAN):
--   Ejecutar: supabase-complete-part3.sql
--   NOTA: NO ejecutar las líneas 485-540 (generador de cromos viejo)
-- =============================================
