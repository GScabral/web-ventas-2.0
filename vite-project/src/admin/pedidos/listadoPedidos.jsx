import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPedidos, despacharProducto, actualizarEstadoProducto,actualizarEstadoPedidoGeneral } from '../../redux/action';
import './listadoPedidos.css';

const PedidoList = () => {
  const dispatch = useDispatch();
  const allPedidos = useSelector((state) => state.allPedidos);

  useEffect(() => {
    dispatch(getPedidos());
  }, [dispatch]);

console.log(allPedidos)
  return (
    <div className="pedido-list-container">
      <h2>Listado de Pedidos</h2>
      <table className="pedido-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Detalles</th>
            <th>Total</th>
            <th>Despachar</th>
          </tr>
        </thead>
        <tbody>
          {allPedidos
            .slice()        // copia segura del array
            .reverse()      // invierte el orden → el último primero
            .map((pedido) => (
              <PedidoItem key={pedido.id} pedido={pedido} />
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

const PedidoItem = ({ pedido }) => {
  const dispatch = useDispatch();

  const fechaBonita = new Date(pedido.fecha).toLocaleString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const calcTotalPedido = () => {
    return pedido.detalles.reduce((acc, item) => acc + (item.total || 0), 0);
  };

  return (
    <tr>
      <td data-label="ID">{pedido.id}</td>

      <td>{fechaBonita}</td>

      <td>
        <ul>
          {pedido.detalles.map(det => (
            <li key={det.id_detalle_pedido}>
              <strong>{det.nombre}</strong><br />
              Cant: {det.cantidad} | Color: {det.color} | Talle: {det.talle}<br />
              <span style={{ color: "#555", fontSize: "14px" }}>
                Subtotal: <strong>${det.total}</strong>
              </span>
            </li>
          ))}
        </ul>
      </td>

      <td>
        <strong style={{ fontSize: "18px" }}>${calcTotalPedido()}</strong>
      </td>

      <td>
        <select
          className="estado-select"
          value={pedido.estado_general}
          onChange={(e) =>
            dispatch(actualizarEstadoPedidoGeneral(
              pedido.id,
              e.target.value
            ))
          }
        >
          <option value="PENDIENTE">Pendiente</option>
          <option value="PREPARANDO">Preparando</option>
          <option value="LISTO">Listo</option>
          <option value="ENTREGADO">Entregado</option>
        </select>

        <br />

        <button
          className="ticket-btn"
          onClick={() => window.open(`/ticket/${pedido.id_pedido}`, "_blank")}
        >
          Imprimir Ticket
        </button>
      </td>
    </tr>
  );
};



export default PedidoList;
