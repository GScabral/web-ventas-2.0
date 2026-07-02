const { CajaSesion, CajaMovimiento } = require("../../db");

const getCajaActual = async (req, res) => {
    try {

        const sesion = await CajaSesion.findOne({
            where: { estado: "abierta" },
            include: [{ model: CajaMovimiento }],
            order: [["fecha_apertura", "DESC"]],
        });

        if (!sesion) {
            return res.status(200).json(null);
        }

        const movimientos = sesion.CajaMovimientos || [];

        const totalIngresos = movimientos
            .filter(m => m.tipo === "ingreso")
            .reduce((acc, m) => acc + Number(m.monto), 0);

        const totalEgresos = movimientos
            .filter(m => m.tipo === "egreso")
            .reduce((acc, m) => acc + Number(m.monto), 0);

        const saldoActual = Number(sesion.monto_inicial) + totalIngresos - totalEgresos;

        res.status(200).json({
            ...sesion.toJSON(),
            movimientos: [...movimientos].sort(
                (a, b) => new Date(b.fecha) - new Date(a.fecha)
            ),
            totalIngresos,
            totalEgresos,
            saldoActual,
        });

    } catch (error) {
        console.error("Error al obtener la caja actual:", error);
        res.status(500).json({ error: "No pudimos obtener la caja." });
    }
};

module.exports = getCajaActual;
