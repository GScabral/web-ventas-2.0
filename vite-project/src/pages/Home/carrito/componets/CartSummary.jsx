import React from "react";

import styles from "../styles/CartSummary.module.css";

// El botón de Mercado Pago ya no vive acá: se muestra dentro de
// CheckoutModal, recién después de crear el Pedido, y solo si el cliente
// eligió pagar online en vez de coordinar por WhatsApp (ver
// useCheckout.js / MercadoPagoButton.jsx).

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