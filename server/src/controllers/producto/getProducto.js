const {
  Productos,
  sections,
  variantesproductos,
  Categorias
} = require("../../db");

const getProductos = async () => {
  try {

    const productosConVariantes = await Productos.findAll({
      where: { archivado: false },
      include: [
        {
          model: variantesproductos
        },
        {
          model: sections,
          through: {
            attributes: []
          }
        },
        {
          model: Categorias
        }
      ],
      // Mismo criterio que getById.js: sin esto, Postgres no garantiza
      // en qué orden vienen las variantes de cada producto, así que la
      // "primera" variante (y su primera imagen, la que se usa como
      // imagen principal en la grilla) podía no coincidir con la que
      // mostraba el detalle del producto.
      order: [[variantesproductos, "id_variante", "ASC"]],
    });

    const productos = productosConVariantes.map((producto) => {

      let variantesProducto = [];
      let sectionsProducto = [];

      // Secciones

      if (producto.sections) {
        sectionsProducto = producto.sections.map(
          (section) => ({
            id: section.id,
            section: section.section,
            title: section.title
          })
        );
      }

      // Variantes

      if (producto.variantesproductos) {

        variantesProducto =
          producto.variantesproductos.map(
            (variante) => {

              const imagenUrls =
                variante.imagenes?.map(
                  (imagen) =>
                    imagen.replace(/\\/g, "/")
                ) || [];

              return {
                idVariante: variante.id_variante,
                talla: variante.talla,
                color: variante.color,
                cantidad_disponible:
                  variante.cantidad_disponible,
                imagenes: imagenUrls
              };
            }
          );
      }

      return {
        id: producto.id_producto,
        nombre: producto.nombre_producto,
        descripcion: producto.descripcion,
        precio: producto.precio,
        rama: producto.rama,

        categoria: producto.Categoria
          ? {
            id: producto.Categoria.id_categoria,
            nombre: producto.Categoria.nombre,
            slug: producto.Categoria.slug
          }
          : null,

        variantes: variantesProducto,

        sections: sectionsProducto
      };
    });

    return productos;

  } catch (error) {

    console.error(
      "Error al obtener la información de los productos:",
      error.message
    );

    if (error.original) {
      console.error(
        "Error interno de Sequelize:",
        error.original
      );
    }

    throw error;
  }
};

module.exports = getProductos;