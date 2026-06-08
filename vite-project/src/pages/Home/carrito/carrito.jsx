import React, { useState } from "react";
import { useSelector } from "react-redux";

import CartItem from "./componets/CartItem";
import CartSummary from "./componets/CartSummary";
import CheckoutModal from "./componets/CheckoutModal";

import styles from "./styles/carrito.module.css";

const Carrito = () => {
  const carrito = useSelector(
    (state) => state.carrito
  );


  console.log(carrito)
  const [showCheckout, setShowCheckout] =
    useState(false);

  return (
    <div className={styles.page}>

      <div className={styles.container}>

        <h1>Mi Carrito</h1>

        {!carrito.length ? (
          <div className={styles.empty}>
            Tu carrito está vacío
          </div>
        ) : (
          <>

            <div className={styles.products}>

              {carrito.map(
                (producto, index) => (
                  <CartItem
                    key={index}
                    producto={producto}
                    index={index}
                  />
                )
              )}

            </div>

            <CartSummary
              carrito={carrito}
              onCheckout={() =>
                setShowCheckout(true)
              }
            />

          </>
        )}

      </div>

      <CheckoutModal
        show={showCheckout}
        onClose={() =>
          setShowCheckout(false)
        }
      />

    </div>
  );
};

export default Carrito;