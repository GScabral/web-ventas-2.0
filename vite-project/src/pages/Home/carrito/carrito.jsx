import React, { useState } from "react";
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
  const dispatch = useDispatch();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState(null);
  const [infoPedidoCorreo, setInfoPedidoCorreo] = useState(null);
  const [correoCliente, setCorreoCliente] = useState("");
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);

  const eliminarDeCarrito = (index) => {
    dispatch(eliminarProductoCarrito(index));
  };
  console.log(carrito)

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

    carrito.forEach(item => {
      const precio = parseFloat(item.precio);
      const cantidad = item.cantidad_elegida || 1;

      total += precio * cantidad;
    });

    return Number(total.toFixed(2));
  };

  // 1️⃣ Se dispara cuando el usuario ingresa su correo
  const handleSubmitCorreo = async (event) => {
    event.preventDefault();
    const correo = event.target.correo.value;
    setCorreoCliente(correo);

    try {
      const total = calcularTotal();

      // Armamos el pedido sin id_pedido aún
      const pedidoBase = carrito.map(producto => ({
        id_variante: producto.variantes[0].idVariante,  // ⭐ AÑADIR ESTO
        id_pedido: producto.id,
        nombre: producto.nombre,
        cantidad: producto.cantidad_elegida || 1,
        color: producto.variantes[0].color,
        talla: producto.variantes[0].talla,
        precio_unitario: parseFloat(producto.precio),
        subtotal_producto: Number((producto.precio * producto.cantidad_elegida).toFixed(2)),
        total
      }));

      console.log("Datos que se envían:", {
        email_cliente: correo,
        productos: pedidoBase
      });

      // 2️⃣ Crear pedido en backend
      const response = await dispatch(
        addPedido({
          email_cliente: correo,
          productos: pedidoBase
        })
      );

      if (!response || !response.data || !response.data.id_pedido) {
        throw new Error("No se obtuvo id_pedido del servidor");
      }

      const numeroPedido = response.data.id_pedido;
      setNumeroPedido(numeroPedido);

      const pedidoConID = pedidoBase.map(item => ({
        ...item,
        id_pedido: numeroPedido
      }));

      setInfoPedidoCorreo({ pedido: pedidoConID, total });

      // 3️⃣ Enviar correo
      await dispatch(enviarCorreo(numeroPedido, pedidoConID, correo, total));

      // 4️⃣ Actualizar stock
      pedidoConID.forEach(producto =>
        dispatch(actualizarVariante(producto.id_variante, producto.cantidad))
      );

      // 5️⃣ Vaciar carrito
      dispatch(vaciarCarrito());

      // 6️⃣ Notificación
      setMostrarNotificacion(true);

      // 7️⃣ Crear mensaje de WhatsApp
      // let mensajeWpp = `🌸 *Amore Mio Showroom* 🌸\n\n🧾 *Pedido Nº ${numeroPedido}*\n\n`;
      // pedidoConID.forEach(producto => {
      //   mensajeWpp += `🔹 *${producto.nombre}*\n`;
      //   mensajeWpp += `   • Cantidad: ${producto.cantidad}\n`;
      //   mensajeWpp += `   • Color: ${producto.color}\n`;
      //   mensajeWpp += `   • Talle: ${producto.talla}\n\n`;
      // });
      // mensajeWpp += `💳 *Total a pagar:* $${total}\n`;
      // mensajeWpp += `📧 *Correo:* ${correo}\n\nGracias por tu compra ✨`;

      // const telefono = "5493794155821";

      // setInfoPedidoCorreo(prev => ({
      //   ...prev,
      //   urlDesktop: `whatsapp://send?phone=${telefono}&text=${encodeURIComponent(mensajeWpp)}`,
      //   urlWeb: `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeWpp)}`
      // }));

    } catch (error) {
      console.error("Error al enviar pedido o correo:", error);
    }
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

        <button className="boton-carrito" onClick={() => dispatch(vaciarCarrito())}>
          Vaciar Carrito
        </button>

        <Link to="/"><button className="boton-carrito">Volver a la tienda</button></Link>

        <button className="boton-carrito" onClick={() => setMostrarModal(true)}>
          Comprar
        </button>

        {mostrarModal && (
          <div className="modal-compra">
            <div className="modal-content-compra">

              <span className="close-compra" onClick={() => setMostrarModal(false)}>&times;</span>

              {!mostrarNotificacion && (
                <form className="formulario-correo" onSubmit={handleSubmitCorreo}>
                  <label htmlFor="correo">Correo electrónico:</label>
                  <input
                    type="email"
                    name="correo"
                    id="correo"
                    required
                    onChange={(e) => setCorreoCliente(e.target.value)}
                  />

                  <button type="submit" className="boton-carrito">Confirmar Pedido</button>
                </form>
              )}

              {mostrarNotificacion && (
                <>
                  <h2>Pedido Nº {numeroPedido}</h2>
                  <p>Correo enviado correctamente 💖</p>

                  <div className="botones-wpp">
                    <button className="boton-carrito"
                      onClick={() => window.open(infoPedidoCorreo.urlDesktop, "_blank")}>
                      📲 WhatsApp Desktop
                    </button>

                    <button className="boton-carrito"
                      onClick={() => window.open(infoPedidoCorreo.urlWeb, "_blank")}>
                      🌐 WhatsApp Web
                    </button>
                  </div>

                  <button className="boton-carrito-c"
                    onClick={() => setMostrarModal(false)}>
                    Cerrar
                  </button>
                </>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Carrito;
