import React from "react";
import { Link } from "react-router-dom";

import "./principal.css";

const Principal = () => {
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
          <h3>Productos</h3>
          <span>152</span>
        </div>

        <div className="stat-card">
          <h3>Pedidos</h3>
          <span>18</span>
        </div>

        <div className="stat-card">
          <h3>Ofertas</h3>
          <span>7</span>
        </div>

      </div>

      <div className="quick-actions">

        <h3>Acciones rápidas</h3>

        <div className="actions">

          <Link
            to="/admin/new"
            className="action-btn"
          >
            Añadir Producto
          </Link>

          <Link
            to="/admin/lista"
            className="action-btn"
          >
            Inventario
          </Link>

          <Link
            to="/admin/PedidosLista"
            className="action-btn"
          >
            Pedidos
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Principal;