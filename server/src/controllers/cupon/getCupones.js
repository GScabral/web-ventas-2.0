const { Cupon } = require("../../db");

const getCupones = async (req, res) => {
    try {
        const cupones = await Cupon.findAll({
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json(cupones);
    } catch (error) {
        console.error("Error al obtener cupones:", error);
        res.status(500).json({ error: "No pudimos obtener los cupones." });
    }
};

module.exports = getCupones;
