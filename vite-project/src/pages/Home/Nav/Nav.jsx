import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getProductos } from "../../../redux/action";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
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

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(getProductos());
  };

  return (
    <nav className="back-nav">
      <div className="nav-content">
        <button
          className="menu-button"
          onClick={() => setShowCategories(!showCategories)}
        >
          Categorías
        </button>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && <button onClick={handleClearSearch}>X</button>}
        </div>

       {window.location.pathname !== '/carrito' && (
                    <Link to="/carrito">
                        <button className="carrito-nav">
                            <FontAwesomeIcon icon={faShoppingCart} />
                            <span className="cart-counter"></span> {/* Contador del carrito */}
                        </button>
                    </Link>
                )}
      {/* Menú de filtros (dropdown-style) */}
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
