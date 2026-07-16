const { Resena, Productos } = require("../../db");

// Todas las reseñas (aprobadas u ocultas) para la moderación del admin,
// con el nombre del producto al que pertenecen.
const getResenasAdmin = async (req, res) => {
    try {
        const resenas = await Resena.findAll({
            order: [["createdAt", "DESC"]],
            include: [{
                model: Productos,
                attributes: ["id_producto", "nombre_producto"],
            }],
        });

        return res.json(resenas);

    } catch (error) {
        console.error("Error en getResenasAdmin:", error);
        return res.status(500).json({ error: "No pudimos cargar las reseñas." });
    }
};

module.exports = getResenasAdmin;
