import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

import CartItem from "./componets/CartItem";
import CartSummary from "./componets/CartSummary";
import CheckoutModal from "./componets/CheckoutModal";

import styles from "./styles/carrito.module.css";

const Carrito = () => {
  const carrito = useSelector(
    (state) => state.carrito
  );


  const [showCheckout, setShowCheckout] =
    useState(false);

  return (
    <div className={styles.page}>

      <div className={styles.container}>

        <h1 className={styles.pageTitle}>Mi Carrito</h1>

        {!carrito.length ? (
          <div className={styles.empty}>
            <FontAwesomeIcon
              icon={faBagShopping}
              className={styles.emptyIcon}
            />

            <p>Tu carrito está vacío</p>

            <span>
              Todavía no agregaste ningún producto
            </span>

            <Link
              to="/"
              className={styles.emptyCta}
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (

          <div className={styles.layout}>

            <div className={styles.products}>

              {carrito.map(
                (producto, index) => (
                  <CartItem
                    key={`${producto.id}-${producto.color || ""}-${producto.talla || ""}-${index}`}
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

          </div>
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