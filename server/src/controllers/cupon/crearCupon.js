const { Cupon } = require("../../db");

const crearCupon = async (req, res) => {
    try {

        const {
            codigo,
            tipo,
            valor,
            fecha_inicio,
            fecha_fin,
            usos_maximos,
            monto_minimo,
        } = req.body;

        if (!codigo || !codigo.trim()) {
            return res.status(400).json({ error: "El código es obligatorio." });
        }

        if (!["porcentaje", "fijo"].includes(tipo)) {
            return res.status(400).json({ error: "El tipo debe ser 'porcentaje' o 'fijo'." });
        }

        const valorNumerico = Number(valor);

        if (!valorNumerico || valorNumerico <= 0) {
            return res.status(400).json({ error: "El valor del descuento debe ser mayor a 0." });
        }

        if (tipo === "porcentaje" && valorNumerico > 100) {
            return res.status(400).json({ error: "Un descuento porcentual no puede ser mayor a 100." });
        }

        const codigoNormalizado = codigo.trim().toUpperCase();

        const yaExiste = await Cupon.findOne({ where: { codigo: codigoNormalizado } });

        if (yaExiste) {
            return res.status(400).json({ error: `Ya existe un cupón con el código "${codigoNormalizado}".` });
        }

        const nuevoCupon = await Cupon.create({
            codigo: codigoNormalizado,
            tipo,
            valor: valorNumerico,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null,
            usos_maximos: usos_maximos || null,
            monto_minimo: monto_minimo || null,
        });

        res.status(201).json(nuevoCupon);

    } catch (error) {
        console.error("Error al crear cupón:", error);
        res.status(500).json({ error: "No pudimos crear el cupón." });
    }
};

module.exports = crearCupon;
