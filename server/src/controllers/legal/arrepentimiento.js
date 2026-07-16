const { ConfiguracionSitio } = require("../../db");
const { enviarMail, layoutMail } = require("../../utils/mailer");

// "Botón de arrepentimiento": obligatorio para e-commerce en Argentina
// (Resolución 424/2020, Ley de Defensa del Consumidor). El cliente puede
// arrepentirse de una compra dentro de los 10 días corridos. Este
// endpoint recibe la solicitud y se la manda por mail al comercio (al
// mismo correo de notificaciones que ya usa para avisar pedidos nuevos),
// dejando registro. La gestión de la devolución la hace el comercio.
const arrepentimiento = async (req, res) => {
    try {
        const { nombre, email, numero_pedido, motivo } = req.body;

        if (!nombre || !email || !numero_pedido) {
            return res.status(400).json({
                error: "Completá nombre, email y número de pedido.",
            });
        }

        const config = await ConfiguracionSitio.findOne({ where: { id: 1 } });
        const nombreTienda = config?.nombre_tienda || "Tienda Online";
        const destino = config?.email_notificaciones;

        if (!destino) {
            // El comercio todavía no configuró un correo de notificaciones.
            // No podemos entregar la solicitud, así que lo avisamos claro.
            return res.status(503).json({
                error:
                    "La tienda todavía no tiene un correo de contacto configurado. " +
                    "Escribinos por otro medio para gestionar tu arrepentimiento.",
            });
        }

        const contenido = `
            <p><strong>Nueva solicitud de arrepentimiento de compra.</strong></p>
            <p>
                Cliente: <strong>${nombre}</strong><br />
                Email: <strong>${email}</strong><br />
                Pedido Nº: <strong>${numero_pedido}</strong>
            </p>
            ${motivo ? `<p>Motivo indicado:<br />${String(motivo).replace(/</g, "&lt;")}</p>` : ""}
            <p style="font-size:13px;color:#8a8f98;">
                Según la Ley de Defensa del Consumidor, el cliente tiene
                derecho a arrepentirse dentro de los 10 días corridos de
                recibida la compra. Contactá al cliente para coordinar la
                devolución y el reintegro.
            </p>
        `;

        await enviarMail({
            to: destino,
            subject: `Solicitud de arrepentimiento - Pedido #${numero_pedido}`,
            html: layoutMail(nombreTienda, contenido),
            replyTo: email,
        });

        return res.status(200).json({
            mensaje:
                "Recibimos tu solicitud de arrepentimiento. El comercio se va " +
                "a contactar con vos para coordinar la devolución.",
        });

    } catch (error) {
        console.error("Error en arrepentimiento:", error);
        return res.status(500).json({
            error: "No pudimos enviar tu solicitud. Probá de nuevo en un momento.",
        });
    }
};

module.exports = arrepentimiento;
