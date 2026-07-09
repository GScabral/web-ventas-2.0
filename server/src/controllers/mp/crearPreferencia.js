const { MercadoPagoConfig, Preference } = require('mercadopago');
const dotenv = require('dotenv');
const { Pedido, DetallesPedido } = require('../../db');

dotenv.config();

const client = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN,
});

// Arma el checkout de Mercado Pago para un Pedido que YA existe en la
// base de datos (creado antes por POST /pedido/nuevoPedido, con precios,
// stock y cupón ya validados del lado del servidor). A diferencia de la
// versión vieja de este archivo, acá NO se arma la preferencia a partir
// de lo que manda el carrito del navegador — eso permitía generar un
// cobro que no quedaba atado a ningún pedido real. Se usa un único ítem
// con el total ya calculado del pedido (en vez de reconstruir cupón +
// envío como líneas separadas), así no hay forma de que la suma de
// ítems de Mercado Pago quede desincronizada del total real guardado.
const crearPreferencia = async (req, res) => {

    try {

        const { idPedido } = req.params;

        const pedido = await Pedido.findByPk(idPedido, {
            include: [DetallesPedido],
        });

        if (!pedido) {
            return res.status(404).json({ error: "No encontramos ese pedido." });
        }

        if (pedido.estado === "pagado") {
            return res.status(400).json({ error: "Este pedido ya está pagado." });
        }

        if (pedido.estado === "cancelado") {
            return res.status(400).json({ error: "Este pedido fue cancelado." });
        }

        // Se arma dinámicamente en base al request en vez de depender de
        // una variable de entorno fija — así funciona igual sin importar
        // el dominio en el que esté corriendo el backend (útil también
        // de cara a reusar este mismo código en otro despliegue/cliente).
        // server.set('trust proxy', 1) en app.js hace que req.protocol
        // refleje bien "https" detrás del proxy de Render.
        const backendUrl = process.env.MP_WEBHOOK_URL
            || `${req.protocol}://${req.get('host')}/mp/webhook`;

        const frontendBase = process.env.CLIENT_URL?.split(',')[0]?.trim()
            || "http://localhost:5173";

        const body = {
            items: [
                {
                    id: String(pedido.id_pedido),
                    title: `Pedido #${pedido.id_pedido}`,
                    quantity: 1,
                    currency_id: "ARS",
                    unit_price: Number(pedido.total_pedido),
                },
            ],

            external_reference: String(pedido.id_pedido),

            notification_url: backendUrl,

            back_urls: {
                success: `${frontendBase}/pago-exitoso?pedido=${pedido.id_pedido}`,
                failure: `${frontendBase}/pago-fallido?pedido=${pedido.id_pedido}`,
                pending: `${frontendBase}/pago-pendiente?pedido=${pedido.id_pedido}`,
            },

            auto_return: "approved",

            payer: {
                name: pedido.nombre || undefined,
                email: pedido.email_cliente || undefined,
            },
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        pedido.metodo_pago = "mercadopago";
        pedido.mp_preference_id = result.id;
        await pedido.save();

        res.status(200).json({
            id: result.id,
            publicKey: process.env.MP_PUBLIC_KEY || null,
        });

    } catch (error) {

        console.error("Error al crear preferencia de Mercado Pago:", error);

        res.status(400).json({
            error: "No pudimos generar el link de pago. Intentá de nuevo en unos minutos.",
        });
    }
};

module.exports = crearPreferencia;
