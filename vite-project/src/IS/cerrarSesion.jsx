import React ,{useState}from "react";
import { useDispatch } from "react-redux";
import { cerrarSesion } from "../redux/action"; // Acción para cerrar sesión

const CerrarSesion = () => {
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);


  const handleLogout = () => {
    if (showConfirmation) {
      dispatch(cerrarSesion()); // Llama a la acción de cerrar sesión
      // Otra lógica de limpieza de estado, redireccionamiento, etc.
    } else {
      setShowConfirmation(true); // Muestra el cuadro de confirmación
    }
  };

  const cancelLogout = () => {
    setShowConfirmation(false); // Oculta el cuadro de confirmación
  };

  return (
    <div>
      {showConfirmation ? (
        <div>
          <p>¿Estás seguro de que deseas cerrar sesión?</p>
          <button onClick={handleLogout}>Sí, cerrar sesión</button>
          <button onClick={cancelLogout}>Cancelar</button>
        </div>
      ) : (
        <button onClick={handleLogout}>Cerrar Sesión</button>
      )}
    </div>
  );
};

export default CerrarSesion;