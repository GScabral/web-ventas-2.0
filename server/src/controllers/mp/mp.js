const { MercadoPagoConfig, Preference } = require('mercadopago');
const dotenv = require('dotenv');

dotenv.config();

const client = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN
});

const createPreference = async (req, res) => {

    try {

        console.log(req.body);

        const pedidoData = req.body;

        const infoProducto = pedidoData.map((item) => ({
            title: item.nombre,
            quantity: Number(item.cantidad),
            currency_id: "ARS",
            unit_price: Number(item.precio_unitario),
        }));

        const body = {
            items: infoProducto,

            back_urls: {
                success: "https://www.youtube.com/",
                failure: "https://www.youtube.com/",
                pending: "https://www.youtube.com/",
            },

            auto_return: "approved",
        };

        const preference = new Preference(client);

        const result = await preference.create({ body });

        res.status(200).json({
            id: result.id
        });

    } catch (error) {

        console.error("Error al procesar la solicitud:", error);

        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = createPreference;