const { Productos, sections, variantesproductos } = require('../../db');

const getProductos = async () => {
  try {
    const productosConVariantes = await Productos.findAll({
      include: [
        {
          model: variantesproductos
        },
        {
          model: sections
        }
      ]

    },);

    const productoss = await Productos.findAll({
      include: [
        {
          model: sections,
          through: {
            attributes: []
          }
        }
      ]
    });


    const productos = productosConVariantes.map((producto) => {
      let variantesProducto = [];
      let sectionsProducto = [];

      if (producto.sections) {
        sectionsProducto = producto.sections.map(
          section => ({
            id: section.id,
            section: section.section,
            title: section.title
          })
        );
      }

      // Mapea las variantes de cada producto
      if (producto.variantesproductos) {
        variantesProducto = producto.variantesproductos.map((variante) => {
          if (variante && variante.imagenes) {
            const imagenUrls = variante.imagenes.map(imagen => `${imagen.replace(/\\/g, '/')}`);


            return {
              idVariante: variante.id_variante,
              talla: variante.talla,
              color: variante.color,
              cantidad_disponible: variante.cantidad_disponible,
              imagenes: imagenUrls
            };
          } else {
            // Si no hay imágenes, retornar un objeto vacío o manejarlo según tu lógica
            return {};
          }
        });
      }

      return {
        nombre: producto.nombre_producto,
        id: producto.id_producto,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        rama: producto.rama,
        subcategoria: producto.subcategoria,
        precio: producto.precio,

        variantes: variantesProducto,

        sections: sectionsProducto
      };
    });
    return productos;

  } catch (error) {
    console.error("Error al obtener la información de los productos:", error.message);

    if (error.original) {
      console.error("Error interno de Sequelize:", error.original);
    }
    throw error;
  }
};



module.exports = getProductos;