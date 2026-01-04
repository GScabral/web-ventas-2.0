const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'amoremioshowroomok@gmail.com',
        pass: 'z a l b s c v l l f d l x h w y'
    }
})


const enviarCorreo = async (idPedido, infoPedido, destinatario, total) => {
    try {
        const mailOption = {
            from: 'amoremioshowroomok@gmail.com',
            to: destinatario,
            subject: 'Confirmación de Pedido - Amore Mio',
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
            <p>Gracias por comprar en <strong>Tienda Online</strong>. Aquí tienes el resumen de tu pedido:</p>

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
            <p>Gracias por elegir <strong>Tienda Online</strong>.</p>
            <p><a href="mailto:amoremioshowroomok@gmail.com">amoremioshowroomok@gmail.com</a></p>
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