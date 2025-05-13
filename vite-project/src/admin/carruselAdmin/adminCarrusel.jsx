import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadImage } from "./redux/actions";
import './carruselAdmin.css'; // Nuevo archivo de estilos

const AdminCarrusel = () => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      dispatch(uploadImage(selectedFile));
    }
  };

  return (
    <div className="carrusel-admin-container">
      <label className="carrusel-admin-label" htmlFor="file-input">Seleccionar imagen:</label>
      <input
        id="file-input"
        type="file"
        onChange={handleFileChange}
        className="carrusel-admin-input"
      />
      <button onClick={handleUpload} className="carrusel-admin-button">
        Subir imagen
      </button>
    </div>
  );
};

export default AdminCarrusel;
