const { Router } = require("express");
const { CostoEnvio } = require("../db");
const calcularCostoEnvio = require("../controllers/costoEnvio/calcularCostoEnvio");
const { verificarTokenAdmin } = require("../middleware/auth");

const router = Router();

// Pública: el checkout la usa para mostrar el costo antes de
// confirmar. Devuelve todos los activos, el frontend hace el match
// por provincia (así no hay que pegarle al backend en cada tecla).
router.get("/", async (req, res) => {
    try {
        const costos = await CostoEnvio.findAll({
            where: { activo: true },
            order: [["provincia", "ASC"]],
        });
        res.status(200).json(costos);
    } catch (error) {
        console.error("Error al obtener costos de envío:", error);
        res.status(500).json({ error: "No pudimos obtener los costos de envío." });
    }
});

// Público también: usado por el checkout justo antes de confirmar,
// para mostrar el costo ya calculado sin que el navegador tenga que
// hacer el match él mismo.
router.get("/calcular/:provincia", async (req, res) => {
    try {
        const resultado = await calcularCostoEnvio(req.params.provincia);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: "No pudimos calcular el costo de envío." });
    }
});

router.get("/todos", verificarTokenAdmin, async (req, res) => {
    try {
        const costos = await CostoEnvio.findAll({ order: [["provincia", "ASC"]] });
        res.status(200).json(costos);
    } catch (error) {
        res.status(500).json({ error: "No pudimos obtener los costos de envío." });
    }
});

router.post("/", verificarTokenAdmin, async (req, res) => {
    try {
        const { provincia, costo } = req.body;

        if (!provincia || !provincia.trim()) {
            return res.status(400).json({ error: "Ingresá el nombre de la provincia." });
        }

        const costoNumerico = Number(costo);

        if (isNaN(costoNumerico) || costoNumerico < 0) {
            return res.status(400).json({ error: "El costo tiene que ser un número mayor o igual a 0." });
        }

        const nuevo = await CostoEnvio.create({
            provincia: provincia.trim(),
            costo: costoNumerico,
        });

        res.status(201).json(nuevo);

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: "Ya cargaste un costo de envío para esa provincia." });
        }
        console.error("Error al crear costo de envío:", error);
        res.status(500).json({ error: "No pudimos crear el costo de envío." });
    }
});

router.put("/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const costoEnvio = await CostoEnvio.findByPk(req.params.id);

        if (!costoEnvio) {
            return res.status(404).json({ error: "No encontramos ese costo de envío." });
        }

        const { costo, activo } = req.body;

        if (costo !== undefined) {
            const costoNumerico = Number(costo);
            if (isNaN(costoNumerico) || costoNumerico < 0) {
                return res.status(400).json({ error: "El costo tiene que ser un número mayor o igual a 0." });
            }
            costoEnvio.costo = costoNumerico;
        }

        if (activo !== undefined) {
            costoEnvio.activo = Boolean(activo);
        }

        await costoEnvio.save();

        res.status(200).json(costoEnvio);

    } catch (error) {
        console.error("Error al actualizar costo de envío:", error);
        res.status(500).json({ error: "No pudimos actualizar el costo de envío." });
    }
});

router.delete("/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const costoEnvio = await CostoEnvio.findByPk(req.params.id);

        if (!costoEnvio) {
            return res.status(404).json({ error: "No encontramos ese costo de envío." });
        }

        await costoEnvio.destroy();

        res.status(200).json({ mensaje: "Costo de envío eliminado." });

    } catch (error) {
        console.error("Error al eliminar costo de envío:", error);
        res.status(500).json({ error: "No pudimos eliminar el costo de envío." });
    }
});

module.exports = router;
