const { Router } = require("express");
const { ZonaEnvioMoto } = require("../db");
const calcularCostoMoto = require("../controllers/costoEnvio/calcularCostoMoto");
const { verificarTokenAdmin } = require("../middleware/auth");

const router = Router();

// Pública: el checkout la usa para saber qué ciudades tienen envío
// por moto disponible (así puede mostrar/ocultar la opción sin pegarle
// al backend en cada tecla).
router.get("/", async (req, res) => {
    try {
        const zonas = await ZonaEnvioMoto.findAll({
            where: { activo: true },
            order: [["ciudad", "ASC"]],
        });
        res.status(200).json(zonas);
    } catch (error) {
        console.error("Error al obtener zonas de envío por moto:", error);
        res.status(500).json({ error: "No pudimos obtener las zonas de envío por moto." });
    }
});

// Pública también: usada por el checkout justo antes de confirmar,
// para mostrar el costo ya calculado sin que el navegador tenga que
// hacer el match él mismo.
router.get("/calcular/:ciudad", async (req, res) => {
    try {
        const resultado = await calcularCostoMoto(req.params.ciudad);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: "No pudimos calcular el costo de envío por moto." });
    }
});

router.get("/todos", verificarTokenAdmin, async (req, res) => {
    try {
        const zonas = await ZonaEnvioMoto.findAll({ order: [["ciudad", "ASC"]] });
        res.status(200).json(zonas);
    } catch (error) {
        res.status(500).json({ error: "No pudimos obtener las zonas de envío por moto." });
    }
});

router.post("/", verificarTokenAdmin, async (req, res) => {
    try {
        const { ciudad, costo } = req.body;

        if (!ciudad || !ciudad.trim()) {
            return res.status(400).json({ error: "Ingresá el nombre de la ciudad." });
        }

        const costoNumerico = Number(costo);

        if (isNaN(costoNumerico) || costoNumerico < 0) {
            return res.status(400).json({ error: "El costo tiene que ser un número mayor o igual a 0." });
        }

        const nueva = await ZonaEnvioMoto.create({
            ciudad: ciudad.trim(),
            costo: costoNumerico,
        });

        res.status(201).json(nueva);

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: "Ya cargaste una zona de moto para esa ciudad." });
        }
        console.error("Error al crear zona de envío por moto:", error);
        res.status(500).json({ error: "No pudimos crear la zona de envío por moto." });
    }
});

router.put("/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const zona = await ZonaEnvioMoto.findByPk(req.params.id);

        if (!zona) {
            return res.status(404).json({ error: "No encontramos esa zona de envío por moto." });
        }

        const { costo, activo } = req.body;

        if (costo !== undefined) {
            const costoNumerico = Number(costo);
            if (isNaN(costoNumerico) || costoNumerico < 0) {
                return res.status(400).json({ error: "El costo tiene que ser un número mayor o igual a 0." });
            }
            zona.costo = costoNumerico;
        }

        if (activo !== undefined) {
            zona.activo = Boolean(activo);
        }

        await zona.save();

        res.status(200).json(zona);

    } catch (error) {
        console.error("Error al actualizar zona de envío por moto:", error);
        res.status(500).json({ error: "No pudimos actualizar la zona de envío por moto." });
    }
});

router.delete("/:id", verificarTokenAdmin, async (req, res) => {
    try {
        const zona = await ZonaEnvioMoto.findByPk(req.params.id);

        if (!zona) {
            return res.status(404).json({ error: "No encontramos esa zona de envío por moto." });
        }

        await zona.destroy();

        res.status(200).json({ mensaje: "Zona de envío por moto eliminada." });

    } catch (error) {
        console.error("Error al eliminar zona de envío por moto:", error);
        res.status(500).json({ error: "No pudimos eliminar la zona de envío por moto." });
    }
});

module.exports = router;
