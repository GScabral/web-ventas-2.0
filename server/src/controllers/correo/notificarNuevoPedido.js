const nodemailer = require('nodemailer');
require('dotenv').config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// Aviso interno para el dueño de la tienda, no confundir con
// enviarCorreo (esa es la confirmación que recibe el CLIENTE).
// Se llama después de crear el pedido y nunca debe hacer fallar la
// creación del pedido en sí: si el email no sale (o no hay dirección
// configurada), el pedido ya quedó guardado igual, así que acá
// solo logueamos y seguimos.
const notificarNuevoPedido = async (pedido, detalles, destinatario) => {

    if (!destinatario) {
        // Nadie configuró un email de notificaciones en Personalización;
        // no es un error, simplemente no hay a quién avisarle.
        return;
    }

    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error('⚠️  No se pudo notificar el pedido nuevo: faltan EMAIL_USER/EMAIL_PASS.');
        return;
    }

    try {

        const listaProductos = detalles.map(item =>
            `<li>${item.nombre} — ${item.cantidad} unidad(es)` +
            `${item.color ? ` — Color: ${item.color}` : ''}` +
            `${item.talle ? ` — Talle: ${item.talle}` : ''}</li>`
        ).join('');

        await transporter.sendMail({
            from: EMAIL_USER,
            to: destinatario,
            subject: `🛒 Nuevo pedido #${pedido.id_pedido} — $${Number(pedido.total_pedido).toLocaleString('es-AR')}`,
            html: `
<!DOCTYPE html>
<html lang="es">
<body style="font-family: Arial, sans-serif; color: #1a1a1a; padding: 20px;">
    <h2 style="margin: 0 0 12px;">Nuevo pedido recibido</h2>

    <p style="margin: 0 0 4px;"><strong>Pedido:</strong> #${pedido.id_pedido}</p>
    <p style="margin: 0 0 4px;"><strong>Cliente:</strong> ${pedido.nombre || '—'}</p>
    <p style="margin: 0 0 4px;"><strong>Email:</strong> ${pedido.email_cliente || '—'}</p>
    <p style="margin: 0 0 4px;"><strong>Teléfono:</strong> ${pedido.telefono || '—'}</p>
    <p style="margin: 0 0 16px;"><strong>Entrega:</strong> ${pedido.tipo_entrega}</p>

    <ul style="padding-left: 18px;">
        ${listaProductos}
    </ul>

    <p style="font-size: 18px; font-weight: bold; margin-top: 16px;">
        Total: $${Number(pedido.total_pedido).toLocaleString('es-AR')}
    </p>

    <p style="margin-top: 20px; font-size: 13px; color: #777;">
        Entrá al panel de administración para gestionarlo.
    </p>
</body>
</html>
`,
        });

    } catch (error) {
        console.error('Error al notificar el pedido nuevo por correo:', error);
    }
};

module.exports = notificarNuevoPedido;
