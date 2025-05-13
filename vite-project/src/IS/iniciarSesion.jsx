import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ingresarUsuario } from "../redux/action";
import { Link } from "react-router-dom";

import "./iniciarSesion.css";

const Ingresar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // Estado para rastrear si se ha intentado enviar el formulario

  const [state, setState] = useState({
    correo: "",
    contraseña: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value
    });
  };

  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};

      if (!state.correo && isSubmitted) { // Verificar errores solo si se ha intentado enviar el formulario
        newErrors.correo = "El correo es requerido";
      }

      if (!state.contraseña && isSubmitted) { // Verificar errores solo si se ha intentado enviar el formulario
        newErrors.contraseña = "La contraseña es requerida";
      }

      const isValid = Object.values(newErrors).every((error) => error === "");

      setError(newErrors);
      setIsValid(isValid);
    };

    validateForm();
  }, [state, isSubmitted]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true); // Marcar el formulario como enviado

    try {
      const response = await dispatch(ingresarUsuario(state));
      console.log("Respuesta del servidor al iniciar sesión:", response);

      if (response && response.status === 200 && response.data && response.data.token) {
        const token = response.data.token;
        setIsLoggedIn(true);
        navigate('/');
      } else {
        setLoginError("Credenciales inválidas");
      }
    } catch (error) {
      setTimeout(()=>{
      setLoginError("Error al iniciar sesión");
    },300)
    }
  };

  return (
    <div className="form-IS">
      <div>
        <h1 >INICIAR SESION</h1>
      </div>
      <div className="IS-container">
        <label className="form-labelIs" htmlFor="correo">
          Correo electrónico:
        </label>
        <input onChange={handleChange} value={state.correo} type="text" name="correo" autoComplete="off" />
        {error.correo && isSubmitted && <p className="error-message">{error.correo}</p>}

        <label className="form-labeliIs" htmlFor="contraseña">
          Contraseña:
        </label>
        <input onChange={handleChange} value={state.contraseña} type="password" name="contraseña" autoComplete="off" />
        {error.contraseña && isSubmitted && <p className="error-message">{error.contraseña}</p>}

        {loginError && <p className="error-message">{loginError}</p>}

        <button
          className={`form-button ${isValid ? "valid-button" : "invalid-button"}`}
          disabled={!isValid}
          onClick={handleSubmit}
          type="submit"
        >
          Ingresar
        </button>

        <Link className="home-form" to="/">
          Volver a la Home
        </Link>
      </div>
      <div className="login-is">
        <p>¿Necesitas una cuenta? <Link className="login-a" to="/newUser">Registrarse</Link></p>
      </div>
    </div>
  );
};

export default Ingresar;
