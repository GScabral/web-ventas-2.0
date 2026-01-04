const { Router } = require("express");
const crearPedido = require("../controllers/pedido/newPedido");
const getPedidos = require("../controllers/pedido/getPedidos")
const createPreference = require("../controllers/mp/mp");
const despacharDetalle = require("../controllers/pedido/despacharPedido")
const enviarCorreoEstado = require("../controllers/correo/correoEstado")
const { DetallesPedido,Pedido } = require("../db")
const router = Router();

router.post("/nuevoPedido", async (req, res) => {
    try {
        const nuevoPedido = await crearPedido(req.body);

        console.log(nuevoPedido)
        if (nuevoPedido.success === false) {
            res.status(400).json({ error: nuevoPedido.error });
        } else {
            res.status(200).json({ success: true, message: nuevoPedido.message, id_pedido: nuevoPedido.id_pedido }); // Enviar también el número de pedido al cliente
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Enviar el mensaje de error específico
    }
});

router.get("/Lpedidos", async (req, res) => {
    try {
        const pedido = await getPedidos();
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ error: "error al obtener el pedido" })
    }
})

router.put("/pedidos/:pedidoId/detalle/:detalleId", async (req, res) => {
    const { pedidoId, detalleId } = req.params;
    const { estado } = req.body;

    try {
        const detalle = await DetallesPedido.findOne({
            where: {
                id_detalle_pedido: detalleId,
                PedidoIdPedido: pedidoId   // ← CORRECTO
            }
        });

        if (!detalle) return res.status(404).json({ error: "Detalle no encontrado" });

        detalle.estado_pedido = estado;
        await detalle.save();

        res.json({ message: "Estado actualizado correctamente", detalle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar estado" });
    }
});

router.put("/pedidos/estado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const pedido = await Pedido.findByPk(id, { include: DetallesPedido });

        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });

        pedido.estado_general = estado;
        await pedido.save();

        // === ENVIAR CORREO ===
        await enviarCorreoEstado(
            pedido.email_cliente,
            pedido.id_pedido,
            estado
        );

        res.json({ message: "Estado actualizado y correo enviado", pedido });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar estado" });
    }
});



router.post("/mp", async (req, res) => {
    try {
        const preference = await createPreference(req.body);

        console.log(preference)
        if (preference.success === false) {
            res.status(400).json({ error: preference.error });
        } else {
            res.status(200).json({ success: true, message: preference.message, id: preference.id });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/despachar/:idDetalle', despacharDetalle);


module.exports = router;