const { Pedido, CajaSesion, CajaMovimiento } = require("../../db");

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
        let cajaInfo = {
            registrado: false,
            motivo: null,
        };

        if (
            estado === "entregado" &&
            metodo_pago &&
            !pedido.registrado_en_caja
        ) {

            const sesionAbierta = await CajaSesion.findOne({
                where: { estado: "abierta" },
            });

            if (!sesionAbierta) {
                cajaInfo.motivo = "No hay ninguna caja abierta en este momento.";
            } else {

                await CajaMovimiento.create({
                    tipo: "ingreso",
                    concepto: `Pedido #${pedido.id_pedido}${pedido.nombre ? ` - ${pedido.nombre}` : ""}`,
                    monto: pedido.total_pedido,
                    metodo_pago,
                    CajaSesionId: sesionAbierta.id_sesion,
                });

                pedido.registrado_en_caja = true;
                cajaInfo.registrado = true;
            }
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
