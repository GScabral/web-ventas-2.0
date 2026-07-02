const { CajaSesion, CajaMovimiento } = require("../../db");

const agregarMovimiento = async (req, res) => {
    try {

        const sesion = await CajaSesion.findOne({
            where: { estado: "abierta" },
        });

        if (!sesion) {
            return res.status(400).json({
                error: "No hay ninguna caja abierta. Abrí una caja antes de registrar movimientos."
            });
        }

        const { tipo, concepto, monto } = req.body;

        if (!["ingreso", "egreso"].includes(tipo)) {
            return res.status(400).json({ error: "El tipo debe ser 'ingreso' o 'egreso'." });
        }

        if (!concepto || !concepto.trim()) {
            return res.status(400).json({ error: "Escribí un concepto para el movimiento." });
        }

        const montoNumerico = Number(monto);

        if (isNaN(montoNumerico) || montoNumerico <= 0) {
            return res.status(400).json({ error: "El monto tiene que ser mayor a 0." });
        }

        const movimiento = await CajaMovimiento.create({
            tipo,
            concepto: concepto.trim(),
            monto: montoNumerico,
            CajaSesionId: sesion.id_sesion,
        });

        res.status(201).json(movimiento);

    } catch (error) {
        console.error("Error al agregar movimiento de caja:", error);
        res.status(500).json({ error: "No pudimos registrar el movimiento." });
    }
};

module.exports = agregarMovimiento;
