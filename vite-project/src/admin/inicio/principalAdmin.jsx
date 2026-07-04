import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getProductos,
  getPedidos,
  getOfertas,
  getEstadisticas,
} from "../../redux/action";

import VentasChart from "./VentasChart";
import VentasPorCategoria from "./VentasPorCategoria";

import "./principal.css";

// A partir de qué cantidad disponible se considera "poco stock". Fijo
// por ahora — si más adelante hace falta que sea configurable por
// tienda, es un campo más para sumar a Personalización.
const UMBRAL_STOCK_BAJO = 5;

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

  const estadisticas = useSelector(
    (state) => state.estadisticas
  );

  useEffect(() => {
    dispatch(getProductos());
    dispatch(getPedidos());
    dispatch(getOfertas());
    dispatch(getEstadisticas());
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

  // Variantes con pocas unidades, agrupadas por producto (un producto
  // puede tener más de una variante con stock bajo, pero lo contamos
  // una sola vez en el resumen).
  const productosConStockBajo = productos.filter((producto) =>
    (producto.variantes || []).some(
      (v) => v.cantidad_disponible > 0 && v.cantidad_disponible <= UMBRAL_STOCK_BAJO
    )
  );

  // Pedidos que siguen en "pendiente" hace más de 48hs — el clásico
  // "se me pasó por alto". No importa cuánto tiempo llevan en otros
  // estados (preparando, enviado): lo urgente es lo que nunca se
  // arrancó a procesar.
  const HORAS_LIMITE_ESTANCADO = 48;

  const pedidosEstancados = pedidos.filter((pedido) => {
    if ((pedido.estado || "").toLowerCase() !== "pendiente") return false;

    const horasDesdeElPedido =
      (ahora - new Date(pedido.fecha_pedido)) / (1000 * 60 * 60);

    return horasDesdeElPedido >= HORAS_LIMITE_ESTANCADO;
  });

  const formatearMoneda = (valor) =>
    `$${Number(valor || 0).toLocaleString("es-AR")}`;

  return (
    <div className="dashboard">

      <div className="welcome-card">
        <h2>Bienvenido al panel de administración</h2>
        <p>
          Gestiona productos, pedidos y ofertas desde
          un único lugar.
        </p>
      </div>

      {/* ---- Ventas ---- */}

      <div className="stats-grid">

        <div className="stat-card">
          <span className="stat-label">Vendido hoy</span>
          <span className="stat-value">
            {formatearMoneda(estadisticas?.ventasHoy)}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Vendido esta semana</span>
          <span className="stat-value">
            {formatearMoneda(estadisticas?.ventasSemana)}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Vendido este mes</span>
          <span className="stat-value">
            {formatearMoneda(estadisticas?.ventasMes)}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Producto más vendido</span>
          <span className="stat-value stat-value-texto">
            {estadisticas?.productoMasVendido
              ? `${estadisticas.productoMasVendido.nombre} (${estadisticas.productoMasVendido.cantidad})`
              : "Sin ventas todavía"}
          </span>
        </div>

      </div>

      <div className="dashboard-card">
        <VentasChart ventasPorDia={estadisticas?.ventasPorDia || []} />
      </div>

      <div className="dashboard-card">
        <VentasPorCategoria ventasPorCategoria={estadisticas?.ventasPorCategoria || []} />
      </div>

      {/* ---- Pedidos estancados ---- */}

      {pedidosEstancados.length > 0 && (
        <div className="pedidos-estancados-card">

          <div className="pedidos-estancados-header">
            <span className="pedidos-estancados-icono">⏰</span>
            <span>
              {pedidosEstancados.length === 1
                ? "1 pedido lleva más de 48hs sin moverse de Pendiente"
                : `${pedidosEstancados.length} pedidos llevan más de 48hs sin moverse de Pendiente`}
            </span>
          </div>

          <div className="pedidos-estancados-lista">
            {pedidosEstancados.slice(0, 5).map((pedido) => (
              <Link
                key={pedido.id_pedido}
                to="/admin/PedidosLista"
                className="pedidos-estancados-item"
              >
                #{pedido.id_pedido} — {pedido.nombre || "Sin nombre"}
              </Link>
            ))}

            {pedidosEstancados.length > 5 && (
              <Link to="/admin/PedidosLista" className="pedidos-estancados-item pedidos-estancados-vermas">
                +{pedidosEstancados.length - 5} más
              </Link>
            )}
          </div>

        </div>
      )}

      {/* ---- Stock bajo ---- */}

      {productosConStockBajo.length > 0 && (
        <div className="stock-bajo-card">

          <div className="stock-bajo-header">
            <span className="stock-bajo-icono">⚠️</span>
            <span>
              {productosConStockBajo.length === 1
                ? "1 producto con pocas unidades"
                : `${productosConStockBajo.length} productos con pocas unidades`}
            </span>
          </div>

          <div className="stock-bajo-lista">
            {productosConStockBajo.slice(0, 6).map((producto) => (
              <Link
                key={producto.id}
                to="/admin/lista"
                className="stock-bajo-item"
              >
                {producto.nombre}
              </Link>
            ))}

            {productosConStockBajo.length > 6 && (
              <Link to="/admin/lista" className="stock-bajo-item stock-bajo-vermas">
                +{productosConStockBajo.length - 6} más
              </Link>
            )}
          </div>

        </div>
      )}

      {/* ---- Resumen general + accesos rápidos ---- */}

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
