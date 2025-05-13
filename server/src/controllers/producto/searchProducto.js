const { Op } = require('sequelize');
const { Productos } = require('../../db');
const { variantesproductos } = require('../../db');

const buscar = async (nombre,limit=10) => {
  try {
    if (!nombre) {
      throw new Error("Ingrese un nombre válido");
    }

    const findProductos = await Productos.findAll({
      where: {
        nombre_producto: {
          [Op.iLike]: `%${nombre}%` // Coincidencia parcial
        }
      },
      include: {
        model: variantesproductos,
        attributes: ['id_variante', 'talla', 'color', 'cantidad_disponible', 'imagenes'] // Solo atributos necesarios
      },
      attributes: ['id_producto', 'nombre_producto', 'descripcion', 'precio'], // Reducir carga
      limit, // Limitar resultados
    });

    const productos = findProductos.map((producto) => {
      let imagenUrls = [];

      // Mapea las variantes de cada producto
      const variantesProducto = producto.variantesproductos.map((variante) => {
        // Manejo de imágenes
        if (variante.imagenes) {
          // Si hay una sola imagen, la agregamos al array de URLs
          if (typeof variante.imagenes === 'string') {
            imagenUrls.push(`/uploads/${variante.imagenes}`);
          }
          // Si hay varias imágenes, las añadimos al array de URLs
          else if (Array.isArray(variante.imagenes) && variante.imagenes.length > 0) {
            imagenUrls = variante.imagenes.map(imagen => `${imagen.replace(/\\/g, '/')}`);
          }
          // Si el formato de imágenes no es reconocido, mostramos un error
          else {
            console.error('Formato de imagen no reconocido:', variante.imagenes);
          }
        }

        return {
          idVariante: variante.id_variante,
          talla: variante.talla,
          color: variante.color,
          cantidad_disponible: variante.cantidad_disponible,
          imagenes: imagenUrls,
        };
      });

      return {
        nombre: producto.nombre_producto,
        id: producto.id_producto,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        subcategoria:producto. subcategoria,
        precio: producto.precio,
        variantes: variantesProducto
      };
    });

    return productos;
  } catch (error) {
    console.error("Error al buscar productos:", error.message);

    if (error.original) {
      console.error("Error interno de Sequelize:", error.original);
    }
    throw error;
  }
};

module.exports = buscar;

