const { CajaSesion, CajaMovimiento } = require("../../db");

const cerrarCaja = async (req, res) => {
    try {

        const sesion = await CajaSesion.findOne({
            where: { estado: "abierta" },
            include: [{ model: CajaMovimiento }],
        });

        if (!sesion) {
            return res.status(400).json({ error: "No hay ninguna caja abierta para cerrar." });
        }

        const { monto_contado, notas } = req.body;

        const montoContadoNumerico = Number(monto_contado);

        if (isNaN(montoContadoNumerico) || montoContadoNumerico < 0) {
            return res.status(400).json({
                error: "El monto contado tiene que ser un número mayor o igual a 0."
            });
        }

        const movimientos = sesion.CajaMovimientos || [];

        const totalIngresos = movimientos
            .filter(m => m.tipo === "ingreso")
            .reduce((acc, m) => acc + Number(m.monto), 0);

        const totalEgresos = movimientos
            .filter(m => m.tipo === "egreso")
            .reduce((acc, m) => acc + Number(m.monto), 0);

        const montoEsperado = Number(sesion.monto_inicial) + totalIngresos - totalEgresos;
        const diferencia = montoContadoNumerico - montoEsperado;

        await sesion.update({
            estado: "cerrada",
            fecha_cierre: new Date(),
            monto_final_esperado: montoEsperado,
            monto_final_contado: montoContadoNumerico,
            diferencia,
            notas_cierre: notas || null,
        });

        res.status(200).json(sesion);

    } catch (error) {
        console.error("Error al cerrar caja:", error);
        res.status(500).json({ error: "No pudimos cerrar la caja." });
    }
};

module.exports = cerrarCaja;
