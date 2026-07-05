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
        <h1>Iniciar sesión</h1>
        <p className="cuenta-subtitulo">
          Entrá para ver el estado de tus pedidos.
        </p>

        {error && <p className="cuenta-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo</label>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              required
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              autoComplete="current-password"
            />
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
