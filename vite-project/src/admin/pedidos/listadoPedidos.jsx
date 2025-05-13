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
            <PedidoItem key={pedido.id} pedido={pedido} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PedidoItem = ({ pedido }) => {
  const [listoClicked, setListoClicked] = useState(false);
  const dispatch = useDispatch();

  const handlerDespacharProducto = (pedidoId, detalleId) => {
    dispatch(despacharProducto(pedidoId, detalleId));
    setListoClicked(true);
  };

  return (
    <tr>
      <td data-label="ID">{pedido.id}</td>
      <td data-label="Fecha">{pedido.fecha}</td>
      <td data-label="Detalles">
        <ul>
          {pedido.detalles.map((detalle) => (
            <li key={`${pedido.id}-${detalle.idDetalle}`}>
              Cantidad: {detalle.cantidad}, color: {detalle.color}, talle: {detalle.talle}, nombre: {detalle.nombre}
            </li>
          ))}
        </ul>
      </td>
      <td data-label="Total">
        <ul>
          {pedido.detalles.map((detalle) => (
            <li key={`${pedido.id}-${detalle.idDetalle}`}>
              ${detalle.total}
            </li>
          ))}
        </ul>
      </td>
      <td data-label="Despachar">
        {!pedido.despachado && (
          <button
            onClick={() => handlerDespacharProducto(pedido.id, pedido.detalles[0].idDetalle)}
            className={listoClicked ? 'listo-clicked' : 'listo'}
            disabled={listoClicked}
          >
            listo
          </button>
        )}
      </td>
    </tr>
  );
};

export default PedidoList;
