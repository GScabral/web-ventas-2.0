import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getProductos } from "../../../redux/actions";
import FiltrosSidebar from "../barralado/filtros";
import "./nav.css"; // Asegurate de tener tus estilos acá

const Nav = () => {
  const dispatch = useDispatch();
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(getProductos()); // Esto podría mejorarse si querés evitar recargar todo
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <button onClick={() => setShowCategories(!showCategories)}>
          Categorías
        </button>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={handleClearSearch}>X</button>
          )}
        </div>
      </div>

      {/* ✅ El componente FiltrosSidebar siempre montado */}
      <div
        className="sidebar-wrapper"
        style={{ display: showCategories ? "block" : "none" }}
      >
        <FiltrosSidebar />
      </div>
    </nav>
  );
};

export default Nav;
