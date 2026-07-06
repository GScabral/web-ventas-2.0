import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createUsuario, ingresarUsuario } from "../../redux/action";
import "./cuenta.css";

// Registro de cliente. El backend (POST /cliente/nuevoCliente) ya
// existía, pero tenía dos bugs que se corrigieron junto con esta
// pantalla:
// 1) pedía un campo "info_contacto" que el modelo Cliente ni siquiera
//    tiene — bloqueaba el alta sin guardar nada con ese dato.
// 2) al fallar (ej. correo repetido) devolvía el mensaje de error mal
//    leído del lado del backend, así que el front nunca podía mostrar
//    el motivo real.
const CrearCuenta = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    correo: "",
    contraseña: "",
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    try {
      const resultado = await dispatch(createUsuario(form));

      if (!resultado?.success) {
        setError(resultado?.error || "No pudimos crear la cuenta.");
        return;
      }

      // Cuenta creada: iniciamos sesión directo, así no hay que
      // pedirle de nuevo el correo/contraseña que recién escribió.
      await dispatch(ingresarUsuario({
        correo: form.correo,
        contraseña: form.contraseña,
      }));

      navigate("/mi-cuenta");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "No pudimos crear la cuenta. Intentá de nuevo en unos minutos."
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="17" y1="11" x2="23" y2="11" />
          </svg>
        </div>

        <h1>Crear cuenta</h1>
        <p className="cuenta-subtitulo">
          Registrate para seguir tus pedidos más fácil la próxima vez.
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
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <div className="input-icon-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  placeholder="Nombre"
                  required
                  minLength={3}
                  value={form.nombre}
                  onChange={handleChange("nombre")}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <div className="input-icon-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  placeholder="Apellido"
                  required
                  minLength={3}
                  value={form.apellido}
                  onChange={handleChange("apellido")}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <div className="input-icon-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.42 10.34c0 5.68-8.42 11.16-8.42 11.16S3.58 16.02 3.58 10.34a8.42 8.42 0 1 1 16.84 0Z" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>
              <input
                type="text"
                placeholder="Calle y número"
                required
                value={form.direccion}
                onChange={handleChange("direccion")}
              />
            </div>
          </div>

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
                value={form.correo}
                onChange={handleChange("correo")}
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
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                value={form.contraseña}
                onChange={handleChange("contraseña")}
                autoComplete="new-password"
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
            {enviando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="cuenta-alt">
          ¿Ya tenés cuenta? <Link to="/iniciar-sesion">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default CrearCuenta;
