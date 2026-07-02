const { Cupon } = require("../../db");

const eliminarCupon = async (req, res) => {
    try {
        const { id } = req.params;

        const cupon = await Cupon.findByPk(id);

        if (!cupon) {
            return res.status(404).json({ error: "Cupón no encontrado." });
        }

        await cupon.destroy();

        res.status(200).json({ mensaje: "Cupón eliminado." });

    } catch (error) {
        console.error("Error al eliminar cupón:", error);
        res.status(500).json({ error: "No pudimos eliminar el cupón." });
    }
};

module.exports = eliminarCupon;
