const nodemailer = require('nodemailer');
require('dotenv').config();
const { ConfiguracionSitio } = require('../../db');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const obtenerNombreTienda = async () => {
    try {
        const configuracion = await ConfiguracionSitio.findOne({ where: { id: 1 } });
        return configuracion?.nombre_tienda || 'Tienda Online';
    } catch (error) {
        return 'Tienda Online';
    }
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// Aviso al CLIENTE de que su pedido salió/está en camino. Se llama
// desde pedido/actualizarEstado.js justo cuando el estado pasa a
// "enviado". El contenido cambia según el medio de envío: por correo
// se muestra número de seguimiento + transportista (si el admin los
// cargó), por moto se muestran los datos del cadete en vez de un
// tracking (no tiene sentido rastrear una entrega directa del mismo
// día). Igual que el resto de los mails de este proyecto, un fallo acá
// nunca debe hacer fallar el cambio de estado en sí: solo se loguea.
const avisoEnvio = async (pedido) => {

    if (!pedido.email_cliente) {
        return;
    }

    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error('⚠️  No se pudo avisar el envío del pedido: faltan EMAIL_USER/EMAIL_PASS.');
        return;
    }

    try {
        const nombreTienda = await obtenerNombreTienda();

        const esMoto = pedido.medio_envio === 'moto';

        const bloqueEnvio = esMoto
            ? `
    <div style="background:#f7f9fc;border:1px solid #e2e6ee;border-radius:10px;padding:16px 20px;margin-top:16px;">
        <p style="margin:0 0 4px;"><strong>Envío por moto/cadete</strong></p>
        <p style="margin:0;">Tu pedido llega hoy mismo dentro de la ciudad.</p>
        ${pedido.datos_cadete ? `<p style="margin:8px 0 0;"><strong>Datos del cadete:</strong> ${pedido.datos_cadete}</p>` : ''}
    </div>`
            : `
    <div style="background:#f7f9fc;border:1px solid #e2e6ee;border-radius:10px;padding:16px 20px;margin-top:16px;">
        <p style="margin:0 0 4px;"><strong>Envío por correo</strong></p>
        ${pedido.transportista ? `<p style="margin:0 0 4px;"><strong>Transportista:</strong> ${pedido.transportista}</p>` : ''}
        ${pedido.numero_seguimiento ? `<p style="margin:0;"><strong>Número de seguimiento:</strong> ${pedido.numero_seguimiento}</p>` : '<p style="margin:0;">Todavía no se cargó un número de seguimiento para este envío.</p>'}
    </div>`;

        await transporter.sendMail({
            from: EMAIL_USER,
            to: pedido.email_cliente,
            subject: `📦 Tu pedido #${pedido.id_pedido} está en camino — ${nombreTienda}`,
            html: `
<!DOCTYPE html>
<html lang="es">
<body style="font-family: Arial, sans-serif; color: #1a1a1a; padding: 20px;">
    <h2 style="margin: 0 0 12px;">¡Tu pedido salió!</h2>

    <p style="margin: 0 0 4px;">Hola ${pedido.nombre || ''},</p>
    <p style="margin: 0 0 4px;">Tu pedido <strong>#${pedido.id_pedido}</strong> de <strong>${nombreTienda}</strong> ya está en camino.</p>

    ${bloqueEnvio}

    <p style="margin-top: 20px; font-size: 13px; color: #777;">
        Ante cualquier duda, estamos a tu disposición.
    </p>
</body>
</html>
`,
        });

    } catch (error) {
        console.error('Error al enviar el aviso de envío por correo:', error);
    }
};

module.exports = avisoEnvio;
