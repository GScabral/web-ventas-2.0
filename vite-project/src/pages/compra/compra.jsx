import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPedido,actualizarVariante } from "../../redux/action";
import "./compra.css";

const Pedido = ({ onRealizarPedido, errorStock }) => {
  const dispatch = useDispatch();
  const carrito = useSelector((state) => state.carrito);
  const allProductos = useSelector((state) => state.allProductos);
  const [numeroPedido, setNumeroPedido] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    if (errorStock) {
      setMostrarModal(false); // Ocultar el modal si hay un error de stock
    }
  }, [errorStock]);

  const handlePedido= async () => {
    try {
      for (const producto of carrito) {
        const { id, cantidad } = producto;
        const productoEnStock = allProductos.find((p) => p.id === id);
  
        if (!productoEnStock) {
          console.error(`Producto con ID ${id} no encontrado en allProductos.`);
          return; // Detener el proceso y mostrar un mensaje de error
        }
  
        const variante = productoEnStock.variantes.find(
          (v) => v.idVariante === producto.idVariante && v.color === producto.color && v.talla === producto.talle
        );
  
        if (!variante) {
          console.error(
            `Variante del producto con ID ${id}, color ${producto.color} y talla ${producto.talle} no encontrada.`
          );
          return; // Detener el proceso y mostrar un mensaje de error
        }
  
        const nuevaCantidadDisponible = variante.cantidad_disponible;
  
        if (typeof nuevaCantidadDisponible !== 'number') {
          console.error('El valor de cantidad disponible no es un número entero');
          return; // Detener el proceso y mostrar un mensaje de error
        }
  
        if (nuevaCantidadDisponible < 0) {
          console.error(`No hay suficiente cantidad en stock para el producto con ID ${id}`);
          const nombreProducto = productoEnStock.nombre; // Obtener el nombre del producto
          alert(`Lo sentimos, no hay suficiente cantidad en stock para el producto "${nombreProducto}". Por favor, ajusta la cantidad en tu carrito.`);
          setErrorStock(true); // Establecer el estado de error de stock
          return; // Detener el proceso y mostrar un mensaje de error
        }
  
        // Actualiza la cantidad disponible de la variante
        variante.cantidad_disponible = nuevaCantidadDisponible;
  
        // Llama a actualizarVariante para actualizar la base de datos
        await dispatch(actualizarVariante(id, variante)); // Ajusta esto según la implementación de actualizarVariante
      }
  
      // Si no hay errores de stock, procede con el pedido
      if (!errorStock) {
        await dispatch(actualizarCarrito(carrito));
      }
    } catch (error) {
      console.error("Error al realizar cambios", error);
      return; // Detener el proceso y mostrar un mensaje de error
    }
  }
  return (
    <div>
      <button className="pedido-compra" onClick={handlePedido}>
        Realizar Pedido
      </button>
      {mostrarModal && (
        <div className="modal-compra">
          <div className="modal-content-compra">
            <span className="close-compra" onClick={() => setMostrarModal(false)}>
              &times;
            </span>
            <h2>Número de pedido: {numeroPedido}</h2>
            <p>
              Utiliza este número de pedido para retirar tu producto en la tienda física.
            </p>
            <p>
              Si deseas recibir el producto en tu casa, comunícate{" "}
              <a href={"https://wa.me/message/CTLCYWOO7XTML1"}>aquí</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedido;
