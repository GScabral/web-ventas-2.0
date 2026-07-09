const { MercadoPagoConfig, Payment } = require('mercadopago');
const crypto = require('crypto');
const dotenv = require('dotenv');
const { Pedido } = require('../../db');
const enviarCorreo = require('../correo/correo');
const registrarIngresoPedido = require('../caja/registrarIngresoPedido');

dotenv.config();

const client = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN,
});

// Valida el header x-signature que manda Mercado Pago, siguiendo el
// algoritmo documentado por ellos: HMAC-SHA256 de "id:{data.id};request-id:
// {x-request-id};ts:{ts};" usando el secret del webhook (Panel de MP →
// Tus integraciones → esta app → Webhooks → "Firma secreta"). Esto es lo
// que evita que cualquiera pueda pegarle a esta URL diciendo "este pedido
// ya está pagado" sin haber pagado nada.
const verificarFirma = (req, dataId) => {

    const secret = process.env.MP_WEBHOOK_SECRET;

    if (!secret) {
        return { ok: false, configurado: false };
    }

    const xSignature = req.headers['x-signature'];
    const xRequestId = req.headers['x-request-id'];

    if (!xSignature || !xRequestId || !dataId) {
        return { ok: false, configurado: true };
    }

    const partes = xSignature.split(',').reduce((acc, parte) => {
        const [clave, valor] = parte.split('=');
        if (clave && valor) acc[clave.trim()] = valor.trim();
        return acc;
    }, {});

    const { ts, v1: hashRecibido } = partes;

    if (!ts || !hashRecibido) {
        return { ok: false, configurado: true };
    }

    // MP pide pasar el data.id a minúscula al armar el manifest.
    const manifest = `id:${String(dataId).toLowerCase()};request-id:${xRequestId};ts:${ts};`;
    const hashCalculado = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

    return { ok: hashCalculado === hashRecibido, configurado: true };
};

const webhook = async (req, res) => {

    try {

        const type = req.query.type || req.query.topic || req.body?.type;

        const dataId =
            req.query['data.id'] ||
            req.query.id ||
            req.body?.data?.id;

        // Mercado Pago manda otros tipos de notificación (merchant_order,
        // etc.) además de "payment" — a esos no les hacemos nada.
        if (type !== 'payment' || !dataId) {
            return res.sendStatus(200);
        }

        const firma = verificarFirma(req, dataId);

        if (!firma.ok) {
            if (firma.configurado) {
                // Hay secret configurado y la firma no coincide: notificación
                // sospechosa, no se procesa.
                console.error(`Webhook de Mercado Pago con firma inválida (payment ${dataId}).`);
                return res.sendStatus(401);
            }
            // Todavía no se configuró MP_WEBHOOK_SECRET. Seguimos igual
            // (la segunda barrera de abajo, re-consultar el pago real a la
            // API de MP, sigue en pie), pero avisamos fuerte en los logs.
            console.error('⚠️  MP_WEBHOOK_SECRET no configurado: no se puede validar la firma del webhook. Configuralo en el panel de Mercado Pago y en las variables de entorno.');
        }

        // Nunca se confía en el "status" de la notificación en sí — se
        // vuelve a pedir el pago real a la API de Mercado Pago con el
        // access token del servidor.
        const payment = new Payment(client);
        const pagoReal = await payment.get({ id: dataId });

        const idPedido = pagoReal.external_reference;

        if (!idPedido) {
            console.error(`Webhook de MP: el payment ${dataId} no tiene external_reference.`);
            return res.sendStatus(200);
        }

        const pedido = await Pedido.findByPk(idPedido);

        if (!pedido) {
            console.error(`Webhook de MP: no existe el pedido #${idPedido} (payment ${dataId}).`);
            return res.sendStatus(200);
        }

        // Idempotencia: Mercado Pago puede reintentar la misma
        // notificación varias veces. Si ya está pagado, no reprocesamos
        // (evita mandar el mail de confirmación dos veces).
        if (pedido.estado === 'pagado') {
            return res.sendStatus(200);
        }

        if (pagoReal.status === 'approved') {

            pedido.estado = 'pagado';
            pedido.mp_payment_id = String(pagoReal.id);

            // Registra el ingreso en Caja apenas se confirma el pago, igual
            // que se hace a mano cuando el admin marca un pedido como
            // "Entregado" (ver pedido/actualizarEstado.js). Si no hay una
            // caja abierta en ese momento, simplemente no se registra — no
            // bloquea la confirmación del pago, que es lo importante.
            await registrarIngresoPedido(pedido, 'mercado_pago');

            await pedido.save();

            if (pedido.email_cliente) {
                try {
                    const detalles = await pedido.getDetallesPedidos();

                    await enviarCorreo(
                        pedido.id_pedido,
                        detalles.map((d) => ({
                            nombre: d.nombre,
                            cantidad: d.cantidad,
                            color: d.color,
                            talla: d.talle,
                        })),
                        pedido.email_cliente,
                        Number(pedido.total_pedido).toLocaleString('es-AR')
                    );
                } catch (errorCorreo) {
                    // El pedido ya quedó bien marcado como pagado, que es lo
                    // importante; el mail es un plus.
                    console.error('No se pudo enviar la confirmación de pago por correo:', errorCorreo);
                }
            }

        } else {
            // in_process, rejected, etc. El pedido sigue "pendiente": no lo
            // cancelamos automáticamente por un rechazo, para no perder de
            // vista pedidos que el cliente puede reintentar pagar.
            console.log(`Pago ${pagoReal.id} del pedido #${idPedido}: estado "${pagoReal.status}".`);
        }

        return res.sendStatus(200);

    } catch (error) {

        console.error('Error procesando webhook de Mercado Pago:', error);

        // Se responde 200 igual: si devolvemos error, MP reintenta la
        // notificación indefinidamente contra algo que probablemente
        // vuelva a fallar por el mismo motivo (ej. un bug de código).
        return res.sendStatus(200);
    }
};

module.exports = webhook;
