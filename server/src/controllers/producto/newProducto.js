const { Op } = require("sequelize");
const { Productos, sections, variantesproductos } = require("../../db");

const createNewProducto = async (bodyData, files) => {


  const {
    nombre_producto,
    descripcion,
    precio,
    rama,
    categoria,
    subcategoria,
    variantesData,
    secciones = []
  } = bodyData;

  try {

    // Validación de campos obligatorios

    const requiredFields = [
      "nombre_producto",
      "descripcion",
      "precio",
      "rama",
      "categoria"
    ];

    const missingFields = requiredFields.filter(
      field => !bodyData[field]
    );

    if (missingFields.length > 0) {
      return {
        error: `Faltan campos obligatorios: ${missingFields.join(", ")}`
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
      categoria,
      subcategoria
    });

    // Asociar secciones

    if (
      Array.isArray(seccionesParsed) &&
      seccionesParsed.length > 0
    ) {

      const section = await sections.findAll({
        where: {
          section: {
            [Op.in]: seccionesParsed
          }
        }
      });

      await newProducto.addSections(section);
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