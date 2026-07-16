const { Router } = require('express');

const routeCliente = require("../routes/routeCliente");
const routeAdmin = require("../routes/routeAdmin");
const routeProducto = require("../routes/routeProducto");
const routePedido = require("../routes/routePedido");
const routeOferta = require("../routes/routesOferta");
const routeMp = require("../routes/routeMp");
const routeBanner = require("../routes/routeBanner");
const routeConfiguracion = require("../routes/routeConfiguracion");
const routeCaja = require("../routes/routeCaja");
const routeCupon = require("../routes/routeCupon");
const routeCostoEnvio = require("../routes/routeCostoEnvio");
const routeZonaMoto = require("../routes/routeZonaMoto");
const routeLayoutHome = require("../routes/routeLayoutHome");
const routeTestimonio = require("../routes/routeTestimonio");
const routeLegal = require("../routes/routeLegal");
const routeResena = require("../routes/routeResena");

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
router.use("/mp", routeMp);
router.use("/banner", routeBanner);
router.use("/configuracion", routeConfiguracion);
router.use("/caja", routeCaja);
router.use("/cupon", routeCupon);
router.use("/costo-envio", routeCostoEnvio);
router.use("/zona-moto", routeZonaMoto);
router.use("/layout-home", routeLayoutHome);
router.use("/testimonio", routeTestimonio);
router.use("/legal", routeLegal);
router.use("/resena", routeResena);

module.exports = router;