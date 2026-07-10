const nodemailer = require('nodemailer')
require('dotenv').config()
const { ConfiguracionSitio } = require('../../db');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Antes decía "Amore Mio" fijo en el asunto y el cuerpo del mail — quedó
// pegado de una tienda anterior que usó este mismo código. Ahora toma el
// nombre real configurado en Personalización (mismo dato que ya usan
// Nav/Footer/ThemeLoader del lado del frontend), así este archivo sirve
// para cualquier tienda que use este código sin tocar nada acá.
const obtenerNombreTienda = async () => {
    try {
        const configuracion = await ConfiguracionSitio.findOne({ where: { id: 1 } });
        return configuracion?.nombre_tienda || 'Tienda Online';
    } catch (error) {
        return 'Tienda Online';
    }
};

if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('⚠️  Faltan EMAIL_USER y/o EMAIL_PASS en las variables de entorno. El envío de correos va a fallar.');
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
})


const enviarCorreo = async (idPedido, infoPedido, destinatario, total) => {
    try {
        const nombreTienda = await obtenerNombreTienda();

        const mailOption = {
            from: EMAIL_USER,
            to: destinatario,
            subject: `Confirmación de Pedido - ${nombreTienda}`,
            html: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pedido</title>

    <style>
        body {
            background-color: #f2f3f7;
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .container {
            max-width: 650px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: #4a6cf7;
            color: #ffffff;
            padding: 25px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 26px;
            letter-spacing: 1px;
        }

        .content {
            padding: 25px 30px;
        }

        .content p {
            line-height: 1.6;
            font-size: 15px;
        }

        .order-box {
            background: #f7f9fc;
            border: 1px solid #e2e6ee;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
        }

        .order-box h2 {
            color: #4a6cf7;
            margin: 0 0 10px 0;
            font-size: 20px;
        }

        ul {
            padding: 0;
            margin: 15px 0 0 0;
            list-style: none;
        }

        li {
            padding: 12px 0;
            border-bottom: 1px solid #e1e1e1;
        }

        li:last-child {
            border-bottom: none;
        }

        .item-title {
            font-weight: bold;
            color: #333;
        }

        .total {
            margin-top: 20px;
            font-size: 20px;
            font-weight: bold;
            color: #4a6cf7;
        }

        .footer {
            background: #1f1f1f;
            color: #cfcfcf;
            text-align: center;
            padding: 20px;
            margin-top: 25px;
            font-size: 13px;
        }

        .footer a {
            color: #4a6cf7;
            text-decoration: none;
            font-weight: bold;
        }

    </style>
</head>

<body>
    <div class="container">

        <div class="header">
            <h1>¡Tu pedido está confirmado!</h1>
        </div>

        <div class="content">
            <p>Hola,</p>
            <p>Gracias por comprar en <strong>${nombreTienda}</strong>. Aquí tienes el resumen de tu pedido:</p>

            <div class="order-box">
                <h2>Pedido Nº: ${idPedido}</h2>

                <ul>
                    ${infoPedido.map(item => `
                        <li>
                            <div class="item-title">${item.nombre}</div>
                            Cantidad: ${item.cantidad}<br>
                            Color: ${item.color}<br>
                            Talla: ${item.talla}
                        </li>
                    `).join('')}
                </ul>

                <p class="total">Total abonado: $${total}</p>
            </div>

            <p>Si tienes alguna duda, estamos a tu disposición.</p>

        </div>

        <div class="footer">
            <p>Gracias por elegir <strong>${nombreTienda}</strong>.</p>
            <p><a href="mailto:${EMAIL_USER}">${EMAIL_USER}</a></p>
        </div>

    </div>
</body>
</html>
`
        };

        const info = await transporter.sendMail(mailOption);
        console.log('Correo enviado:', info.response);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw error;
    }
};

module.exports = enviarCorreo;