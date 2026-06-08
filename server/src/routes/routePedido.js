const { Router } = require("express");

const nuevoPedido = require("../controllers/pedido/newPedido");
const getPedidos = require("../controllers/pedido/getPedidos");
const getPedidoById = require("../controllers/pedido/getPedidoById");
const actualizarEstado = require("../controllers/pedido/actualizarEstado");
const cancelarPedido = require("../controllers/pedido/cancelarPedido");
const eliminarPedido = require("../controllers/pedido/eliminarPedido");

const router = Router();

router.post("/nuevoPedido", nuevoPedido);

// Lista de pedidos: alias `/Lpedidos` y ruta raíz `/` para compatibilidad con frontend
router.get("/Lpedidos", getPedidos);
router.get("/", getPedidos);

router.get("/:id", getPedidoById);

router.put("/:id/estado", actualizarEstado);

router.put("/:id/cancelar", cancelarPedido);

router.delete("/:id", eliminarPedido);

module.exports = router;