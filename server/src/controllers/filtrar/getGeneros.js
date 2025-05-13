const { Productos, conn } = require('../../db'); // Importa el modelo de Productos y la conexión a la base de datos

// Obtener todas las categorías únicas
const getCategoria = async () => {
  try {
    const categorias = await Productos.findAll({
      attributes: [
        [conn.fn('DISTINCT', conn.col('categoria')), 'categoria']
      ]
    });

    const categoriasUnicas = categorias.map(cat => cat.categoria);
    console.log('Categorías:', categoriasUnicas);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
  }
}

module.exports = getCategoria;