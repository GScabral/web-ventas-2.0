const { Router } = require("express");
const { verificarTokenAdmin } = require("../middleware/auth");

const getLayoutHomePublicado = require("../controllers/layoutHome/getLayoutHomePublicado");
const getLayoutHomeBorrador = require("../controllers/layoutHome/getLayoutHomeBorrador");
const actualizarLayoutHomeBorrador = require("../controllers/layoutHome/actualizarLayoutHomeBorrador");
const publicarLayoutHome = require("../controllers/layoutHome/publicarLayoutHome");
const aplicarPlantilla = require("../controllers/layoutHome/aplicarPlantilla");
const guardarPlantillaPersonalizada = require("../controllers/layoutHome/guardarPlantillaPersonalizada");
const eliminarPlantillaPersonalizada = require("../controllers/layoutHome/eliminarPlantillaPersonalizada");

const router = Router();

// Pública: la lee el Home real de la tienda.
router.get("/", async (req, res) => {
    try {
        const layout = await getLayoutHomePublicado();
        res.status(200).json(layout);
    } catch (error) {
        console.error("Error al obtener el layout de la home:", error);
        res.status(500).json({ error: "No pudimos obtener el diseño de la página." });
    }
});

// Admin: la usa el editor de Diseño y la vista previa.
router.get("/borrador", verificarTokenAdmin, async (req, res) => {
    try {
        const layout = await getLayoutHomeBorrador();
        res.status(200).json(layout);
    } catch (error) {
        console.error("Error al obtener el borrador del layout:", error);
        res.status(500).json({ error: "No pudimos obtener el borrador del diseño." });
    }
});

router.put("/borrador", verificarTokenAdmin, async (req, res) => {
    try {
        const resultado = await actualizarLayoutHomeBorrador(req.body.secciones);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message || "No pudimos guardar el borrador." });
    }
});

router.post("/publicar", verificarTokenAdmin, async (req, res) => {
    try {
        const resultado = await publicarLayoutHome();
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message || "No pudimos publicar los cambios." });
    }
});

router.post("/plantilla", verificarTokenAdmin, async (req, res) => {
    try {
        const resultado = await aplicarPlantilla(req.body.plantilla);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message || "No pudimos aplicar la plantilla." });
    }
});

router.post("/plantilla-personalizada", verificarTokenAdmin, async (req, res) => {
    try {
        const plantillas = await guardarPlantillaPersonalizada(req.body.nombre);
        res.status(201).json(plantillas);
    } catch (error) {
        res.status(400).json({ error: error.message || "No pudimos guardar la plantilla." });
    }
});

router.delete("/plantilla-personalizada/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const plantillas = await eliminarPlantillaPersonalizada(req.params.id);
        res.status(200).json(plantillas);
    } catch (error) {
        res.status(400).json({ error: error.message || "No pudimos eliminar la plantilla." });
    }
});

module.exports = router;
