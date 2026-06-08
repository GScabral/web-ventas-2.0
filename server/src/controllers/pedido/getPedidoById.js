const { Pedido, DetallesPedido } = require("../../db");

const getPedidoById = async (
    req,
    res
) => {
    try {

        const { id } = req.params;

        const pedido =
            await Pedido.findByPk(id, {
                include: [DetallesPedido]
            });

        if (!pedido) {
            return res.status(404).json({
                error: "Pedido no encontrado"
            });
        }

        res.json(pedido);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = getPedidoById;