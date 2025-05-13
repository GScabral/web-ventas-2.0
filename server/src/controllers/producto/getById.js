const { Productos } = require('../../db');
const { variantesproductos, } = require('../../db');

const productoId = async (id) => {
  try {
    const infoProducto = await Productos.findByPk(id, { include: [{ model: variantesproductos }] });



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
