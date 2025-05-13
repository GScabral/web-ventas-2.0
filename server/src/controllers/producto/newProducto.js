const { Productos } = require('../../db');
const { variantesproductos } = require('../../db');

const createNewProducto = async (bodyData, files) => {
  const { nombre_producto, descripcion, precio, categoria, subcategoria, variantesData } = bodyData;




  if (!Array.isArray(variantesData)) {
    return { error: 'variantesData debe ser un array' };
  }

  try {
    // Verificar si faltan campos obligatorios
    const requiredFields = ['nombre_producto', 'descripcion', 'precio', 'categoria'];
    const missingFields = requiredFields.filter(field => !bodyData[field]);
    if (missingFields.length > 0) {
      return { error: `Faltan campos obligatorios: ${missingFields.join(', ')}` };
    }

    const newProducto = await Productos.create({
      nombre_producto,
      descripcion,
      precio,
      categoria,
      subcategoria,
    });



    for (let i = 0; i < variantesData.length; i++) {
      const { tallas, color } = variantesData[i];
      const imagenFilesKey = `variantesData[${i}][imagenFiles][0]`;

      const imagenFiles = files[imagenFilesKey];

      if (Array.isArray(imagenFiles) && imagenFiles.length > 0) {
        const imagenes = imagenFiles.map(file => file.path);

        for (let j = 0; j < tallas.length; j++) {
          const { talla, cantidad } = tallas[j];
          const nuevaVariante = await variantesproductos.create({
            talla,
            color,
            cantidad_disponible: cantidad,
            ProductoIdProducto: newProducto.id_producto,
            imagenes
          });
        }
      } else {
        console.error("Es necesario una imagen para el procuto")
      }
    }


    return { newProducto };
  } catch (error) {
    console.error("Error en la creación del producto:", error);
    return { error: 'Error en la creación del producto' };
  }
};

module.exports = createNewProducto;