// controllers/categorias/createCategoria.js

const { Categorias } = require("../../db");

const createCategoria = async (nombre) => {

    try {

        const existe = await Categorias.findOne({
            where: {
                nombre
            }
        });

        if (existe) {
            return {
                error: "La categoría ya existe"
            };
        }

        const categoria = await Categorias.create({
            nombre,
            slug: nombre
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-")
        });

        return categoria;

    } catch (error) {

        console.error(error);

        return {
            error: "Error al crear la categoría"
        };
    }
};

module.exports = createCategoria;