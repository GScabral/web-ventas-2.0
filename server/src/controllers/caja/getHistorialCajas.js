const { CajaSesion, CajaMovimiento } = require("../../db");

const getHistorialCajas = async (req, res) => {
    try {

        const sesiones = await CajaSesion.findAll({
            where: { estado: "cerrada" },
            include: [{ model: CajaMovimiento }],
            order: [["fecha_cierre", "DESC"]],
            limit: 50,
        });

        res.status(200).json(sesiones);

    } catch (error) {
        console.error("Error al obtener el historial de cajas:", error);
        res.status(500).json({ error: "No pudimos obtener el historial." });
    }
};

module.exports = getHistorialCajas;
