import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetearPassword } from "../../redux/action";
import "./cuenta.css";

// Paso 2 de "olvidé mi contraseña": se llega acá desde el link del mail,
// que trae ?token=XXX. El cliente elige una contraseña nueva.
const RestablecerContrasena = () => {

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [contrasena, setContrasena] = useState("");
  const [repetir, setRepetir] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (contrasena !== repetir) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);

    try {
      const data = await resetearPassword(token, contrasena);
      setMensaje(data.mensaje || "Tu contraseña se cambió. Ya podés iniciar sesión.");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "No pudimos cambiar la contraseña. Pedí un link nuevo."
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

        <h1>Nueva contraseña</h1>

        {!token ? (
          <p className="cuenta-error" style={{ marginTop: 12 }}>
            El link no es válido. Volvé a pedir uno desde "Recuperar contraseña".
          </p>
        ) : mensaje ? (
          <p className="cuenta-exito" style={{ marginTop: 12 }}>{mensaje}</p>
        ) : (
          <>
            <p className="cuenta-subtitulo">
              Elegí una contraseña nueva (mínimo 8 caracteres, con letras y números).
            </p>

            {error && <p className="cuenta-error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nueva contraseña</label>
                <div className="input-icon-wrap has-toggle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={mostrar ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setMostrar((v) => !v)}
                    aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {mostrar ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Repetir contraseña</label>
                <div className="input-icon-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={mostrar ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={repetir}
                    onChange={(e) => setRepetir(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary cuenta-submit" disabled={enviando}>
                {enviando ? "Guardando..." : "Cambiar contraseña"}
              </button>
            </form>
          </>
        )}

        <p className="cuenta-alt">
          <Link to="/iniciar-sesion">Ir a iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RestablecerContrasena;
