-- ============================================================
-- Migración manual: Sistema completo de envíos
-- (correo con tracking + moto/cadete + envío gratis por monto)
--
-- Correr esto UNA SOLA VEZ contra la base de producción, después
-- de deployar el código nuevo. La tabla ZonaEnvioMotos NO hace
-- falta crearla acá: Sequelize la crea sola al arrancar el
-- servidor (conn.sync solo NO altera tablas existentes, pero SÍ
-- crea las que faltan).
--
-- Si el nombre real de alguna tabla no coincide (por ejemplo si
-- Sequelize la creó en minúscula o distinto), correr antes:
--   \dt
-- en psql para confirmar el nombre exacto y ajustar acá.
-- ============================================================

-- 1) Nuevas columnas en Pedidos
ALTER TABLE "Pedidos"
  ADD COLUMN IF NOT EXISTS "numero_seguimiento" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "transportista" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "datos_cadete" VARCHAR(255);

-- El ENUM de medio_envio necesita crear el tipo antes de poder
-- usarlo en la columna (esto es lo único un poco más largo de un
-- ALTER TABLE normal, por cómo Postgres maneja los ENUM).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Pedidos_medio_envio') THEN
    CREATE TYPE "enum_Pedidos_medio_envio" AS ENUM ('correo', 'moto');
  END IF;
END$$;

ALTER TABLE "Pedidos"
  ADD COLUMN IF NOT EXISTS "medio_envio" "enum_Pedidos_medio_envio";

-- 2) Nueva columna en ConfiguracionSitios
ALTER TABLE "ConfiguracionSitios"
  ADD COLUMN IF NOT EXISTS "envio_gratis_desde" DOUBLE PRECISION;

-- ============================================================
-- Nada más que correr a mano. La tabla "ZonaEnvioMotos" (ciudad,
-- costo, activo) se crea sola la primera vez que arranque el
-- servidor con el código nuevo desplegado.
-- ============================================================
