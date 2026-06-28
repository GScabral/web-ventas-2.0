import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getProductos,
  getPedidos,
  getOfertas,
} from "../../redux/action";

import "./principal.css";

const Principal = () => {
  const dispatch = useDispatch();

  const productos = useSelector(
    (state) => state.allProductosforFiltro || []
  );

  const pedidos = useSelector(
    (state) => state.allPedidos || []
  );

  const ofertas = useSelector(
    (state) => state.ofertasActivas || []
  );

  useEffect(() => {
    dispatch(getProductos());
    dispatch(getPedidos());
    dispatch(getOfertas());
  }, [dispatch]);

  const totalProductos = productos.length;

  const pedidosPendientes = pedidos.filter(
    (pedido) =>
      (pedido.estado || "").toLowerCase() === "pendiente"
  ).length;

  const ahora = new Date();

  const ofertasVigentes = ofertas.filter((oferta) => {
    const inicio = new Date(oferta.inicio);
    const fin = new Date(oferta.fin);
    return inicio <= ahora && ahora <= fin;
  }).length;

  return (
    <div className="dashboard">

      <div className="welcome-card">
        <h2>Bienvenido al panel de administración</h2>
        <p>
          Gestiona productos, pedidos y ofertas desde
          un único lugar.
        </p>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <span className="stat-label">Productos</span>
          <span className="stat-value">{totalProductos}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pedidos pendientes</span>
          <span className="stat-value">{pedidosPendientes}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Ofertas vigentes</span>
          <span className="stat-value">{ofertasVigentes}</span>
        </div>

      </div>

      <div className="quick-actions">

        <h3>Acciones rápidas</h3>

        <div className="actions">

          <Link
            to="/admin/new"
            className="action-btn"
          >
            Añadir producto
          </Link>

          <Link
            to="/admin/lista"
            className="action-btn action-btn-secondary"
          >
            Inventario
          </Link>

          <Link
            to="/admin/PedidosLista"
            className="action-btn action-btn-secondary"
          >
            Pedidos
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Principal;