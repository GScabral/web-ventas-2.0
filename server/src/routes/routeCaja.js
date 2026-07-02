const { Router } = require("express");

const abrirCaja = require("../controllers/caja/abrirCaja");
const getCajaActual = require("../controllers/caja/getCajaActual");
const agregarMovimiento = require("../controllers/caja/agregarMovimiento");
const cerrarCaja = require("../controllers/caja/cerrarCaja");
const getHistorialCajas = require("../controllers/caja/getHistorialCajas");
const { verificarTokenAdmin } = require("../middleware/auth");

const router = Router();

router.use(verificarTokenAdmin);

router.get("/actual", getCajaActual);
router.post("/abrir", abrirCaja);
router.post("/movimiento", agregarMovimiento);
router.post("/cerrar", cerrarCaja);
router.get("/historial", getHistorialCajas);

module.exports = router;
