const { Pedido } = require("../../db");
const registrarIngresoPedido = require("../caja/registrarIngresoPedido");
const avisoEnvio = require("../correo/avisoEnvio");

const actualizarEstado = async (
    req,
    res
) => {
    try {

        const { id } = req.params;

        const {
            estado,
            metodo_pago,
            numero_seguimiento,
            transportista,
            datos_cadete,
        } = req.body;

        const pedido =
            await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({
                error: "Pedido no encontrado"
            });
        }

        // Se guarda si el pedido recién ahora está pasando a "enviado"
        // (y no ya lo estaba), para no reenviar el mail de aviso cada
        // vez que el admin edita el número de seguimiento después.
        const yaEstabaEnviado = pedido.estado === "enviado";

        pedido.estado = estado;

        if (numero_seguimiento !== undefined) {
            pedido.numero_seguimiento = numero_seguimiento || null;
        }

        if (transportista !== undefined) {
            pedido.transportista = transportista || null;
        }

        if (datos_cadete !== undefined) {
            pedido.datos_cadete = datos_cadete || null;
        }

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

        // Aviso al cliente de que su pedido salió, solo la primera vez
        // que pasa a "enviado" (no en cada edición posterior del
        // tracking). Igual que el resto de los mails, un fallo acá no
        // debe romper la respuesta: el estado ya quedó bien guardado.
        if (estado === "enviado" && !yaEstabaEnviado) {
            try {
                await avisoEnvio(pedido);
            } catch (errorCorreo) {
                console.error("No se pudo enviar el aviso de envío:", errorCorreo);
            }
        }

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
