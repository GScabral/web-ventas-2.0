const { Router } = require("express");
const { Testimonio } = require("../db");
const { verificarTokenAdmin } = require("../middleware/auth");

const router = Router();

// Pública: la usa la sección "testimonios" de la Home. Solo activos,
// ordenados como los dejó el admin.
router.get("/activos", async (req, res) => {
    try {
        const testimonios = await Testimonio.findAll({
            where: { activo: true },
            order: [["orden", "ASC"], ["id_testimonio", "ASC"]],
        });
        res.status(200).json(testimonios);
    } catch (error) {
        console.error("Error al obtener testimonios:", error);
        res.status(500).json({ error: "No pudimos obtener los testimonios." });
    }
});

router.get("/", verificarTokenAdmin, async (req, res) => {
    try {
        const testimonios = await Testimonio.findAll({
            order: [["orden", "ASC"], ["id_testimonio", "ASC"]],
        });
        res.status(200).json(testimonios);
    } catch (error) {
        res.status(500).json({ error: "No pudimos obtener los testimonios." });
    }
});

router.post("/", verificarTokenAdmin, async (req, res) => {
    try {
        const { nombre, texto, imagen, calificacion, orden, activo } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ error: "Ingresá el nombre del cliente." });
        }

        if (!texto || !texto.trim()) {
            return res.status(400).json({ error: "Ingresá el texto del testimonio." });
        }

        const nuevo = await Testimonio.create({
            nombre: nombre.trim(),
            texto: texto.trim(),
            imagen: imagen || null,
            calificacion: calificacion !== undefined ? Number(calificacion) : 5,
            orden: orden !== undefined ? Number(orden) : 0,
            activo: activo !== undefined ? Boolean(activo) : true,
        });

        res.status(201).json(nuevo);

    } catch (error) {
        console.error("Error al crear testimonio:", error);
        res.status(500).json({ error: "No pudimos crear el testimonio." });
    }
});

router.put("/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const testimonio = await Testimonio.findByPk(req.params.id);

        if (!testimonio) {
            return res.status(404).json({ error: "No encontramos ese testimonio." });
        }

        const { nombre, texto, imagen, calificacion, orden, activo } = req.body;

        if (nombre !== undefined) testimonio.nombre = nombre.trim();
        if (texto !== undefined) testimonio.texto = texto.trim();
        if (imagen !== undefined) testimonio.imagen = imagen || null;
        if (calificacion !== undefined) testimonio.calificacion = Number(calificacion);
        if (orden !== undefined) testimonio.orden = Number(orden);
        if (activo !== undefined) testimonio.activo = Boolean(activo);

        await testimonio.save();

        res.status(200).json(testimonio);

    } catch (error) {
        console.error("Error al actualizar testimonio:", error);
        res.status(500).json({ error: "No pudimos actualizar el testimonio." });
    }
});

router.delete("/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const testimonio = await Testimonio.findByPk(req.params.id);

        if (!testimonio) {
            return res.status(404).json({ error: "No encontramos ese testimonio." });
        }

        await testimonio.destroy();

        res.status(200).json({ mensaje: "Testimonio eliminado." });

    } catch (error) {
        console.error("Error al eliminar testimonio:", error);
        res.status(500).json({ error: "No pudimos eliminar el testimonio." });
    }
});

module.exports = router;
