import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { filterProduc, orderProducto } from "../../../redux/action";
import { categoriasGlobal } from "./categorias";
import "./barra.css";

const FiltrosSidebar = ({
  selectedMainCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedPriceOrder,
  setSelectedPriceOrder,
}) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [mostrarOrden, setMostrarOrden] = useState(false);
  const [mostrarPrecio, setMostrarPrecio] = useState(false);

  const dispatch = useDispatch();

  const categorias = categoriasGlobal[selectedMainCategory] || {};

  const handleFilter = (subcategory, variante) => {
    setSelectedSubcategory(subcategory || "");

    dispatch(
      filterProduc({
        rama: selectedMainCategory || "",
        categoria: subcategory || "",
        subcategoria: variante || "",
      })
    );
  };

  const handleOrder = (orderType) => {
    if (orderType === selectedPriceOrder) {
      setSelectedPriceOrder("");
      dispatch(orderProducto(""));
    } else {
      setSelectedPriceOrder(orderType);
      dispatch(orderProducto(orderType));
    }
  };

  return (
    <div className="filtros-card">

      <h2 className="titulo-panel">Filtros</h2>

      {/* ---- FILTRAR POR ---- */}
      <button
        className="btn-section"
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
      >
        Filtrar por
      </button>

      {mostrarFiltros && (
        <ul className="lista-filtros">

          {Object.entries(categorias).map(([subcat, variantes]) => (
            <li key={subcat} className="grupo-tarjeta">

              {/* Botón del subcat */}
              <button
                className={`btn-subcat-tarjeta ${
                  selectedSubcategory === subcat ? "activo" : ""
                }`}
                onClick={() =>
                  handleFilter(
                    selectedSubcategory === subcat ? "" : subcat,
                    ""
                  )
                }
              >
                {subcat}
              </button>

              {/* TARJETA EXPANDIBLE */}
              <div
                className={`tarjeta-contenido ${
                  selectedSubcategory === subcat ? "show" : ""
                }`}
              >
                {variantes.map((v) => (
                  <button
                    key={v}
                    className="btn-variante-tarjeta"
                    onClick={() => handleFilter(subcat, v)}
                  >
                    {v}
                  </button>
                ))}
              </div>

            </li>
          ))}

        </ul>
      )}

      <hr className="divider" />

      {/* ---- ORDENAR POR ---- */}
      <button
        className="btn-section"
        onClick={() => setMostrarOrden(!mostrarOrden)}
      >
        Ordenar por
      </button>

      {mostrarOrden && (
        <ul className="lista-filtros">
          <button
            className="btn-subcat-tarjeta"
            onClick={() => setMostrarPrecio(!mostrarPrecio)}
          >
            Precio
          </button>

          <div
            className={`tarjeta-contenido ${
              mostrarPrecio ? "show" : ""
            }`}
          >
            <button
              className={`btn-variante-tarjeta ${
                selectedPriceOrder === "precioAsc" ? "activo" : ""
              }`}
              onClick={() => handleOrder("precioAsc")}
            >
              Menor a Mayor
            </button>

            <button
              className={`btn-variante-tarjeta ${
                selectedPriceOrder === "precioDesc" ? "activo" : ""
              }`}
              onClick={() => handleOrder("precioDesc")}
            >
              Mayor a Menor
            </button>
          </div>
        </ul>
      )}
    </div>
  );
};

export default FiltrosSidebar;
