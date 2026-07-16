const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const arrepentimiento = require("../controllers/legal/arrepentimiento");

const router = Router();

// Limita el envío del formulario de arrepentimiento para que no se use
// para spamear el correo del comercio.
const arrepentimientoLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Demasiados envíos. Probá de nuevo en unos minutos." },
});

router.post("/arrepentimiento", arrepentimientoLimiter, arrepentimiento);

module.exports = router;
