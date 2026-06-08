import React from "react";

import MercadoPagoButton from "./MercadoPagoButton";

import styles from "../styles/CartSummary.module.css";

const CartSummary = ({
  carrito,
  onCheckout,
}) => {
  const total = carrito.reduce(
    (acc, item) =>
      acc +
      item.precio *
        item.cantidad_elegida,
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

      <MercadoPagoButton
        carrito={carrito}
      />

    </div>
  );
};

export default CartSummary;