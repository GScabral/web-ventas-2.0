const nodemailer = require("nodemailer");
require("dotenv").config();

// Transporter y helper de correo compartidos, para no repetir la
// configuración de Gmail en cada controlador que manda mails (reset de
// contraseña, arrepentimiento, etc.). El mail de confirmación de pedido
// (controllers/correo/correo.js) tiene su propio transporter por
// razones históricas; los envíos nuevos usan este.
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("⚠️  Faltan EMAIL_USER y/o EMAIL_PASS: el envío de correos va a fallar.");
}

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

const enviarMail = async ({ to, subject, html, replyTo }) => {
    return transporter.sendMail({
        from: EMAIL_USER,
        to,
        subject,
        html,
        ...(replyTo ? { replyTo } : {}),
    });
};

// Envoltura HTML mínima y neutra para los correos, para que no queden
// como texto pelado. Recibe el nombre de la tienda (para el encabezado)
// y el contenido interno ya armado.
const layoutMail = (nombreTienda, contenidoHtml) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f2f3f7;font-family:Arial,Helvetica,sans-serif;color:#333;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
    <div style="background:#1c2029;color:#fff;padding:22px 25px;text-align:center;">
      <h1 style="margin:0;font-size:20px;letter-spacing:0.5px;">${nombreTienda}</h1>
    </div>
    <div style="padding:26px 30px;line-height:1.6;font-size:15px;">
      ${contenidoHtml}
    </div>
    <div style="background:#f7f9fc;color:#8a8f98;text-align:center;padding:16px;font-size:12px;">
      Este correo fue enviado automáticamente por ${nombreTienda}.
    </div>
  </div>
</body>
</html>`;

module.exports = { transporter, enviarMail, layoutMail, EMAIL_USER };
