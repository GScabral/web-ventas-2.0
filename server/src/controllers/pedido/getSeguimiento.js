const { Pedido, DetallesPedido } = require("../../db");

// Seguimiento de pedido para quien compró SIN cuenta (invitado). Pide
// número de pedido + email y solo devuelve los datos si el email
// coincide con el del pedido — así, adivinar un número de pedido en la
// URL no alcanza para ver los datos de otra persona (a diferencia de
// getEstadoPublico, que da menos campos justamente por ser sin email).
const getSeguimiento = async (req, res) => {
    try {
        const { id, email } = req.body;

        if (!id || !email) {
            return res.status(400).json({ error: "Ingresá el número de pedido y tu email." });
        }

        const pedido = await Pedido.findByPk(id, {
            include: [DetallesPedido],
        });

        // Mismo mensaje si no existe el pedido o si el email no coincide:
        // no confirmamos "existe el pedido pero el email está mal" (eso
        // filtraría qué números de pedido son válidos).
        const emailCoincide =
            pedido &&
            String(pedido.email_cliente).trim().toLowerCase() ===
                String(email).trim().toLowerCase();

        if (!pedido || !emailCoincide) {
            return res.status(404).json({
                error: "No encontramos un pedido con ese número y ese email.",
            });
        }

        return res.json({
            id_pedido: pedido.id_pedido,
            fecha_pedido: pedido.fecha_pedido,
            estado: pedido.estado,
            tipo_entrega: pedido.tipo_entrega,
            medio_envio: pedido.medio_envio,
            total_pedido: pedido.total_pedido,
            numero_seguimiento: pedido.numero_seguimiento,
            transportista: pedido.transportista,
            datos_cadete: pedido.datos_cadete,
            productos: (pedido.DetallesPedidos || []).map((d) => ({
                nombre: d.nombre,
                cantidad: d.cantidad,
                color: d.color,
                talle: d.talle,
            })),
        });

    } catch (error) {
        console.error("Error en getSeguimiento:", error);
        return res.status(500).json({ error: "No pudimos consultar el pedido." });
    }
};

module.exports = getSeguimiento;
