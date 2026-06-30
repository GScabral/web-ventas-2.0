const { Pedido } = require("../../db");

const actualizarEstado = async (
    req,
    res
) => {
    try {

        const { id } = req.params;

        const { estado } = req.body;

        const pedido =
            await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({
                error: "Pedido no encontrado"
            });
        }

        pedido.estado = estado;

        await pedido.save();

        res.json({
            success: true,
            pedido
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