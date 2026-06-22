// controllers/categorias/updateCategoria.js

const { Categorias } = require("../../db");

const updateCategoria = async (
    id_categoria,
    nombre
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

    await categoria.update({
        nombre,
        slug: nombre
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
    });

    return categoria;
};

module.exports = updateCategoria;