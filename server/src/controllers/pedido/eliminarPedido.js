const {
    Pedido,
    DetallesPedido
} = require("../../db");

const eliminarPedido = async (
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

        await DetallesPedido.destroy({
            where: {
                pedidoId: id
            }
        });

        await pedido.destroy();

        res.json({
            success: true,
            message:
                "Pedido eliminado"
        });

    } catch (error) {

        console.error("Error al eliminar el pedido:", error);

        res.status(500).json({
            error: "No pudimos eliminar el pedido."
        });
    }
};

module.exports =
    eliminarPedido;