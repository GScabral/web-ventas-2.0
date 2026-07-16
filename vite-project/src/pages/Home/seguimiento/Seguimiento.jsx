import React, { useState } from "react";
import { consultarSeguimiento } from "../../../redux/action";
import "./seguimiento.css";

// Los mismos estados que maneja el backend (ver models/pedidos.js), con
// un texto amable y el orden real del recorrido, para dibujar la línea
// de progreso.
const PASOS = [
  { clave: "pendiente", label: "Pedido recibido" },
  { clave: "pagado", label: "Pago confirmado" },
  { clave: "preparando", label: "En preparación" },
  { clave: "enviado", label: "Enviado" },
  { clave: "entregado", label: "Entregado" },
];

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  try {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch {
    return "";
  }
};

// Página pública para que quien compró sin cuenta pueda ver en qué anda
// su pedido con el número + el email que usó al comprar.
const Seguimiento = () => {

  const [numero, setNumero] = useState("");
  const [email, setEmail] = useState("");
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");
  const [buscando, setBuscando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPedido(null);
    setBuscando(true);

    try {
      const data = await consultarSeguimiento(numero.trim(), email.trim());
      setPedido(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "No pudimos consultar el pedido. Revisá el número y el email."
      );
    } finally {
      setBuscando(false);
    }
  };

  // Si el pedido está cancelado, no tiene sentido la línea de progreso.
  const cancelado = pedido?.estado === "cancelado";
  const indiceActual = pedido
    ? PASOS.findIndex((p) => p.clave === pedido.estado)
    : -1;

  return (
    <div className="seguimiento-page">
      <div className="seguimiento-card">

        <h1>Seguí tu pedido</h1>
        <p className="seguimiento-sub">
          Ingresá el número de pedido y el email que usaste al comprar.
        </p>

        <form onSubmit={handleSubmit} className="seguimiento-form">
          <div className="seguimiento-campo">
            <label>Número de pedido</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ej: 1234"
              required
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>
          <div className="seguimiento-campo">
            <label>Email de la compra</label>
            <input
              type="email"
              placeholder="tu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="seguimiento-btn" disabled={buscando}>
            {buscando ? "Buscando..." : "Buscar pedido"}
          </button>
        </form>

        {error && <p className="seguimiento-error">{error}</p>}

        {pedido && (
          <div className="seguimiento-resultado">
            <div className="seguimiento-resultado-head">
              <div>
                <span className="seguimiento-nro">Pedido #{pedido.id_pedido}</span>
                <span className="seguimiento-fecha">{formatearFecha(pedido.fecha_pedido)}</span>
              </div>
              <span className={`seguimiento-badge ${pedido.estado}`}>
                {cancelado ? "Cancelado" : (PASOS.find(p => p.clave === pedido.estado)?.label || pedido.estado)}
              </span>
            </div>

            {!cancelado && (
              <ol className="seguimiento-linea">
                {PASOS.map((paso, i) => (
                  <li
                    key={paso.clave}
                    className={
                      "seguimiento-paso" +
                      (i < indiceActual ? " hecho" : "") +
                      (i === indiceActual ? " actual" : "")
                    }
                  >
                    <span className="seguimiento-punto" />
                    <span className="seguimiento-paso-label">{paso.label}</span>
                  </li>
                ))}
              </ol>
            )}

            {(pedido.numero_seguimiento || pedido.transportista) && (
              <p className="seguimiento-envio">
                {pedido.transportista && <>Transportista: <strong>{pedido.transportista}</strong><br /></>}
                {pedido.numero_seguimiento && <>Nº de seguimiento: <strong>{pedido.numero_seguimiento}</strong></>}
              </p>
            )}

            {pedido.datos_cadete && (
              <p className="seguimiento-envio">
                Envío por moto: <strong>{pedido.datos_cadete}</strong>
              </p>
            )}

            {Array.isArray(pedido.productos) && pedido.productos.length > 0 && (
              <ul className="seguimiento-productos">
                {pedido.productos.map((p, i) => (
                  <li key={i}>
                    {p.nombre} × {p.cantidad}
                    {p.talle ? ` · Talle ${p.talle}` : ""}
                    {p.color ? ` · ${p.color}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Seguimiento;
