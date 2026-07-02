const { CajaSesion } = require("../../db");

const abrirCaja = async (req, res) => {
    try {

        const sesionAbierta = await CajaSesion.findOne({
            where: { estado: "abierta" },
        });

        if (sesionAbierta) {
            return res.status(400).json({
                error: "Ya hay una caja abierta. Cerrala antes de abrir una nueva."
            });
        }

        const { monto_inicial, notas } = req.body;

        const montoInicialNumerico = Number(monto_inicial);

        if (isNaN(montoInicialNumerico) || montoInicialNumerico < 0) {
            return res.status(400).json({
                error: "El monto inicial tiene que ser un número mayor o igual a 0."
            });
        }

        const nuevaSesion = await CajaSesion.create({
            monto_inicial: montoInicialNumerico,
            notas_apertura: notas || null,
            estado: "abierta",
        });

        res.status(201).json(nuevaSesion);

    } catch (error) {
        console.error("Error al abrir caja:", error);
        res.status(500).json({ error: "No pudimos abrir la caja." });
    }
};

module.exports = abrirCaja;
