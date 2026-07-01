const { Router } = require("express");
const getConfiguracion = require("../controllers/configuracion/getConfiguracion");
const actualizarConfiguracion = require("../controllers/configuracion/actualizarConfiguracion");
const { verificarTokenAdmin } = require("../middleware/auth");

const router = Router();

// Pública: cualquier visitante del sitio necesita esto para pintar
// los colores de marca (se pide una vez al cargar la página).
router.get("/", async (req, res) => {
    try {
        const configuracion = await getConfiguracion();
        res.status(200).json(configuracion);
    } catch (error) {
        console.error("Error al obtener la configuración:", error);
        res.status(500).json({ error: "No pudimos obtener la configuración del sitio." });
    }
});

// Admin: cambiar nombre de tienda y colores desde el panel.
router.put("/", verificarTokenAdmin, async (req, res) => {
    try {
        const configuracion = await actualizarConfiguracion(req.body);
        res.status(200).json(configuracion);
    } catch (error) {
        res.status(400).json({ error: error.message || "No pudimos guardar la configuración." });
    }
});

module.exports = router;
