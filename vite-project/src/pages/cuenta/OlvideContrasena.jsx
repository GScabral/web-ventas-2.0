import React, { useState } from "react";
import { Link } from "react-router-dom";
import { solicitarResetPassword } from "../../redux/action";
import "./cuenta.css";

// Paso 1 de "olvidé mi contraseña": el cliente ingresa su correo y le
// llega (si existe la cuenta) un mail con el link para elegir una nueva.
// A propósito, la respuesta es siempre la misma exista o no la cuenta
// (el backend no revela si el correo está registrado).
const OlvideContrasena = () => {

  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setEnviando(true);

    try {
      const data = await solicitarResetPassword(correo.trim());
      setMensaje(data.mensaje || "Si hay una cuenta con ese correo, te enviamos un link.");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "No pudimos procesar la solicitud. Probá de nuevo en un momento."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contenedor cuenta-page">
      <div className="tarjeta cuenta-card">

        <div className="cuenta-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1>Recuperar contraseña</h1>
        <p className="cuenta-subtitulo">
          Ingresá tu correo y te enviamos un link para elegir una nueva.
        </p>

        {mensaje ? (
          <p className="cuenta-exito" style={{ marginTop: 8 }}>{mensaje}</p>
        ) : (
          <>
            {error && <p className="cuenta-error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Correo</label>
                <div className="input-icon-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6Z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary cuenta-submit" disabled={enviando}>
                {enviando ? "Enviando..." : "Enviarme el link"}
              </button>
            </form>
          </>
        )}

        <p className="cuenta-alt">
          <Link to="/iniciar-sesion">Volver a iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default OlvideContrasena;
