import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getProductos, buscar } from "../../../redux/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import FiltrosSidebar from "../barralado/filtros";
import "./Nav.css";

const Nav = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPriceOrder, setSelectedPriceOrder] = useState("");

  let selectedMainCategory = "";
  if (location.pathname.startsWith("/Accesorios")) selectedMainCategory = "Accesorios";
  else if (location.pathname.startsWith("/Maquillaje")) selectedMainCategory = "Maquillaje";
  else selectedMainCategory = "Ropa";

  const handleSearchChange = e => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(buscar(value));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(getProductos());
  };

  return (
    <nav className="nav-boutique">
      <div className="nav-inner">

        {/* BURGER */}
        <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        <h1 className="nav-logo">"NOMBRE"</h1>

        {/* CART */}
        {window.location.pathname !== "/carrito" && (
          <Link to="/carrito">
            <button className="nav-cart">
              <FontAwesomeIcon icon={faShoppingCart} />
            </button>
          </Link>
        )}
      </div>

      {/* MENU */}
      <div className={`nav-menu ${menuOpen ? "show" : ""}`}>

        <button
          className="nav-link dropdown-btn"
          onClick={() => setShowCategories(!showCategories)}
        >
          {showCategories ? "Cerrar filtros ▲" : "Filtros ▼"}
        </button>

        {/* NUEVO DROPDOWN ANIMADO */}
        <div className={`dropdown-card ${showCategories ? "open" : ""}`}>
          <FiltrosSidebar
            selectedMainCategory={selectedMainCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedPriceOrder={selectedPriceOrder}
            setSelectedPriceOrder={setSelectedPriceOrder}
          />
        </div>
      </div>
    </nav>
  );
};

export default Nav;



{/* <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
          Ropa
        </Link>

        <Link to="/Accesorios" className="nav-link" onClick={() => setMenuOpen(false)}>
          Accesorios
        </Link>

        <Link to="/Maquillaje" className="nav-link" onClick={() => setMenuOpen(false)}>
          Maquillaje
        </Link> */}