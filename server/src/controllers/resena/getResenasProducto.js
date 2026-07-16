const { Resena } = require("../../db");

// Reseñas públicas (solo aprobadas) de un producto, de la más nueva a la
// más vieja, más el promedio y la cantidad para mostrar el resumen de
// estrellas arriba de la lista.
const getResenasProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const resenas = await Resena.findAll({
            where: { producto_id: id, aprobado: true },
            order: [["createdAt", "DESC"]],
            attributes: ["id_resena", "nombre", "calificacion", "comentario", "createdAt"],
        });

        const cantidad = resenas.length;
        const promedio = cantidad
            ? resenas.reduce((acc, r) => acc + r.calificacion, 0) / cantidad
            : 0;

        return res.json({
            cantidad,
            promedio: Math.round(promedio * 10) / 10, // 1 decimal
            resenas,
        });

    } catch (error) {
        console.error("Error en getResenasProducto:", error);
        return res.status(500).json({ error: "No pudimos cargar las reseñas." });
    }
};

module.exports = getResenasProducto;
