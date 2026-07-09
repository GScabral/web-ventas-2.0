const { Pedido } = require("../../db");

// A diferencia de getPedidoById (que requiere token de admin y devuelve
// todo, incluidos datos personales), este endpoint es público — lo usan
// las pantallas de pago-exitoso/fallido/pendiente para mostrar el estado
// real sin exponer teléfono, dirección, etc. a cualquiera que adivine un
// número de pedido en la URL.
const getEstadoPublico = async (req, res) => {
    try {

        const { id } = req.params;

        const pedido = await Pedido.findByPk(id, {
            attributes: ["id_pedido", "estado", "total_pedido", "metodo_pago", "nombre"],
        });

        if (!pedido) {
            return res.status(404).json({ error: "No encontramos ese pedido." });
        }

        res.json({
            id_pedido: pedido.id_pedido,
            estado: pedido.estado,
            total_pedido: pedido.total_pedido,
            metodo_pago: pedido.metodo_pago,
            nombre: pedido.nombre,
        });

    } catch (error) {
        console.error("Error al obtener el estado del pedido:", error);
        res.status(500).json({ error: "No pudimos consultar el pedido." });
    }
};

module.exports = getEstadoPublico;
