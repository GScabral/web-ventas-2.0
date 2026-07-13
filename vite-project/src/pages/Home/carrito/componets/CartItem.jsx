import React from "react";
import { useDispatch } from "react-redux";

import {
  eliminarProductoCarrito,actualizarCarrito
} from "../../../../redux/action";

import {
  faTrashAlt,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../styles/CartItem.module.css";

const CartItem = ({
  producto,
  index,
}) => {

  const dispatch = useDispatch();

  const incrementar = () => {

    if (
      producto.cantidad >=
      (producto.variante?.cantidad_disponible ?? Infinity)
    ) {
      return;
    }

    dispatch(
      actualizarCarrito(
        index,
        {
          ...producto,
          cantidad:
            producto.cantidad + 1
        }
      )
    );

  };

  const decrementar = () => {

    if (
      producto.cantidad <= 1
    ) {
      return;
    }

    dispatch(
      actualizarCarrito(
        index,
        {
          ...producto,
          cantidad:
            producto.cantidad - 1
        }
      )
    );

  };
  const eliminar = () => {
    dispatch(
      eliminarProductoCarrito(index)
    );
  };

  return (
    <div className={styles.card}>

      <img
        src={ producto.imagen}
        alt={producto.nombre}
        loading="lazy"
      />

      <div className={styles.info}>

        <h3>{producto.nombre}</h3>

        <div className={styles.variantTags}>
          {producto.color && (
            <span className={styles.tag}>
              {producto.color}
            </span>
          )}

          {producto.talla && (
            <span className={styles.tag}>
              Talle {producto.talla}
            </span>
          )}
        </div>

        <p className={styles.unitPrice}>
          $
          {Number(
            producto.precio
          ).toLocaleString("es-AR")}{" "}
          c/u
        </p>

      </div>

      <div className={styles.actions}>

        <span className={styles.subtotal}>
          $
          {(
            Number(producto.precio) *
            producto.cantidad
          ).toLocaleString("es-AR")}
        </span>

        <div className={styles.quantityControl}>

          <button
            onClick={decrementar}
            disabled={producto.cantidad <= 1}
            aria-label="Restar uno"
          >
            <FontAwesomeIcon
              icon={faMinus}
            />
          </button>

          <span>
            {producto.cantidad}
          </span>

          <button
            onClick={incrementar}
            disabled={
              producto.cantidad >=
              (producto.variante?.cantidad_disponible ?? Infinity)
            }
            aria-label="Sumar uno"
          >
            <FontAwesomeIcon
              icon={faPlus}
            />
          </button>

        </div>

        <button
          className={styles.deleteBtn}
          onClick={eliminar}
          aria-label="Eliminar producto"
        >
          <FontAwesomeIcon
            icon={faTrashAlt}
          />
        </button>

      </div>

    </div>
  );
};

export default CartItem;