import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { getMisPedidos, cerrarSesion } from "../../redux/action";
import "./cuenta.css";

// Antes no existía ninguna pantalla donde un cliente pudiera ver sus
// propios pedidos — solo el admin podía ver la lista completa. Usa el
// endpoint nuevo GET /pedido/mis-pedidos (protegido con un token de
// cliente, no de admin).
const MiCuenta = () => {

  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const misPedidos = useSelector((state) => state.misPedidos) || [];

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getMisPedidos());
    }
  }, [isLoggedIn, dispatch]);

  if (!isLoggedIn) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  const formatearMoneda = (valor) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(Number(valor) || 0);

  const formatearFecha = (fecha) =>
    fecha
      ? new Date(fecha).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

  return (
    <div className="contenedor mi-cuenta-page">

      <div className="mi-cuenta-header">
        <h1>Mis pedidos</h1>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => dispatch(cerrarSesion())}
        >
          Cerrar sesión
        </button>
      </div>

      {misPedidos.length === 0 ? (
        <div className="admin-empty-state">
          Todavía no hiciste ningún pedido. {" "}
          <Link to="/">Ir a la tienda</Link>
        </div>
      ) : (
        misPedidos.map((pedido) => (
          <div key={pedido.id_pedido} className="tarjeta pedido-card">

            <div className="pedido-card-header">
              <div>
                <span className="pedido-card-id">Pedido #{pedido.id_pedido}</span>
                <div className="pedido-card-fecha">
                  {formatearFecha(pedido.fecha_pedido)}
                </div>
              </div>

              <span className={`pedido-estado-badge ${pedido.estado}`}>
                {pedido.estado}
              </span>
            </div>

            <div className="pedido-card-detalle">
              {(pedido.DetallesPedidos || [])
                .map((detalle) =>
                  `${detalle.cantidad}x ${detalle.nombre}` +
                  (detalle.talla ? ` (talle ${detalle.talla}` : "") +
                  (detalle.color ? `${detalle.talla ? ", " : " ("}color ${detalle.color})` : (detalle.talla ? ")" : ""))
                )
                .join(" · ")}
            </div>

            {(pedido.estado === "enviado" || pedido.estado === "entregado") &&
              pedido.tipo_entrega === "ENVIO" && (
                <div className="pedido-card-envio">
                  {pedido.medio_envio === "moto" ? (
                    <span>🏍️ Envío por moto/cadete{pedido.datos_cadete ? ` — ${pedido.datos_cadete}` : ""}</span>
                  ) : (
                    <span>
                      📦 Envío por correo
                      {pedido.transportista ? ` — ${pedido.transportista}` : ""}
                      {pedido.numero_seguimiento ? ` — Seguimiento: ${pedido.numero_seguimiento}` : ""}
                    </span>
                  )}
                </div>
              )}

            <div className="pedido-card-total">
              {formatearMoneda(pedido.total_pedido)}
            </div>

          </div>
        ))
      )}

    </div>
  );
};

export default MiCuenta;
