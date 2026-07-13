-- Fusiona categorías duplicadas (mismo rubro, nombre distinto).
-- Ejecutar en pgAdmin → Query Tool, contra la base de producción.
--
-- Antes de correr nada: los nombres de tabla usados acá ("Categorias",
-- "Productos") son los que genera Sequelize a partir de los nombres de
-- los modelos (server/src/models/categorias.js y productos.js). Si al
-- correr el PASO 0 te tira "relation does not exist", avisame el error
-- exacto y te doy los nombres corregidos — es información que Sequelize
-- decide en tiempo de arranque y no tengo forma de confirmar sin acceso
-- directo a la base.

-- ============================================================
-- PASO 0 — Verificación (no cambia nada, solo mostrar los datos)
-- ============================================================
SELECT id_categoria, nombre, slug FROM "Categorias" ORDER BY id_categoria;


-- ============================================================
-- CASO 1 — "Pantalon" (id 2, sin productos) y "Pantalones" (id 5, con
-- productos) son la misma categoría con dos nombres. Este es el caso
-- que señalaste en el informe.
-- ============================================================

-- Por las dudas alguno haya quedado cargado con la categoría vieja,
-- reasigna cualquier producto de "Pantalon" (id 2) a "Pantalones" (id 5)
-- antes de borrar la fila vieja:
UPDATE "Productos" SET "categoriaId" = 5 WHERE "categoriaId" = 2;

DELETE FROM "Categorias" WHERE id_categoria = 2;


-- ============================================================
-- CASO 2 — Encontrado de yapa revisando la tabla de categorías (no
-- estaba en el listado original de 20 puntos): "remera deportiva " (id
-- 1, nombre con espacio de sobra y en minúscula, sin productos) y
-- "Remeras" (id 4, con productos) tienen la misma pinta de duplicado
-- que el caso de los pantalones — probablemente una categoría de
-- prueba de antes de cargar el catálogo de demo definitivo. Revisá el
-- PASO 0 antes de correr esto: si "remera deportiva" la usás a
-- propósito como algo DISTINTO de "Remeras" (por ejemplo, una
-- subcategoría específica), no corras este bloque.
-- ============================================================

UPDATE "Productos" SET "categoriaId" = 4 WHERE "categoriaId" = 1;

DELETE FROM "Categorias" WHERE id_categoria = 1;


-- ============================================================
-- Nota aparte: "Tops" (id 3) no tiene ningún producto cargado hoy.
-- No es un duplicado de nada, así que no se toca acá — queda para que
-- decidas si la usás más adelante o la borrás vos mismo.
-- ============================================================

-- Verificación final: debería quedar Accesorios, Camperas, Pantalones,
-- Remeras, Tops, Vestidos, Zapatillas (7 categorías).
SELECT id_categoria, nombre, slug FROM "Categorias" ORDER BY id_categoria;
