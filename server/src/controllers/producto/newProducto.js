const { Productos } = require('../../db');
const { variantesproductos } = require('../../db');

const createNewProducto = async (bodyData, files) => {
  const {
    nombre_producto,
    descripcion,
    precio,
    categoria,
    subcategoria,
    variantesData
  } = bodyData;

  try {
    // Validación de campos obligatorios
    const requiredFields = ['nombre_producto', 'descripcion', 'precio', 'categoria'];
    const missingFields = requiredFields.filter(field => !bodyData[field]);
    if (missingFields.length > 0) {
      return { error: `Faltan campos obligatorios: ${missingFields.join(', ')}` };
    }

    // Parsear variantesData si viene como string
    let variantes = variantesData;
    if (typeof variantesData === 'string') {
      variantes = JSON.parse(variantesData);
    }

    if (!Array.isArray(variantes)) {
      return { error: 'variantesData debe ser un array' };
    }

    // Crear el producto
    const newProducto = await Productos.create({
      nombre_producto,
      descripcion,
      precio,
      categoria,
      subcategoria,
    });

    // Asociar variantes
    for (let i = 0; i < variantes.length; i++) {
      const { tallas, color } = variantes[i];

      const imagen = files[i]; // Se espera que las imágenes estén en el mismo orden
      if (!imagen || !imagen.path) {
        return { error: `Falta la imagen para la variante ${i + 1}` };
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

    return { newProducto };
  } catch (error) {
    console.error("Error en la creación del producto:", error);
    return { error: 'Error en la creación del producto' };
  }
};

module.exports = createNewProducto;
