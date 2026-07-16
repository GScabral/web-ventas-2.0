const { Resena } = require("../../db");

// Alternar aprobado/oculto de una reseña (moderación del admin).
const toggleResena = async (req, res) => {
    try {
        const { id } = req.params;

        const resena = await Resena.findByPk(id);
        if (!resena) {
            return res.status(404).json({ error: "La reseña no existe." });
        }

        resena.aprobado = !resena.aprobado;
        await resena.save();

        return res.json(resena);

    } catch (error) {
        console.error("Error en toggleResena:", error);
        return res.status(500).json({ error: "No pudimos actualizar la reseña." });
    }
};

// Borrar una reseña definitivamente.
const eliminarResena = async (req, res) => {
    try {
        const { id } = req.params;

        const borradas = await Resena.destroy({ where: { id_resena: id } });
        if (!borradas) {
            return res.status(404).json({ error: "La reseña no existe." });
        }

        return res.json({ mensaje: "Reseña eliminada." });

    } catch (error) {
        console.error("Error en eliminarResena:", error);
        return res.status(500).json({ error: "No pudimos eliminar la reseña." });
    }
};

module.exports = { toggleResena, eliminarResena };
