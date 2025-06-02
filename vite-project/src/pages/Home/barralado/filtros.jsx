import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterProduc, orderProducto } from "../../../redux/action";
import { categoria } from "./categorias";
import { Link } from "react-router-dom";

const FiltrosSidebar = () => {
  const dispatch = useDispatch();
  const allProductos = useSelector((state) => state.allProductos);
  const filters = useSelector((state) => state.filters); // filtros globales de Redux
  
  // Estados para mostrar/ocultar menús
  const [mostrarF, setMostrarF] = useState(false);
  const [mostrarO, setMostrarO] = useState(false);
  const [precio, setPrecio] = useState(false);

  // Estados locales para UI, sincronizados con filtros globales
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPriceOrder, setSelectedPriceOrder] = useState("");



  // Toggle menú filtro sin tocar filtros
  const toggleFiltros = () => {
    setMostrarF((prev) => !prev);
  };

  // Toggle menú orden sin tocar filtros
  const toggleOrden = () => {
    setMostrarO((prev) => !prev);
  };

  // Maneja la selección de categoría y subcategoría
  const handleFilter = (category, subcategory) => {
    let filteredProducts = allProductos;

    if (!subcategory && selectedCategory !== category) {
      // Filtrar solo por categoría
      setSelectedCategory(category);
      setSelectedSubcategory("");
      dispatch(
        filterProduc({ categoria: category, subcategoria: "", allProductos: filteredProducts })
      );
    } else if (!subcategory && selectedCategory === category) {
      // Deseleccionar categoría
      setSelectedCategory("");
      setSelectedSubcategory("");
      dispatch(filterProduc({ categoria: "", subcategoria: "", allProductos }));
    } else if (subcategory) {
      // Filtrar por categoría y subcategoría
      filteredProducts = filteredProducts.filter(
        (p) => p.categoria?.toLowerCase() === category.toLowerCase()
      );
      filteredProducts = filteredProducts.filter(
        (p) => p.subcategoria?.toLowerCase() === subcategory.toLowerCase()
      );
      setSelectedCategory(category);
      setSelectedSubcategory(subcategory);
      dispatch(
        filterProduc({ categoria: category, subcategoria: subcategory, allProductos: filteredProducts })
      );
    }
  };

  // Maneja la ordenación por precio
  const handleOrder = (orderType) => {
    if (orderType === selectedPriceOrder) {
      unselectOrder();
    } else {
      setSelectedPriceOrder(orderType);
      dispatch(orderProducto(orderType));
    }
  };

  // Deseleccionar orden
  const unselectOrder = () => {
    setSelectedPriceOrder("");
    dispatch(orderProducto(""));
  };

  return (
    <div className="sidebar">
      <button className="button-filtros" onClick={toggleFiltros}>
        FILTRAR POR:
      </button>
      {mostrarF && (
        <div>
          <ul className="ul-filtros">
            {Object.entries(categoria).map(([categoriaPrincipal, subcategorias]) => (
              <div key={categoriaPrincipal}>
                <button
                  className={selectedCategory === categoriaPrincipal ? "button-selected" : "button-talles"}
                  onClick={() => handleFilter(categoriaPrincipal, "")}
                >
                  {categoriaPrincipal}
                </button>
                {selectedCategory === categoriaPrincipal && subcategorias.length > 0 && (
                  <ul>
                    {subcategorias.map((subcategoria) => (
                      <li key={subcategoria}>
                        <button
                          className={selectedSubcategory === subcategoria ? "button-selected" : "button-sub-categoria"}
                          onClick={() => handleFilter(categoriaPrincipal, subcategoria)}
                        >
                          {subcategoria}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>
        </div>
      )}
      <hr className="divider" />
      <button className="button-filtros" onClick={toggleOrden}>
        ORDENAR POR:
      </button>
      {mostrarO && (
        <div>
          <ul className="ul-filtros">
            <button className="button-filtros" onClick={() => setPrecio((prev) => !prev)}>
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
        </div>
      )}
      {window.innerWidth < 800 && (
        <div className="links-container">
          <Link to="/">
            <button className="superior-barra">Inicio</button>
          </Link>
          <Link to="/DevolucionCambio">
            <button className="superior-barra">Cambio/Devolucion</button>
          </Link>
          <Link to="/comoPagar">
            <button className="superior-barra">Venta por mayor</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FiltrosSidebar;

