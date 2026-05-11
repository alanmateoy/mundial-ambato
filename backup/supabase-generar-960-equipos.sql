-- =============================================
-- MUNDIAL AMBATO 2026 - GENERACIÓN DE 960 CROMOS DE EQUIPOS
-- =============================================
-- EJECUTAR DESPUÉS de:
--   1. supabase-schema-final.sql
--   2. supabase-data-final.sql (selecciones + intro + museo = 20 cromos)
--   3. Archivos de jugadores (supabase-complete.sql + part2 + part3)
--
-- Este archivo genera los 960 cromos de equipos (21-980):
--   48 escudos + 48 fotos + 864 jugadores = 960
--   + 20 previos (intro + museo) = 980 TOTAL
-- =============================================

-- Función auxiliar para determinar el grupo basado en orden_album
CREATE OR REPLACE FUNCTION get_grupo_seccion(p_orden INT) RETURNS VARCHAR(10) AS $$
BEGIN
  RETURN 'grupo_' || CASE
    WHEN p_orden BETWEEN 1  AND 4  THEN 'a'
    WHEN p_orden BETWEEN 5  AND 8  THEN 'b'
    WHEN p_orden BETWEEN 9  AND 12 THEN 'c'
    WHEN p_orden BETWEEN 13 AND 16 THEN 'd'
    WHEN p_orden BETWEEN 17 AND 20 THEN 'e'
    WHEN p_orden BETWEEN 21 AND 24 THEN 'f'
    WHEN p_orden BETWEEN 25 AND 28 THEN 'g'
    WHEN p_orden BETWEEN 29 AND 32 THEN 'h'
    WHEN p_orden BETWEEN 33 AND 36 THEN 'i'
    WHEN p_orden BETWEEN 37 AND 40 THEN 'j'
    WHEN p_orden BETWEEN 41 AND 44 THEN 'k'
    ELSE 'l'
  END;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- GENERACIÓN AUTOMÁTICA DE 960 CROMOS DE EQUIPOS
-- =============================================
-- Cada equipo tiene 20 cromos:
--   Cromo 1: Escudo (foil, rareza 3)
--   Cromo 2: Foto grupal del equipo (rareza 2)
--   Cromos 3-20: 18 jugadores (rareza 1)
--
-- Numeración:
--   Equipo con orden_album = N:
--     base = 20 + (N - 1) * 20
--     Escudo     = base + 1
--     Foto       = base + 2
--     Jugadores  = base + 3 ... base + 20
--
-- Ejemplo:
--   México (orden_album=1): cromos 21-40
--   Sudáfrica (orden_album=2): cromos 41-60
--   ...
--   Panamá (orden_album=48): cromos 961-980
-- =============================================

DO $$
DECLARE
  sel RECORD;
  base_num INT;
  jug RECORD;
  jug_counter INT;
  grupo_sec VARCHAR(10);
BEGIN
  -- Recorrer cada selección en orden del álbum
  FOR sel IN 
    SELECT id, orden_album, nombre, codigo_fifa 
    FROM selecciones 
    WHERE orden_album IS NOT NULL
    ORDER BY orden_album 
  LOOP
    -- Calcular número base para este equipo
    base_num := 20 + (sel.orden_album - 1) * 20;
    grupo_sec := get_grupo_seccion(sel.orden_album);
    
    -- ===== CROMO 1: ESCUDO OFICIAL (foil) =====
    INSERT INTO cromos (numero_cromo, seleccion_id, tipo, descripcion, seccion, rareza, es_foil)
    VALUES (
      base_num + 1,
      sel.id,
      'escudo',
      'Escudo oficial de ' || sel.nombre,
      grupo_sec,
      3,
      true
    ) ON CONFLICT (numero_cromo) DO NOTHING;
    
    -- ===== CROMO 2: FOTO DE EQUIPO =====
    INSERT INTO cromos (numero_cromo, seleccion_id, tipo, descripcion, seccion, rareza, es_foil)
    VALUES (
      base_num + 2,
      sel.id,
      'foto_equipo',
      'Foto oficial del equipo ' || sel.nombre,
      grupo_sec,
      2,
      false
    ) ON CONFLICT (numero_cromo) DO NOTHING;
    
    -- ===== CROMOS 3-20: 18 JUGADORES =====
    -- Selecciona los 18 mejores jugadores del equipo
    -- Orden: titulares/estrellas primero, luego por posición (GK, DEF, MID, FWD)
    jug_counter := 0;
    FOR jug IN 
      SELECT j.id, j.nombre, j.apellido, j.posicion
      FROM jugadores j 
      WHERE j.seleccion_id = sel.id 
      ORDER BY 
        j.es_titular DESC NULLS LAST,  -- Titulares primero
        CASE j.posicion
          WHEN 'Portero' THEN 1
          WHEN 'Defensor' THEN 2
          WHEN 'Centrocampista' THEN 3
          WHEN 'Delantero' THEN 4
          ELSE 5
        END,
        j.id
      LIMIT 18 
    LOOP
      jug_counter := jug_counter + 1;
      INSERT INTO cromos (numero_cromo, jugador_id, seleccion_id, tipo, descripcion, seccion, rareza, es_foil)
      VALUES (
        base_num + 2 + jug_counter,
        jug.id,
        sel.id,
        'normal',
        jug.nombre || ' ' || jug.apellido || ' (' || sel.nombre || ')',
        grupo_sec,
        1,
        false
      ) ON CONFLICT (numero_cromo) DO NOTHING;
    END LOOP;
    
    -- Si el equipo tiene menos de 18 jugadores registrados, completar con placeholders
    WHILE jug_counter < 18 LOOP
      jug_counter := jug_counter + 1;
      INSERT INTO cromos (numero_cromo, seleccion_id, tipo, descripcion, seccion, rareza)
      VALUES (
        base_num + 2 + jug_counter,
        sel.id,
        'normal',
        'Jugador ' || jug_counter || ' de ' || sel.nombre || ' (por confirmar)',
        grupo_sec,
        1
      ) ON CONFLICT (numero_cromo) DO NOTHING;
    END LOOP;
    
    -- Log de progreso
    RAISE NOTICE 'Equipo % (%) completado: cromos % a %', 
      sel.nombre, sel.codigo_fifa, base_num + 1, base_num + 20;
    
  END LOOP;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Generación completada!';
  RAISE NOTICE '========================================';
END $$;

-- =============================================
-- VERIFICACIÓN FINAL - EJECUTAR ESTAS QUERIES
-- =============================================

-- 1. Total de cromos (DEBE SER 980):
SELECT COUNT(*) as total_cromos FROM cromos;

-- 2. Distribución por tipo:
SELECT tipo, COUNT(*) as cantidad 
FROM cromos 
GROUP BY tipo 
ORDER BY 
  CASE tipo
    WHEN 'introduccion' THEN 1
    WHEN 'museo_fifa' THEN 2
    WHEN 'escudo' THEN 3
    WHEN 'foto_equipo' THEN 4
    WHEN 'normal' THEN 5
  END;
-- Esperado:
--   introduccion = 9
--   museo_fifa   = 11
--   escudo       = 48
--   foto_equipo  = 48
--   normal       = 864
--   TOTAL        = 980

-- 3. Rango de números (debe ser 1 a 980 sin huecos):
SELECT 
  MIN(numero_cromo) as primer_cromo, 
  MAX(numero_cromo) as ultimo_cromo,
  COUNT(DISTINCT numero_cromo) as numeros_unicos
FROM cromos;

-- 4. Cromos por equipo (todos deben tener 20):
SELECT s.nombre, s.grupo, COUNT(c.id) as total_cromos
FROM selecciones s
LEFT JOIN cromos c ON c.seleccion_id = s.id
WHERE s.orden_album IS NOT NULL
GROUP BY s.nombre, s.grupo, s.orden_album
ORDER BY s.orden_album;

-- 5. Verificar que no haya placeholders (jugadores por confirmar):
SELECT COUNT(*) as placeholders 
FROM cromos 
WHERE descripcion LIKE '%por confirmar%';

-- 6. Cromos de introducción:
SELECT numero_cromo, descripcion FROM cromos WHERE tipo = 'introduccion' ORDER BY numero_cromo;

-- 7. Cromos del museo:
SELECT numero_cromo, descripcion FROM cromos WHERE tipo = 'museo_fifa' ORDER BY numero_cromo;

-- 8. Primer y último equipo:
SELECT numero_cromo, descripcion, tipo 
FROM cromos 
WHERE numero_cromo BETWEEN 21 AND 40 
ORDER BY numero_cromo;
-- (Debe mostrar México: escudo, foto, 18 jugadores)

SELECT numero_cromo, descripcion, tipo 
FROM cromos 
WHERE numero_cromo BETWEEN 961 AND 980 
ORDER BY numero_cromo;
-- (Debe mostrar Panamá: escudo, foto, 18 jugadores)

-- Limpiar función auxiliar
DROP FUNCTION IF EXISTS get_grupo_seccion(INT);
