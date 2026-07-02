const { Cupon } = require("../../db");

const toggleCupon = async (req, res) => {
    try {
        const { id } = req.params;

        const cupon = await Cupon.findByPk(id);

        if (!cupon) {
            return res.status(404).json({ error: "Cupón no encontrado." });
        }

        cupon.activo = !cupon.activo;
        await cupon.save();

        res.status(200).json(cupon);

    } catch (error) {
        console.error("Error al cambiar estado del cupón:", error);
        res.status(500).json({ error: "No pudimos actualizar el cupón." });
    }
};

module.exports = toggleCupon;
