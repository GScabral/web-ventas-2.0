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

  // Estados locales para UI sincronizados con Redux
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPriceOrder, setSelectedPriceOrder] = useState("");

  // Sincronizar estados locales con Redux
  useEffect(() => {
    setSelectedCategory(filters.categoria || "");
    setSelectedSubcategory(filters.subcategoria || "");
    setSelectedPriceOrder(filters.order || "");
  }, [filters]);

  // Toggle menú de filtros
  const toggleFiltros = () => {
    setMostrarF((prev) => !prev);
  };

  // Toggle menú de orden
  const toggleOrden = () => {
    setMostrarO((prev) => !prev);
  };

  // Manejar filtros (solo despacha, Redux hace la lógica)
  const handleFilter = (category, subcategory) => {
    if (!subcategory && selectedCategory !== category) {
      dispatch(filterProduc({ categoria: category, subcategoria: "" }));
    } else if (!subcategory && selectedCategory === category) {
      dispatch(filterProduc({ categoria: "", subcategoria: "" }));
    } else if (subcategory) {
      dispatch(filterProduc({ categoria: category, subcategoria: subcategory }));
    }
  };

  // Manejar ordenamiento por precio
  const handleOrder = (orderType) => {
    if (orderType === selectedPriceOrder) {
      unselectOrder();
    } else {
      dispatch(orderProducto(orderType));
    }
  };

  // Quitar ordenamiento
  const unselectOrder = () => {
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
     
    </div>
  );
};

export default FiltrosSidebar;

