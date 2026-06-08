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
      producto.cantidad_elegida >=
      producto.variante.cantidad_disponible
    ) {
      return;
    }

    console.log(producto)

    dispatch(
      actualizarCarrito(
        index,
        {
          ...producto,
          cantidad_elegida:
            producto.cantidad_elegida + 1
        }
      )
    );

  };

  const decrementar = () => {

    if (
      producto.cantidad_elegida <= 1
    ) {
      return;
    }

    dispatch(
      actualizarCarrito(
        index,
        {
          ...producto,
          cantidad_elegida:
            producto.cantidad_elegida - 1
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
      />

      <div className={styles.info}>

        <h3>{producto.nombre}</h3>

        <p>
          Color: {producto.color}
        </p>

        <p>
          Talle: {producto.talla}
        </p>

        <p>
          Precio: $
          {Number(
            producto.precio
          ).toLocaleString("es-AR")}
        </p>

      </div>

      <div className={styles.actions}>

        <button onClick={decrementar}>
          <FontAwesomeIcon
            icon={faMinus}
          />
        </button>

        <span>
          {producto.cantidad_elegida}
        </span>

        <button onClick={incrementar}>
          <FontAwesomeIcon
            icon={faPlus}
          />
        </button>

        <button onClick={eliminar}>
          <FontAwesomeIcon
            icon={faTrashAlt}
          />
        </button>

      </div>

    </div>
  );
};

export default CartItem;