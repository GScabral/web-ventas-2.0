import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getProductos } from "../../../redux/action";
import FiltrosSidebar from "../barralado/filtros";
import "./Nav.css";

const Nav = () => {
  const dispatch = useDispatch();
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Estado de los filtros (movido acá)
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPriceOrder, setSelectedPriceOrder] = useState("");

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(getProductos());
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
          {searchTerm && <button onClick={handleClearSearch}>X</button>}
        </div>
      </div>

      {/* ✅ Monta/desmonta FiltrosSidebar pero mantiene estado arriba */}
      {showCategories && (
        <FiltrosSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          selectedPriceOrder={selectedPriceOrder}
          setSelectedPriceOrder={setSelectedPriceOrder}
        />
      )}
    </nav>
  );
};

export default Nav;
