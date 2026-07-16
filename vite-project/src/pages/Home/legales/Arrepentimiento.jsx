import React, { useState } from "react";
import { enviarArrepentimiento } from "../../../redux/action";
import "./legales.css";

// Botón de arrepentimiento — obligatorio para e-commerce en Argentina
// (Resolución 424/2020, Ley de Defensa del Consumidor 24.240). Permite
// al cliente arrepentirse de una compra dentro de los 10 días corridos.
// El formulario le manda la solicitud al comercio por correo.
const Arrepentimiento = () => {

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    numero_pedido: "",
    motivo: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setEnviando(true);

    try {
      const data = await enviarArrepentimiento(form);
      setMensaje(data.mensaje || "Recibimos tu solicitud.");
      setForm({ nombre: "", email: "", numero_pedido: "", motivo: "" });
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "No pudimos enviar tu solicitud. Probá de nuevo en un momento."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contenedor legal-page">
      <div className="tarjeta legal-tarjeta">

        <h1>Botón de arrepentimiento</h1>

        <p>
          Si te arrepentiste de una compra, tenés derecho a cancelarla y
          pedir el reintegro dentro de los <strong>10 días corridos</strong>{" "}
          de recibido el producto, sin necesidad de justificar el motivo
          (Ley 24.240 de Defensa del Consumidor y Resolución 424/2020). El
          producto debe devolverse en las mismas condiciones en que se
          recibió.
        </p>

        <p>
          Completá este formulario y el comercio se va a contactar con vos
          para coordinar la devolución y el reintegro.
        </p>

        {mensaje && <p className="legal-exito">{mensaje}</p>}
        {error && <p className="legal-error">{error}</p>}

        <form onSubmit={handleSubmit} className="legal-form">
          <div className="legal-campo">
            <label>Nombre y apellido</label>
            <input
              type="text"
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="legal-campo">
            <label>Email de la compra</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="legal-campo">
            <label>Número de pedido</label>
            <input
              type="text"
              name="numero_pedido"
              required
              value={form.numero_pedido}
              onChange={handleChange}
            />
          </div>

          <div className="legal-campo">
            <label>Motivo (opcional)</label>
            <textarea
              name="motivo"
              rows="3"
              value={form.motivo}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="legal-btn" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Arrepentimiento;
