import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getProductos, buscar } from "../../../redux/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import FiltrosSidebar from "../barralado/filtros";
import "./Nav.css";

const Nav = () => {
  const dispatch = useDispatch();
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado de los filtros
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPriceOrder, setSelectedPriceOrder] = useState("");

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
      <div className="nav-content">
        {/* Botón de categorías */}
        <button
          className="menu-button"
          onClick={() => setShowCategories(!showCategories)}
        >
          Categorías
        </button>

        {/* Input de búsqueda */}
        {window.location.pathname !== '/carrito' && (
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
        )}

        {/* Botón del carrito */}
        {window.location.pathname !== '/carrito' && (
          <Link to="/carrito">
            <button className="carrito-nav">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="cart-counter"></span>
            </button>
          </Link>
        )}
      </div>

      {/* Menú de filtros */}
      {showCategories && (
        <div className="dropdown-menu show">
          <FiltrosSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedPriceOrder={selectedPriceOrder}
            setSelectedPriceOrder={setSelectedPriceOrder}
          />
        </div>
      )}
    </nav>
  );
};

export default Nav;
