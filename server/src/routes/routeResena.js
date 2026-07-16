const { Router } = require("express");
const rateLimit = require("express-rate-limit");

const crearResena = require("../controllers/resena/crearResena");
const getResenasProducto = require("../controllers/resena/getResenasProducto");
const getResenasAdmin = require("../controllers/resena/getResenasAdmin");
const { toggleResena, eliminarResena } = require("../controllers/resena/moderarResena");
const { verificarTokenAdmin } = require("../middleware/auth");

const router = Router();

// Limita cuántas reseñas se pueden dejar seguidas desde una misma IP,
// para frenar spam de reseñas falsas.
const resenaLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Demasiadas reseñas. Probá de nuevo en unos minutos." },
});

// Públicas
router.get("/producto/:id", getResenasProducto);
router.post("/", resenaLimiter, crearResena);

// Admin (moderación) — la lista completa tiene que ir antes que nada
// que pueda chocar, pero acá no hay conflicto de rutas.
router.get("/admin", verificarTokenAdmin, getResenasAdmin);
router.put("/:id/toggle", verificarTokenAdmin, toggleResena);
router.delete("/:id", verificarTokenAdmin, eliminarResena);

module.exports = router;
