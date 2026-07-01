import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

import CartItem from "./componets/CartItem";
import CartSummary from "./componets/CartSummary";
import CheckoutModal from "./componets/CheckoutModal";
import RecommendedCarousel from "../Detail/components/RecommendedProducts";

import { getProductos } from "../../../redux/action";

import styles from "./styles/carrito.module.css";

const Carrito = () => {
  const dispatch = useDispatch();

  const carrito = useSelector(
    (state) => state.carrito
  );

  // allProductosBackUp es la lista completa sin paginar (a diferencia
  // de allProductos, que solo tiene la página actual de la home). La
  // pedimos acá porque a este carrito se puede llegar directo, sin
  // haber pasado antes por la home.
  const todosLosProductos = useSelector(
    (state) => state.allProductosBackUp
  ) || [];

  useEffect(() => {
    dispatch(getProductos());
  }, [dispatch]);

  const [showCheckout, setShowCheckout] =
    useState(false);

  // Recomendados: productos que no están ya en el carrito. Si hay
  // productos del mismo rubro que algo en el carrito, esos van primero.
  const recomendados = useMemo(() => {
    if (!todosLosProductos.length) return [];

    const idsEnCarrito = new Set(carrito.map((item) => item.id));
    const ramasEnCarrito = new Set(
      carrito.map((item) => item.rama).filter(Boolean)
    );

    const disponibles = todosLosProductos.filter(
      (p) => !idsEnCarrito.has(p.id)
    );

    const mismoRubro = disponibles.filter((p) => ramasEnCarrito.has(p.rama));
    const resto = disponibles.filter((p) => !ramasEnCarrito.has(p.rama));

    return [...mismoRubro, ...resto].slice(0, 8);
  }, [todosLosProductos, carrito]);

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

      <RecommendedCarousel productos={recomendados} />

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