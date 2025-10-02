import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPedidos, despacharProducto } from '../../redux/action';
import './listadoPedidos.css';

const PedidoList = () => {
  const dispatch = useDispatch();
  const allPedidos = useSelector((state) => state.allPedidos);

  useEffect(() => {
    dispatch(getPedidos());
  }, [dispatch]);

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
          {allPedidos.map((pedido) => (
            <PedidoItem key={pedido.id_pedido} pedido={pedido} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PedidoItem = ({ pedido }) => {
  const dispatch = useDispatch();

  const handlerDespacharProducto = (detalleId) => {
    dispatch(despacharProducto(pedido.id_pedido, detalleId));
  };

  return (
    <tr>
      <td data-label="ID">{pedido.id_pedido}</td>
      <td data-label="Fecha">{pedido.fecha}</td>
      <td data-label="Detalles">
        <ul>
          {pedido.detalles.map((detalle) => (
            <li key={`${pedido.id_pedido}-${detalle.id_detalle_pedido}`}>
              Cantidad: {detalle.cantidad}, color: {detalle.color}, talle: {detalle.talle}, nombre: {detalle.nombre}
            </li>
          ))}
        </ul>
      </td>
      <td data-label="Total">
        <ul>
          {pedido.detalles.map((detalle) => (
            <li key={`${pedido.id_pedido}-${detalle.id_detalle_pedido}`}>
              ${detalle.total}
            </li>
          ))}
        </ul>
      </td>
      <td data-label="Despachar">
        <ul>
          {pedido.detalles.map((detalle) => (
            <li key={`btn-${detalle.id_detalle_pedido}`}>
              {detalle.estado_pedido !== 'DESPACHADO' ? (
                <button
                  onClick={() => handlerDespacharProducto(detalle.id_detalle_pedido)}
                  className="listo"
                >
                  listo
                </button>
              ) : (
                <span className="despachado">✔ Despachado</span>
              )}
            </li>
          ))}
        </ul>
      </td>
    </tr>
  );
};

export default PedidoList;
