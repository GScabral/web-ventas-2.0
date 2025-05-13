import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {createUsuario, checkEmailExistence } from "../redux/action";
import "./crearCuenta.css";
import { Link } from "react-router-dom";

const NewUser = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [shadowPassword, setShadowPassword] = useState(false);

  const [state, setState] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    info_contacto: "",
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

  const isEmailValid = (email) => {
    // Expresión regular para validar el correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};

      // name
      if (!state.nombre) {
        newErrors.nombre = "El nombre es requerido";
      } else if (state.nombre.length < 3) {
        newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
      } else if (!/^[a-zA-Z0-9 ]+$/.test(state.nombre)) {
        newErrors.nombre = "El nombre no debe contener caracteres especiales";
      } else {
        newErrors.nombre = "";
      }

      if (!state.apellido) {
        newErrors.apellido = "El apellido es requerido";
      } else if (state.apellido.length < 3) {
        newErrors.apellido = "El apellido debe tener al menos 3 caracteres";
      } else if (!/^[a-zA-Z0-9 ]+$/.test(state.apellido)) {
        newErrors.apellido = "El apellido no debe contener caracteres especiales";
      } else {
        newErrors.apellido = "";
      }

      if (!state.direccion) {
        newErrors.direccion = "El direccion es requerido";
      } else if (state.direccion.length < 3) {
        newErrors.direccion = "El direccion debe tener al menos 3 caracteres";
      } else if (!/^[a-zA-Z0-9 ]+$/.test(state.direccion)) {
        newErrors.direccion = "El direccion no debe contener caracteres especiales";
      } else {
        newErrors.direccion = "";
      }

      if (!state.info_contacto) {
        newErrors.info_contacto = "El info_contacto es requerido";
      } else if (state.info_contacto.length < 3) {
        newErrors.info_contacto = "El info_contacto debe tener al menos 3 caracteres";
      } else if (!/^[a-zA-Z0-9 ]+$/.test(state.info_contacto)) {
        newErrors.info_contacto = "El info_contacto no debe contener caracteres especiales";
      } else {
        newErrors.info_contacto = "";
      }

      if (!state.correo) {
        newErrors.correo = "El correo es requerido";
      } else if (!isEmailValid(state.correo)) {
        newErrors.correo = "Ingrese un correo electrónico válido";
      }

      if (!state.contraseña) {
        newErrors.contraseña = "La contraseña es requerida";
      }

      const isValid = Object.values(newErrors).every((error) => error === "");

      setError(newErrors);
      setIsValid(isValid);
    };
    validateForm();
  }, [state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Estado antes de enviar el formulario:", state); // Agregar aquí el console.log
    
    try {
      // Log para ver el estado final que se envía al hacer clic en "Crear"
      console.log("Estado final antes de enviar:", state);
      
      // Enviar la solicitud para crear un nuevo usuario
      const response = await dispatch(createUsuario(state));
  
      // Verificar el correo electrónico después de enviar los datos del formulario
      if (response && response.error) {
        // Mostrar mensaje de error al usuario si hubo un error al crear el usuario
        setError({ correo: response.error });
      } else {
        // Verificar el correo electrónico solo si el cliente se creó correctamente
        const isEmailTaken = await checkEmailExistence(state.correo);
  
        if (isEmailTaken) {
          // Mostrar mensaje de error al usuario
          setError({ correo: "El correo electrónico ya está en uso. Por favor, inicia sesión en lugar de crear una nueva cuenta." });
        }
      }
    } catch (error) {
      console.error("Error al verificar el correo electrónico:", error);
      // Manejar el error
    }
  };

  
  return (
    <div className="body-cc">
      <div className="CC-container">
        <h1 className="titulo-cc">Crear cuenta</h1>
        <label className="form-label" htmlFor="nombre">
          NOMBRE:
        </label>
        <input className="input-is" onChange={handleChange} value={state.nombre} type="text" name="nombre" autoComplete="off" />
        {error.nombre && <p className="error-message">{error.nombre}</p>}

        <label className="form-label" htmlFor="apellido">
          APELLIDO:
        </label>
        <input className="input-is" onChange={handleChange} value={state.apellido} type="text" name="apellido" autoComplete="off" />
        {error.apellido && <p className="error-message">{error.apellido}</p>}

        <label className="form-label" htmlFor="correo">
          CORREO:
        </label>
        <input className="input-is" onChange={handleChange} value={state.correo} type="text" name="correo" autoComplete="off" />
        {error.correo && <p className="error-message">{error.correo}</p>}

        <label className="form-label" htmlFor="contraseña">
          CONTRASEÑA:
        </label>
        <input className="input-is" onChange={handleChange} value={state.contraseña} type={shadowPassword ? "text" : "password"} name="contraseña" autoComplete="off" />
        <button className="button-is " onClick={() => setShadowPassword(!shadowPassword)}>
          {shadowPassword ? "Ocultar" : "Mostrar"} contraseña
        </button>
        {error.contraseña && <p className="error-message">{error.contraseña}</p>}

        <label className="form-label" htmlFor="direccion">
          DIRECCIÓN:
        </label>
        <input className="input-is" onChange={handleChange} value={state.direccion} type="text" name="direccion" autoComplete="off" />
        {error.direccion && <p className="error-message">{error.direccion}</p>}

        <label className="form-label" htmlFor="info_contacto">
          INFO DE CONTACTO:
        </label>
        <input className="input-is" onChange={handleChange} value={state.info_contacto} type="text" name="info_contacto" autoComplete="off" />
        {error.info_contacto && <p className="error-message">{error.info_contacto}</p>}

        <button className={`form-button ${isValid ? "valid-button" : "invalid-button"}`} disabled={!isValid} onClick={handleSubmit} type="submit">
          Crear
        </button>

        <Link className="home-form" to="/">
          Volver a la Home
        </Link>

        <Link className="home-form" to="/iniciar">
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
};

export default NewUser;
