const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user: 'amoremioshowroomok@gmail.com',
        pass: 'z a l b s c v l l f d l x h w y'
    }
})


const enviarCorreo = async (idPedido, infoPedido, destinatario) => {
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
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f9;
                            color: #333;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #f25c54;
                            color: #ffffff;
                            text-align: center;
                            padding: 20px;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content p {
                            margin: 10px 0;
                        }
                        .order-details {
                            background-color: #f9f9f9;
                            border-radius: 8px;
                            padding: 15px;
                            margin-top: 15px;
                        }
                        .order-details ul {
                            list-style: none;
                            padding: 0;
                            margin: 0;
                        }
                        .order-details li {
                            border-bottom: 1px solid #eaeaea;
                            padding: 10px 0;
                        }
                        .order-details li:last-child {
                            border-bottom: none;
                        }
                        .order-details strong {
                            color: #f25c54;
                        }
                        .footer {
                            text-align: center;
                            background-color: #333;
                            color: #fff;
                            padding: 15px;
                            font-size: 12px;
                        }
                        .footer a {
                            color: #f25c54;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>¡Tu Pedido Está Confirmado!</h1>
                        </div>
                        <div class="content">
                            <p>Hola,</p>
                            <p>Gracias por tu compra en <strong>Amore Mio</strong>. Aquí están los detalles de tu pedido:</p>
                            <div class="order-details">
                                <p><strong>Número de Pedido:</strong> ${idPedido}</p>
                                <p><strong>Productos:</strong></p>
                                <ul>
                                    ${infoPedido.map(item => `
                                        <li>
                                            <strong>Nombre:</strong> ${item.nombre}<br>
                                            <strong>Cantidad:</strong> ${item.cantidad}<br>
                                            <strong>Color:</strong> ${item.color}
                                        </li>
                                    `).join('')}
                                </ul>
                                <p><strong>TOTAL: $${infoPedido[0].total}</strong></p>
                            </div>
                            <p>Si tienes alguna duda, no dudes en contactarnos.</p>
                        </div>
                        <div class="footer">
                            <p>Gracias por elegirnos.</p>
                            <p>Equipo <strong>Amore Mio</strong></p>
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