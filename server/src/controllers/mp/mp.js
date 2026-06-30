const { MercadoPagoConfig, Preference } = require('mercadopago');
const dotenv = require('dotenv');
const { Productos, oferta } = require('../../db');
const { Op } = require('sequelize');

dotenv.config();

const client = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN
});

// Mismo criterio que en newPedido.js: el precio nunca se confía desde el
// body, siempre se recalcula contra la base de datos (y la oferta activa,
// si existe), para evitar que se manipule desde el navegador.
const obtenerPrecioReal = async (idProducto) => {
    const producto = await Productos.findByPk(idProducto);

    if (!producto) {
        return null;
    }

    let precio = Number(producto.precio);

    const ahora = new Date();

    const ofertaActiva = await oferta.findOne({
        where: {
            producto_id: idProducto,
            inicio: { [Op.lte]: ahora },
            fin: { [Op.gte]: ahora },
        },
    });

    if (ofertaActiva) {
        const descuento = Number(ofertaActiva.descuento) || 0;
        precio = precio - (precio * descuento) / 100;
    }

    return { precio, nombre: producto.nombre_producto };
};

const createPreference = async (req, res) => {

    try {

        const pedidoData = req.body;

        if (!Array.isArray(pedidoData) || pedidoData.length === 0) {
            return res.status(400).json({ error: "No hay productos" });
        }

        const infoProducto = [];

        for (const item of pedidoData) {
            const idProducto = item.id || item.id_producto;

            if (!idProducto) {
                return res.status(400).json({
                    error: `Falta el id del producto "${item.nombre || ""}"`
                });
            }

            const infoReal = await obtenerPrecioReal(idProducto);

            if (!infoReal) {
                return res.status(400).json({
                    error: `Producto con id ${idProducto} no encontrado`
                });
            }

            infoProducto.push({
                title: infoReal.nombre,
                quantity: Number(item.cantidad) || 1,
                currency_id: "ARS",
                unit_price: infoReal.precio,
            });
        }

        const body = {
            items: infoProducto,

            back_urls: {
                success: process.env.MP_SUCCESS_URL || "http://localhost:5173/pago-exitoso",
                failure: process.env.MP_FAILURE_URL || "http://localhost:5173/pago-fallido",
                pending: process.env.MP_PENDING_URL || "http://localhost:5173/pago-pendiente",
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
            error: "No pudimos generar el link de pago. Intentá de nuevo en unos minutos."
        });
    }
};

module.exports = createPreference;