const { Router } = require("express");

const nuevoPedido = require("../controllers/pedido/newPedido");
const getPedidos = require("../controllers/pedido/getPedidos");
const getEstadisticas = require("../controllers/pedido/getEstadisticas");
const getPedidoById = require("../controllers/pedido/getPedidoById");
const getMisPedidos = require("../controllers/pedido/getMisPedidos");
const actualizarEstado = require("../controllers/pedido/actualizarEstado");
const cancelarPedido = require("../controllers/pedido/cancelarPedido");
const eliminarPedido = require("../controllers/pedido/eliminarPedido");
const { verificarTokenAdmin, verificarTokenCliente } = require("../middleware/auth");

const router = Router();

// Pública: el cliente crea su pedido al finalizar la compra (no tiene login)
router.post("/nuevoPedido", nuevoPedido);

// Cliente logueado: su propio historial de pedidos. Tiene que ir ANTES
// de "/:id" (mismo motivo que "/estadisticas" más abajo) para que
// Express no interprete "mis-pedidos" como si fuera un :id.
router.get("/mis-pedidos", verificarTokenCliente, getMisPedidos);

// A partir de aquí, todo es gestión del admin: listar, ver, cambiar estado, eliminar
// Lista de pedidos: alias `/Lpedidos` y ruta raíz `/` para compatibilidad con frontend
router.get("/Lpedidos", verificarTokenAdmin, getPedidos);
router.get("/", verificarTokenAdmin, getPedidos);

// Tiene que ir ANTES de /:id — si no, Express interpreta "estadisticas"
// como si fuera el :id de un pedido y nunca llega a este handler.
router.get("/estadisticas", verificarTokenAdmin, async (req, res) => {
  try {
    const estadisticas = await getEstadisticas();
    res.status(200).json(estadisticas);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: "No pudimos obtener las estadísticas." });
  }
});

router.get("/:id", verificarTokenAdmin, getPedidoById);

router.put("/:id/estado", verificarTokenAdmin, actualizarEstado);

router.put("/:id/cancelar", verificarTokenAdmin, cancelarPedido);

router.delete("/:id", verificarTokenAdmin, eliminarPedido);

module.exports = router;