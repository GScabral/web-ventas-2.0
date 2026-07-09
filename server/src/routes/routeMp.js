const express = require('express');
const router = express.Router();
const crearPreferencia = require('../controllers/mp/crearPreferencia');
const webhook = require('../controllers/mp/webhook');

// Pública: se llama después de crear el pedido (POST /pedido/nuevoPedido),
// nunca antes — así el checkout de Mercado Pago siempre queda atado a un
// pedido real ya guardado, con precio y stock ya validados del lado del
// servidor.
router.post('/crear-preferencia/:idPedido', crearPreferencia);

// Pública: la llama Mercado Pago, no el navegador. No puede tener
// verificarTokenAdmin/Cliente — MP no manda ningún token nuestro, la
// autenticidad se valida con la firma (x-signature) dentro de webhook.js.
// Se acepta POST (formato actual) y GET (IPN viejo) por las dudas,
// ambos van al mismo handler.
router.post('/webhook', webhook);
router.get('/webhook', webhook);

module.exports = router;
