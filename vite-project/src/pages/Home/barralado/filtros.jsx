import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterProduc, orderProducto } from "../../../redux/action";
import { categoria } from "./categorias";
import { Link } from "react-router-dom";

const FiltrosSidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedPriceOrder,
  setSelectedPriceOrder,
}) => {
  const [mostrarF, setMostrarF] = useState(true);
  const [mostrarO, setMostrarO] = useState(false);
  const [precio, setPrecio] = useState(false);
  const [showSubcategories, setShowSubcategories] = useState(true);

  const allProductos = useSelector((state) => state.allProductos);
  const dispatch = useDispatch();

  const toggleFiltros = () => {
    setMostrarF(!mostrarF);
    setShowSubcategories(true);
  };

  const toggleOrden = () => {
    setMostrarO(!mostrarO);
  };

  const handleFilter = (category, subcategory) => {
    let filteredProducts = allProductos;

    if (!subcategory && selectedCategory !== category) {
      setSelectedCategory(category);
      setSelectedSubcategory("");
      dispatch(filterProduc({ categoria: category, subcategoria: "", allProductos: filteredProducts }));
    } else if (!subcategory && selectedCategory === category) {
      setSelectedCategory("");
      setSelectedSubcategory("");
      dispatch(filterProduc({ categoria: "", subcategoria: "", allProductos }));
    } else if (subcategory) {
      filteredProducts = filteredProducts.filter(
        (producto) =>
          producto.categoria?.toLowerCase() === category.toLowerCase() &&
          producto.subcategoria?.toLowerCase() === subcategory.toLowerCase()
      );

      setSelectedCategory(category);
      setSelectedSubcategory(subcategory);
      dispatch(filterProduc({ categoria: category, subcategoria: subcategory, allProductos: filteredProducts }));
    }
  };

  const handleOrder = (orderType) => {
    if (orderType === selectedPriceOrder) {
      unselectOrder();
    } else {
      setSelectedPriceOrder(orderType);
      dispatch(orderProducto(orderType));
    }
  };

  const unselectOrder = () => {
    setSelectedPriceOrder("");
    dispatch(orderProducto(""));
  };

  return (
    <div className={`sidebar ${mostrarF ? "show" : ""}`}>
      <button className="button-filtros" onClick={toggleFiltros}>
        FILTRAR POR:
      </button>
      {mostrarF && (
        <ul className="ul-filtros">
          {Object.entries(categoria).map(([cat, subcats]) => (
            <div key={cat}>
              <button
                className={selectedCategory === cat ? "button-selected" : "button-talles"}
                onClick={() => handleFilter(cat, "")}
              >
                {cat}
              </button>
              {showSubcategories && selectedCategory === cat && subcats.length > 0 && (
                <ul>
                  {subcats.map((sub) => (
                    <li key={sub}>
                      <button
                        className={selectedSubcategory === sub ? "button-selected" : "button-sub-categoria"}
                        onClick={() => handleFilter(cat, sub)}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
      )}

      <hr className="divider" />
      <button className="button-filtros" onClick={toggleOrden}>
        ORDENAR POR:
      </button>
      {mostrarO && (
        <ul className="ul-filtros">
          <button className="button-filtros" onClick={() => setPrecio(!precio)}>
            Precio
          </button>
          {precio && (
            <div>
              <button
                className={selectedPriceOrder === "precioAsc" ? "button-selected" : "button-talles"}
                onClick={() => handleOrder("precioAsc")}
              >
                Menor a Mayor
              </button>
              <button
                className={selectedPriceOrder === "precioDesc" ? "button-selected" : "button-talles"}
                onClick={() => handleOrder("precioDesc")}
              >
                Mayor a Menor
              </button>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default FiltrosSidebar;
