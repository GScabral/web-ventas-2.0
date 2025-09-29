import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getProductos, buscar } from "../../../redux/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom"; // 👈 importamos useLocation
import FiltrosSidebar from "../barralado/filtros";
import "./Nav.css";

const Nav = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // 👈 obtenemos la ruta actual

  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPriceOrder, setSelectedPriceOrder] = useState("");

  // 👇 Detectar categoría principal desde la URL
  let selectedMainCategory = "";
  if (location.pathname.startsWith("/Accesorios")) {
    selectedMainCategory = "Accesorios";
  } else if (location.pathname.startsWith("/Maquillaje")) {
    selectedMainCategory = "Maquillaje";
  } else {
    // Si estás en "/" o cualquier otra cosa, asumimos Ropa
    selectedMainCategory = "Ropa";
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(buscar(value));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(getProductos());
  };

  return (
    <nav className="back-nav">
      <div className="nav-header">
        {/* Botón Hamburguesa */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        {/* Botón carrito */}
        {window.location.pathname !== "/carrito" && (
          <Link to="/carrito">
            <button className="carrito-nav">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="cart-counter"></span>
            </button>
          </Link>
        )}
      </div>

      {/* Contenido del menú */}
      <div className={`nav-content ${menuOpen ? "show" : ""}`}>
        <button
          className="menu-button"
          onClick={() => setShowCategories(!showCategories)}
        >
          Categorías
        </button>
        <Link to={"/"} onClick={() => setMenuOpen(false)}>
          <button className="menu-button">Ropa</button>
        </Link>
        <Link to={"/Accesorios"} onClick={() => setMenuOpen(false)}>
          <button className="menu-button">Accesorios</button>
        </Link>
        <Link to={"/Maquillaje"} onClick={() => setMenuOpen(false)}>
          <button className="menu-button">Maquillaje</button>
        </Link>

        {/* Barra de búsqueda */}
        {/* {window.location.pathname !== "/carrito" && (
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="barra-buscar"
            />
            {searchTerm && (
              <button onClick={handleClearSearch} className="clear-search-btn">
                X
              </button>
            )}
          </div>
        )} */}

        {/* Filtros desplegables */}
        {showCategories && (
          <div className="dropdown-menu show">
            <FiltrosSidebar
              selectedMainCategory={selectedMainCategory} // 👈 ahora le pasamos la categoría principal
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              selectedPriceOrder={selectedPriceOrder}
              setSelectedPriceOrder={setSelectedPriceOrder}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
