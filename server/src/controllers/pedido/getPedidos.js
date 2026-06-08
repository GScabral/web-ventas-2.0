const { Pedido, DetallesPedido } = require("../../db");

const getPedidos = async (req, res) => {
    try {

        const pedidos =
            await Pedido.findAll({
                include: [DetallesPedido],

                order: [
                    ["fecha_pedido", "DESC"]
                ]
            });

        res.json(pedidos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = getPedidos;