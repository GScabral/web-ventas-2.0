const nodemailer = require("nodemailer");

async function enviarCorreoEstado(email, id_pedido, estado) {
    const textos = {
        "PENDIENTE": "Tu pedido fue recibido correctamente 💖",
        "PREPARANDO": "Tu pedido está siendo preparado 🛍️",
        "LISTO": "Tu pedido está LISTO para retirar ✨",
        "ENTREGADO": "Tu pedido fue ENTREGADO ✔"
    };

    const mensaje = textos[estado] || "Actualización en tu pedido";

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'amoremioshowroomok@gmail.com',
            pass: 'z a l b s c v l l f d l x h w y'
        }
    });

    await transporter.sendMail({
        from: 'amoremioshowroomok@gmail.com',
        to: email,
        subject: `Actualización de pedido Nº ${id_pedido}`,
        html: `
      <h2>Hola 💕</h2>
      <p>${mensaje}</p>

      <p><strong>Estado actual:</strong> ${estado}</p>

      <br/>
      <p>Gracias por comprar en Amore Mio Showroom 🌸</p>
    `
    });
}



module.exports = enviarCorreoEstado;