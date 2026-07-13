const { Productos, variantesproductos } = require("../../db");

// Tallas/colores disponibles y precio máximo del catálogo activo, para
// que el sidebar de filtros sepa qué opciones mostrar SIN tener que
// descargar el catálogo completo (con imágenes y todo) sólo para leer
// tres datos. Se pide una sola vez al montar el filtro, no en cada
// cambio de página/filtro.
const getFacetas = async () => {
  const variantes = await variantesproductos.findAll({
    attributes: ["talla", "color"],
    include: [
      {
        model: Productos,
        where: { archivado: false },
        attributes: []
      }
    ]
  });

  const tallasSet = new Set();
  const coloresSet = new Set();

  variantes.forEach((variante) => {
    if (variante.talla) tallasSet.add(variante.talla);
    if (variante.color) coloresSet.add(variante.color);
  });

  const precioMaximo = await Productos.max("precio", {
    where: { archivado: false }
  });

  return {
    tallas: Array.from(tallasSet),
    colores: Array.from(coloresSet),
    precioMaximo: precioMaximo || 0
  };
};

module.exports = getFacetas;
