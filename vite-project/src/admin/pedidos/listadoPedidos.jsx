import React, {
  useState,
  useEffect,
  useCallback
} from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  getPedidos,
  actualizarEstadoPedidoGeneral
} from "../../redux/action";

import PedidoCard from "./pedidoCardList";

import "./PedidoList.css";

const PedidoList = () => {
  const dispatch = useDispatch();

  const allPedidos = useSelector(
    (state) => state.allPedidos || []
  );

  const [feedbackMsg, setFeedbackMsg] =
    useState("");

  useEffect(() => {
    dispatch(getPedidos());
  }, [dispatch]);

  const handleEstadoChange =
    useCallback(
      async (pedidoId, estado) => {
        await dispatch(
          actualizarEstadoPedidoGeneral(
            pedidoId,
            estado
          )
        );

        setFeedbackMsg(
          "Estado actualizado correctamente"
        );

        setTimeout(() => {
          setFeedbackMsg("");
        }, 2500);
      },
      [dispatch]
    );

  const pendientes =
    allPedidos.filter(
      (p) => p.estado === "pendiente"
    );

  const preparando =
    allPedidos.filter(
      (p) => p.estado === "preparando"
    );

  const enviados =
    allPedidos.filter(
      (p) => p.estado === "enviado"
    );

  const entregados =
    allPedidos.filter(
      (p) => p.estado === "entregado"
    );

  return (
    <div className="pedidos-page">
      <div className="pedidos-header">
        <div>
          <h1>Pedidos</h1>

          <p>
            Gestiona todos los pedidos
            de la tienda
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{allPedidos.length}</h3>
          <span>Total</span>
        </div>

        <div className="stat-card warning">
          <h3>{pendientes.length}</h3>
          <span>Pendientes</span>
        </div>

        <div className="stat-card info">
          <h3>{preparando.length}</h3>
          <span>Preparando</span>
        </div>

        <div className="stat-card success">
          <h3>{enviados.length}</h3>
          <span>Enviados</span>
        </div>

        <div className="stat-card complete">
          <h3>{entregados.length}</h3>
          <span>Entregados</span>
        </div>
      </div>

      {feedbackMsg && (
        <div className="feedback-success">
          {feedbackMsg}
        </div>
      )}

      <div className="kanban-board">

        <div className="kanban-column">
          <h2 className="pendiente">
            Pendientes
          </h2>

          {pendientes.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              onEstadoChange={
                handleEstadoChange
              }
            />
          ))}
        </div>

        <div className="kanban-column">
          <h2 className="preparando">
            Preparando
          </h2>

          {preparando.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              onEstadoChange={
                handleEstadoChange
              }
            />
          ))}
        </div>

        <div className="kanban-column">
          <h2 className="enviado">
            Enviados
          </h2>

          {enviados.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              onEstadoChange={
                handleEstadoChange
              }
            />
          ))}
        </div>

        <div className="kanban-column">
          <h2 className="entregado">
            Entregados
          </h2>

          {entregados.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              onEstadoChange={
                handleEstadoChange
              }
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default PedidoList;