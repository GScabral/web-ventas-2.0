import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  eliminarProductoCarrito,
  vaciarCarrito,
  actualizarCarrito,
  actualizarVariante,
  addPedido,
  enviarCorreo
} from "../../../redux/action";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import "./carrito.css";
import Table from "react-bootstrap/Table";

const Carrito = () => {
  const carrito = useSelector((state) => state.carrito);
  const [mostrarFormularioCorreo, setMostrarFormularioCorreo] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState(null);
  const [infoPedidoCorreo, setInfoPedidoCorreo] = useState(null);
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
  const dispatch = useDispatch();

  const eliminarDeCarrito = (index) => {
    dispatch(eliminarProductoCarrito(index));
  };

  const incrementarCantidad = (index) => {
    const nuevoCarrito = [...carrito];
    const producto = nuevoCarrito[index];
    if (!producto || producto.variantes.length === 0) return;
    const cantidadDisponible = producto.variantes[0].cantidad_disponible;
    if (producto.cantidad_elegida < cantidadDisponible) {
      producto.cantidad_elegida++;
      dispatch(actualizarCarrito(nuevoCarrito));
    }
  };

  const decrementarCantidad = (index) => {
    const nuevoCarrito = [...carrito];
    const producto = nuevoCarrito[index];
    if (!producto || producto.cantidad_elegida === 1) return;
    producto.cantidad_elegida--;
    dispatch(actualizarCarrito(nuevoCarrito));
  };

  const calcularTotal = () => {
    let total = 0;

    if (carrito.length >= 3) {
      carrito.forEach((item) => {
        const precioNumerico = parseFloat(item.precio);
        const cantidad = item.cantidad_elegida || 1;

        // Calcular el descuento por prenda
        let descuentoPorPrenda = 0;
        if (precioNumerico * cantidad >= 5000 && precioNumerico * cantidad < 10000) {
          descuentoPorPrenda = 1000;
        } else if (precioNumerico * cantidad >= 10000 && precioNumerico * cantidad < 15000) {
          descuentoPorPrenda = 3000;
        }

        // Restar el descuento por prenda del total
        total += (precioNumerico * cantidad) - descuentoPorPrenda;
      });
    } else {
      carrito.forEach((item) => {
        const precioNumerico = parseFloat(item.precio);
        const cantida = item.cantidad_elegida || 1;

        total += precioNumerico * cantida;
      })
    }

    return total.toFixed(2);
  }



  const handleRealizarPedido = async () => {
    try {
      const total = calcularTotal();
      const pedido = carrito.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        cantidad: producto.cantidad_elegida,
        color: producto.variantes[0].color,
        talla: producto.variantes[0].talla,
      }));

      const response = await dispatch(addPedido(pedido));

      if (response) {
        const numeroPedido = response.data.id_pedido;
        setNumeroPedido(numeroPedido);
        setInfoPedidoCorreo({ pedido, total }); // ← aquí guardás el total correctamente
        pedido.forEach(producto => {
          dispatch(actualizarVariante(producto.id, producto.cantidad));
        });
        setMostrarFormularioCorreo(true);
        setMostrarModal(true);
        setPedidoEnviado(true);
        dispatch(vaciarCarrito());
      } else {
        throw new Error('Error al agregar el pedido');
      }
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
    }
  };

  const enviarCorreoConPedido = async (correo) => {
    try {
      const { pedido, total } = infoPedidoCorreo;

      await dispatch(enviarCorreo(numeroPedido, pedido, correo));
      setCorreoEnviado(true);
      setMostrarFormularioCorreo(false);
      setMostrarNotificacion(true);

      // 🟢 MENSAJE ESTILADO PARA WHATSAPP
      let mensajeWpp = `🌸 *Amore Mio Showroom* 🌸\n\n🧾 *Pedido Nº ${numeroPedido}*\n\n`;
      pedido.forEach(producto => {
        mensajeWpp += `🔹 *${producto.nombre}*\n`;
        mensajeWpp += `   • Cantidad: ${producto.cantidad}\n`;
        mensajeWpp += `   • Color: ${producto.color}\n`;
        mensajeWpp += `   • Talle: ${producto.talla}\n\n`;
      });
      mensajeWpp += `💳 *Total a pagar:* $${total}\n`;
      mensajeWpp += `📧 *Correo de contacto:* ${correo}\n\n`;
      mensajeWpp += `Gracias por tu compra ✨\nNos comunicaremos a la brevedad para coordinar entrega o retiro.\n\n🌷 _Amore Mio Showroom_ 🌷`;

      const telefonoNegocio = "5493794562823";
      const urlWpp = `https://wa.me/${telefonoNegocio}?text=${encodeURIComponent(mensajeWpp)}`;
      window.open(urlWpp, "_blank");
    } catch (error) {
      console.error("Error al enviar el correo o mensaje", error);
    }
  };

  const handleSubmitCorreo = async (event) => {
    event.preventDefault();
    const correo = event.target.correo.value;
    if (numeroPedido) enviarCorreoConPedido(correo);
  };

  return (
    <div className="carrito-fondo">
      <div className="carrito">
        {carrito && carrito.length > 0 ? (
          <Table className="carrito-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((producto, index) => (
                <tr key={index}>
                  <td data-label="Producto">
                    {producto.variantes[0]?.imagenes[0] && (
                      <img className="card-imagen" src={producto.variantes[0].imagenes[0]} alt="Producto" />
                    )}
                    <div>
                      <span>Color: {producto.variantes[0]?.color}</span><br />
                      <span>Talle: {producto.variantes[0]?.talla}</span>
                    </div>
                  </td>
                  <td data-label="Descripción">{producto.descripcion}</td>
                  <td data-label="Precio">${producto.precio}</td>
                  <td data-label="Cantidad">
                    <div className="cantidad-acciones">
                      <button className="boton-cantidad" onClick={() => decrementarCantidad(index)}>-</button>
                      <span>{producto.cantidad_elegida}</span>
                      <button className="boton-cantidad" onClick={() => incrementarCantidad(index)}>+</button>
                    </div>
                  </td>
                  <td data-label="Eliminar">
                    <button className="boton-eliminar" onClick={() => eliminarDeCarrito(index)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="mensaje-vacio">No hay productos en el carrito</p>
        )}

        <p className="total">Total: <span>${calcularTotal()}</span></p>
        <button className="boton-carrito" onClick={() => dispatch(vaciarCarrito())}>Vaciar Carrito</button>
        <Link to="/"><button className="boton-carrito">Volver a la tienda</button></Link>
        <button className="boton-carrito" onClick={handleRealizarPedido}>Comprar</button>

        {mostrarModal && (
          <div className="modal-compra">
            <div className="modal-content-compra">
              <span className="close-compra" onClick={() => setMostrarModal(false)}>&times;</span>
              <form className="formulario-correo" onSubmit={handleSubmitCorreo}>
                <label htmlFor="correo">Correo electrónico:</label>
                <input type="email" name="correo" id="correo" required />
                <button type="submit" className="boton-carrito">Enviar</button>
              </form>
              {mostrarNotificacion && (
                <div className="notificacion">
                  <p>Correo enviado correctamente.</p>
                  <button className="boton-carrito-c" onClick={() => {
                    setMostrarNotificacion(false);
                    setMostrarModal(false);
                  }}>Cerrar</button>
                </div>
              )}
              <h2>Pedido Nº {numeroPedido}</h2>
              <p>Gracias por elegir Amore Mio Showroom 💖</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;

