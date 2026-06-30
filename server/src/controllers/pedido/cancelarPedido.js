const { Pedido } = require("../../db");

const cancelarPedido = async (
    req,
    res
) => {
    try {

        const { id } = req.params;

        const pedido =
            await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({
                error: "Pedido no encontrado"
            });
        }

        pedido.estado =
            "cancelado";

        await pedido.save();

        res.json({
            success: true,
            pedido
        });

    } catch (error) {

        console.error("Error al cancelar el pedido:", error);

        res.status(500).json({
            error: "No pudimos cancelar el pedido."
        });
    }
};

module.exports =
    cancelarPedido;