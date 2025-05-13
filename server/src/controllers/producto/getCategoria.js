const { Productos } = require('../../db');

const getCat = async (categoria, subcategoria) => {
  try {
    // Obtener todos los productos con la categoría proporcionada
    const exist = await Productos.findAll({ where: { categoria , subcategoria} });

    // Filtrar las nuevas categorías que no existen en la base de datos
    const newCategories = categoria.filter(cat => !exist.find(product => product.categoria === cat));

    // Guardar las nuevas categorías en la base de datos
    const nuevasCategorias = await Promise.all(
      newCategories.map(async (newCat) => {
        const createdCategory = await Productos.create({ categoria: newCat });
        return createdCategory;
      })
    );

    return nuevasCategorias;
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener o guardar las categorías:', error);
    throw error;
  }
};


module.exports= getCat;