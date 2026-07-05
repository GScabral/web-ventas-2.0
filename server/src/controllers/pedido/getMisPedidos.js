const { Pedido, DetallesPedido, Cliente } = require("../../db");

// Historial de pedidos del cliente logueado. Los pedidos no tienen una
// relación real (FK) contra Cliente hoy — newPedido.js los crea solo
// con el email en texto plano (compra como invitado) — así que la
// forma de encontrar "los pedidos de este cliente" es por correo:
// buscamos el correo del cliente autenticado (a partir del id que
// viene en el token) y after eso buscamos pedidos con ese mismo
// email_cliente.
const getMisPedidos = async (req, res) => {
    try {

        const cliente = await Cliente.findByPk(req.user.userId, {
            attributes: ["correo"],
        });

        if (!cliente) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        const pedidos = await Pedido.findAll({
            where: { email_cliente: cliente.correo },
            include: [DetallesPedido],
            order: [["fecha_pedido", "DESC"]],
        });

        res.json(pedidos);

    } catch (error) {

        console.error("Error al obtener mis pedidos:", error);

        res.status(500).json({
            error: "No pudimos obtener tu historial de pedidos."
        });
    }
};

module.exports = getMisPedidos;
