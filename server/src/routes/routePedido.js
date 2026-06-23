const { Router } = require("express");

const nuevoPedido = require("../controllers/pedido/newPedido");
const getPedidos = require("../controllers/pedido/getPedidos");
const getPedidoById = require("../controllers/pedido/getPedidoById");
const actualizarEstado = require("../controllers/pedido/actualizarEstado");
const cancelarPedido = require("../controllers/pedido/cancelarPedido");
const eliminarPedido = require("../controllers/pedido/eliminarPedido");
const { verificarTokenAdmin } = require("../middleware/auth");

const router = Router();

// Pública: el cliente crea su pedido al finalizar la compra (no tiene login)
router.post("/nuevoPedido", nuevoPedido);

// A partir de aquí, todo es gestión del admin: listar, ver, cambiar estado, eliminar
// Lista de pedidos: alias `/Lpedidos` y ruta raíz `/` para compatibilidad con frontend
router.get("/Lpedidos", verificarTokenAdmin, getPedidos);
router.get("/", verificarTokenAdmin, getPedidos);

router.get("/:id", verificarTokenAdmin, getPedidoById);

router.put("/:id/estado", verificarTokenAdmin, actualizarEstado);

router.put("/:id/cancelar", verificarTokenAdmin, cancelarPedido);

router.delete("/:id", verificarTokenAdmin, eliminarPedido);

module.exports = router;