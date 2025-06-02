import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterProduc, orderProducto } from "../../../redux/action";
import { categoria } from "./categorias";
import { Link } from "react-router-dom";

const FiltrosSidebar = () => {
  const dispatch = useDispatch();
  const allProductos = useSelector(state => state.allProductos);
  const filters = useSelector(state => state.filters); // Obtenemos filtros globales
  
  const [mostrarF, setMostrarF] = useState(false);
  const [mostrarO, setMostrarO] = useState(false);
  const [precio, setPrecio] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPriceOrder, setSelectedPriceOrder] = useState("");

  useEffect(() => {
    setSelectedCategory(filters.categoria || "");
    setSelectedSubcategory(filters.subcategoria || "");
  }, [filters]);

  const toggleFiltros = () => {
    setMostrarF(!mostrarF);
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
      filteredProducts = filteredProducts.filter(producto =>
        producto.categoria && producto.categoria.toLowerCase() === category.toLowerCase()
      );
      filteredProducts = filteredProducts.filter(producto =>
        producto.subcategoria && producto.subcategoria.toLowerCase() === subcategory.toLowerCase()
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
    <div className="sidebar">
      <button className="button-filtros" onClick={toggleFiltros}>FILTRAR POR:</button>
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
      <button className="button-filtros" onClick={toggleOrden}>ORDENAR POR:</button>
      {mostrarO && (
        <div>
          <ul className="ul-filtros">
            <button className="button-filtros" onClick={() => setPrecio(!precio)}>Precio</button>
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
        </div>
      )}
    </div>
  );
};

export default FiltrosSidebar;
