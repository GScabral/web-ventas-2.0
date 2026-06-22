// controllers/categorias/deleteCategoria.js

const {
  Categorias,
  Productos
} = require("../../db");

const deleteCategoria = async (
  id_categoria
) => {

  const categoria =
    await Categorias.findByPk(
      id_categoria
    );

  if (!categoria) {
    return {
      error: "Categoría no encontrada"
    };
  }

  const productos =
    await Productos.count({
      where: {
        categoriaId: id_categoria
      }
    });

  if (productos > 0) {
    return {
      error:
        "La categoría tiene productos asociados"
    };
  }

  await categoria.destroy();

  return {
    success: true
  };
};

module.exports = deleteCategoria;