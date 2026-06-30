const { Router } = require("express");
const getBanners = require("../controllers/banner/getBanners");
const getBannersActivos = require("../controllers/banner/getBannersActivos");
const crearBanner = require("../controllers/banner/crearBanner");
const actualizarBanner = require("../controllers/banner/actualizarBanner");
const eliminarBanner = require("../controllers/banner/eliminarBanner");
const { verificarTokenAdmin } = require("../middleware/auth");

const router = Router();

// Pública: lo que ve la tienda, solo banners activos y vigentes.
router.get("/activos", async (req, res) => {
    try {
        const banners = await getBannersActivos();
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ error: "No pudimos obtener los banners." });
    }
});

// Admin: listado completo, incluyendo inactivos/vencidos, para gestionar.
router.get("/", verificarTokenAdmin, async (req, res) => {
    try {
        const banners = await getBanners();
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ error: "No pudimos obtener los banners." });
    }
});

router.post("/", verificarTokenAdmin, async (req, res) => {
    try {
        const nuevoBanner = await crearBanner(req.body);
        res.status(201).json(nuevoBanner);
    } catch (error) {
        res.status(400).json({ error: error.message || "No pudimos crear el banner." });
    }
});

router.put("/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const banner = await actualizarBanner(req.params.id, req.body);
        res.status(200).json(banner);
    } catch (error) {
        res.status(400).json({ error: error.message || "No pudimos actualizar el banner." });
    }
});

router.delete("/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const resultado = await eliminarBanner(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message || "No pudimos eliminar el banner." });
    }
});

module.exports = router;
