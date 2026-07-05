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
        <h1>Crear cuenta</h1>
        <p className="cuenta-subtitulo">
          Registrate para seguir tus pedidos más fácil la próxima vez.
        </p>

        {error && <p className="cuenta-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              required
              minLength={3}
              value={form.nombre}
              onChange={handleChange("nombre")}
            />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              required
              minLength={3}
              value={form.apellido}
              onChange={handleChange("apellido")}
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              required
              value={form.direccion}
              onChange={handleChange("direccion")}
            />
          </div>

          <div className="form-group">
            <label>Correo</label>
            <input
              type="email"
              required
              value={form.correo}
              onChange={handleChange("correo")}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.contraseña}
              onChange={handleChange("contraseña")}
              autoComplete="new-password"
            />
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
