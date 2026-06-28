import React from "react";

import styles from "../styles/CartSummary.module.css";

// MercadoPagoButton se sacó de aquí: hoy genera el cobro en MercadoPago
// pero no crea el Pedido en la base de datos (no pasa por nuevoPedido),
// así que una compra pagada por ese camino no quedaba registrada en el
// sistema ni descontaba stock. Hasta que se integre correctamente con el
// flujo de "Coordinar Envío" (o se agregue el webhook de confirmación de
// pago), el único camino de compra habilitado es "Coordinar Envío".

const CartSummary = ({
  carrito,
  onCheckout,
}) => {
  const total = carrito.reduce(
    (acc, item) =>
      acc +
      item.precio *
        item.cantidad,
    0
  );


  return (
    <div className={styles.card}>

      <h2>
        Resumen del pedido
      </h2>

      <div className={styles.row}>
        <span>Total</span>

        <strong>
          $
          {total.toLocaleString(
            "es-AR"
          )}
        </strong>
      </div>

      <button
        onClick={onCheckout}
      >
        Coordinar Envío
      </button>

    </div>
  );
};

export default CartSummary;