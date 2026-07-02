const { Router } = require("express");

const crearCupon = require("../controllers/cupon/crearCupon");
const getCupones = require("../controllers/cupon/getCupones");
const eliminarCupon = require("../controllers/cupon/eliminarCupon");
const toggleCupon = require("../controllers/cupon/toggleCupon");
const validarCupon = require("../controllers/cupon/validarCupon");
const { verificarTokenAdmin } = require("../middleware/auth");

const router = Router();

// Pública: el cliente escribe el código en el checkout y esto le
// confirma si es válido y cuánto descuenta, ANTES de confirmar el
// pedido. La validación real (la que de verdad descuenta el total)
// se vuelve a hacer del lado del servidor al crear el pedido —
// esto es solo una previsualización, nunca la fuente de verdad.
router.post("/validar", async (req, res) => {
    try {
        const { codigo, subtotal } = req.body;

        const resultado = await validarCupon(codigo, Number(subtotal) || 0);

        if (!resultado.valido) {
            return res.status(400).json({ error: resultado.motivo });
        }

        res.status(200).json({
            codigo: resultado.cupon.codigo,
            tipo: resultado.cupon.tipo,
            valor: resultado.cupon.valor,
            descuento: resultado.descuento,
        });

    } catch (error) {
        console.error("Error al validar cupón:", error);
        res.status(500).json({ error: "No pudimos validar el cupón." });
    }
});

router.get("/", verificarTokenAdmin, getCupones);
router.post("/", verificarTokenAdmin, crearCupon);
router.put("/:id/toggle", verificarTokenAdmin, toggleCupon);
router.delete("/:id", verificarTokenAdmin, eliminarCupon);

module.exports = router;
