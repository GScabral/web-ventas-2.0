const { Router } = require('express');

const routeCliente = require("../routes/routeCliente");
const routeAdmin = require("../routes/routeAdmin");
const routeProducto = require("../routes/routeProducto");
const routePedido = require("../routes/routePedido");
const routeOferta = require("../routes/routesOferta");

const router = Router();

// Ruta raíz para verificación en Render
router.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Rutas principales
router.use("/cliente", routeCliente);
router.use("/Nadmin", routeAdmin);
router.use("/producto", routeProducto);
router.use("/pedido", routePedido);
router.use("/oferta", routeOferta);

module.exports = router;
