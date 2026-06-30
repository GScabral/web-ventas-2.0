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

        console.error("Error al obtener los pedidos:", error);

        res.status(500).json({
            error: "No pudimos obtener los pedidos."
        });
    }
};

module.exports = getPedidos;