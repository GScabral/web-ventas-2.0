const { Productos } = require('../../db');
const { variantesproductos, } = require('../../db');

const productoId = async (id) => {
  try {
    // "order" acá es lo que faltaba para que la variante/imagen que se ve
    // como principal en el detalle sea SIEMPRE la misma que en la grilla
    // (getProducto.js, el otro lugar que arma esta misma lista, hace el
    // include sin "order" también — Postgres no garantiza ningún orden
    // para las filas de un include sin ORDER BY explícito, así que las
    // dos consultas podían devolver la primera variante en un orden
    // distinto). Ordenar por id_variante ascendente en los dos lugares
    // dejan siempre la misma variante (y por lo tanto la misma imagen)
    // como "la primera".
    const infoProducto = await Productos.findByPk(id, {
      include: [{ model: variantesproductos }],
      order: [[variantesproductos, "id_variante", "ASC"]],
    });



    if (!infoProducto) {
      throw new Error("Producto no encontrado");
    }


    let variantesProducto = [];

    if (infoProducto.variantesproductos && infoProducto.variantesproductos.length > 0) {
      variantesProducto = infoProducto.variantesproductos.map(variante => {
        const imagenesUrl = variante.imagenes.map(imagen => `${imagen.replace(/\\/g, '/')}`);
        return {
          idVariante: variante.id_variante,
          talla: variante.talla,
          color: variante.color,
          cantidad_disponible: variante.cantidad_disponible,
          imagenes: imagenesUrl
        };
      });
    }

    return {
      nombre: infoProducto.nombre_producto,
      id: infoProducto.id_producto,
      descripcion: infoProducto.descripcion,
      categoria: infoProducto.categoria,
      precio: infoProducto.precio,
      variantes: variantesProducto
    };
  } catch (error) {
    console.error("Error al obtener la información del producto:", error.message);

    if (error.original) {
      console.error("Error interno de Sequelize:", error.original);
    }
    throw error;
  }
};
module.exports = productoId;
