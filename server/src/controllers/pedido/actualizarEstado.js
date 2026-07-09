const { Pedido } = require("../../db");
const registrarIngresoPedido = require("../caja/registrarIngresoPedido");

const actualizarEstado = async (
    req,
    res
) => {
    try {

        const { id } = req.params;

        const { estado, metodo_pago } = req.body;

        const pedido =
            await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({
                error: "Pedido no encontrado"
            });
        }

        pedido.estado = estado;

        // Integración con Caja: si el pedido pasa a "entregado" y el
        // admin eligió un método de pago, se registra el ingreso solo
        // (así no hace falta cargarlo dos veces a mano). No rompe nada
        // si no hay caja abierta o si ya se había registrado antes —
        // en esos casos el pedido igual cambia de estado con normalidad.
        // (Los pedidos pagados por Mercado Pago ya se registran solos
        // apenas se confirma el pago, ver mp/webhook.js — acá cubrimos
        // el resto: efectivo, transferencia, etc.)
        let cajaInfo = {
            registrado: false,
            motivo: null,
        };

        if (
            estado === "entregado" &&
            metodo_pago &&
            !pedido.registrado_en_caja
        ) {
            cajaInfo = await registrarIngresoPedido(pedido, metodo_pago);
        }

        await pedido.save();

        res.json({
            success: true,
            pedido,
            caja: cajaInfo,
        });

    } catch (error) {

        console.error("Error al actualizar el estado del pedido:", error);

        res.status(500).json({
            error: "No pudimos actualizar el estado del pedido."
        });
    }
};

module.exports =
    actualizarEstado;
