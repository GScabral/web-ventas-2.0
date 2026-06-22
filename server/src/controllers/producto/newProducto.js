const { Op } = require("sequelize");
const {
  Productos,
  sections,
  variantesproductos,
  Categorias
} = require("../../db");

const createNewProducto = async (bodyData, files) => {

  const {
    nombre_producto,
    descripcion,
    precio,
    rama,
    categoriaId,
    variantesData,
    secciones = []
  } = bodyData;

  try {

    // Validación de campos obligatorios
    const sectionTitles = {
      hero: "Hero Principal",
      trending: "Trending",
      principal: "Principal",
      featured: "Destacados",
      banner: "Banner"
    };
    const requiredFields = [
      "nombre_producto",
      "descripcion",
      "precio",
      "rama",
      "categoriaId"
    ];

    const missingFields = requiredFields.filter(
      field => !bodyData[field]
    );

    if (missingFields.length > 0) {
      return {
        error: `Faltan campos obligatorios: ${missingFields.join(", ")}`
      };
    }

    // Verificar que la categoría exista

    const categoria = await Categorias.findByPk(categoriaId);

    if (!categoria) {
      return {
        error: "La categoría seleccionada no existe"
      };
    }

    // Parsear variantes

    let variantes = variantesData;

    if (typeof variantesData === "string") {
      variantes = JSON.parse(variantesData);
    }

    if (!Array.isArray(variantes)) {
      return {
        error: "variantesData debe ser un array"
      };
    }

    // Parsear secciones

    let seccionesParsed = secciones;

    if (typeof secciones === "string") {
      seccionesParsed = JSON.parse(secciones);
    }

    // Crear producto


    const newProducto = await Productos.create({
      nombre_producto,
      descripcion,
      precio,
      rama,
      categoriaId
    });

    // Asociar secciones

    if (
      Array.isArray(seccionesParsed) &&
      seccionesParsed.length > 0
    ) {

      const existingSections =
        await sections.findAll({
          where: {
            section: {
              [Op.in]: seccionesParsed,
            },
          },
        });

      const existingNames =
        existingSections.map(
          section => section.section
        );

      const missingSections =
        seccionesParsed.filter(
          sectionName =>
            !existingNames.includes(
              sectionName
            )
        );

      let newSections = [];

      if (missingSections.length > 0) {

        newSections =
          await sections.bulkCreate(
            missingSections.map(sectionName => ({
              section: sectionName,
              title: sectionTitles[sectionName] || sectionName
            })),
            {
              returning: true,
            }
          );

      }

      await newProducto.addSections([
        ...existingSections,
        ...newSections,
      ]);
    }
    // Crear variantes

    for (let i = 0; i < variantes.length; i++) {

      const { tallas, color } = variantes[i];

      const imagen = files[i];

      if (!imagen || !imagen.path) {
        return {
          error: `Falta la imagen para la variante ${i + 1}`
        };
      }

      const imagenUrl = imagen.path;

      for (let j = 0; j < tallas.length; j++) {

        const { talla, cantidad } = tallas[j];

        await variantesproductos.create({
          talla,
          color,
          cantidad_disponible: cantidad,
          ProductoIdProducto: newProducto.id_producto,
          imagenes: [imagenUrl]
        });

      }
    }

    return {
      newProducto
    };

  } catch (error) {

    console.error(
      "Error en la creación del producto:",
      error
    );

    return {
      error: "Error en la creación del producto"
    };
  }
};

module.exports = createNewProducto;