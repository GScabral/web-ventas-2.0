const { CajaSesion, CajaMovimiento } = require('../../db');

// Registra en Caja el ingreso de un pedido ya pagado, si hay una sesión
// de caja abierta. Se usa desde dos lugares con el mismo criterio, para
// no duplicar esta lógica:
//   - pedido/actualizarEstado.js: cuando el admin marca a mano un pedido
//     como "Entregado" y elige el método de pago.
//   - mp/webhook.js: cuando Mercado Pago confirma un pago automáticamente
//     (acá el método de pago siempre es "mercado_pago").
// No hace pedido.save() — eso queda a cargo de quien llama, así no se
// pisa un save() que ya esté por hacerse con otros campos cambiados a
// la vez (estado, mp_payment_id, etc.).
const registrarIngresoPedido = async (pedido, metodoPago) => {

    if (pedido.registrado_en_caja) {
        return {
            registrado: false,
            motivo: "Este pedido ya estaba registrado en Caja.",
        };
    }

    const sesionAbierta = await CajaSesion.findOne({
        where: { estado: "abierta" },
    });

    if (!sesionAbierta) {
        return {
            registrado: false,
            motivo: "No hay ninguna caja abierta en este momento.",
        };
    }

    await CajaMovimiento.create({
        tipo: "ingreso",
        concepto: `Pedido #${pedido.id_pedido}${pedido.nombre ? ` - ${pedido.nombre}` : ""}`,
        monto: pedido.total_pedido,
        metodo_pago: metodoPago,
        CajaSesionId: sesionAbierta.id_sesion,
    });

    pedido.registrado_en_caja = true;

    return { registrado: true, motivo: null };
};

module.exports = registrarIngresoPedido;
