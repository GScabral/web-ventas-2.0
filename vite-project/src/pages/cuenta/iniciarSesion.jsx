import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ingresarUsuario } from "../../redux/action";
import "./cuenta.css";

// Antes esta pantalla no existía (la ruta estaba comentada en App.jsx
// y los archivos originales — IS/iniciarSesion — ya ni estaban en el
// repo). El backend (/cliente/login, INS.js) sí funcionaba; solo
// faltaba la parte visible.
const IniciarSesion = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    try {
      await dispatch(ingresarUsuario({ correo, contraseña }));
      navigate("/mi-cuenta");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "No pudimos iniciar sesión. Revisá tu correo y contraseña."
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
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h1>Iniciar sesión</h1>
        <p className="cuenta-subtitulo">
          Entrá para ver el estado de tus pedidos.
        </p>

        {error && (
          <p className="cuenta-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo</label>
            <div className="input-icon-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z" opacity="0" />
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

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-icon-wrap has-toggle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={mostrarPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setMostrarPassword((v) => !v)}
                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary cuenta-submit"
            disabled={enviando}
          >
            {enviando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="cuenta-alt">
          ¿No tenés cuenta? <Link to="/crear-cuenta">Creá una acá</Link>
        </p>
      </div>
    </div>
  );
};

export default IniciarSesion;
