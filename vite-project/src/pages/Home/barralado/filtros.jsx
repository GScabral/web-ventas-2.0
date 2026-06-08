
import React, {
  useState,
  useEffect
} from "react";

import { useDispatch } from "react-redux";

import {
  filterProduc,
  orderProducto
} from "../../../redux/action";

import {
  categoriasGlobal
} from "./categorias";

import "./filtros.css";

/* =========================
   DATA
========================= */

const tallasDisponibles = [
  "XS",
  "S",
  "M",
  "L",
  "XL"
];

const coloresDisponibles = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#002B81",
  "#5D8BE8"
];

/* =========================
   COMPONENT
========================= */

const FiltrosSidebar = ({
  selectedMainCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedPriceOrder,
  setSelectedPriceOrder,
}) => {

  const dispatch = useDispatch();

  const categorias =
    categoriasGlobal[selectedMainCategory] || {};

  /* =========================
     STATES
  ========================= */

  const [precioMax, setPrecioMax] =
    useState(50000);

  const [tallas, setTallas] =
    useState([]);

  const [colores, setColores] =
    useState([]);

  /* =========================
     EFFECT FILTROS
  ========================= */

  useEffect(() => {

    dispatch(
      filterProduc({
        rama: selectedMainCategory || "",
        categoria: selectedSubcategory || "",
        subcategoria: "",
        tallas,
        colores,
        precioMax
      })
    );

  }, [
    tallas,
    colores,
    precioMax,
    selectedSubcategory,
    selectedMainCategory,
    dispatch
  ]);

  /* =========================
     CATEGORY FILTER
  ========================= */

  const handleFilter = (subcategory) => {

    const nuevaCategoria =
      selectedSubcategory === subcategory
        ? ""
        : subcategory;

    setSelectedSubcategory(
      nuevaCategoria
    );
  };

  /* =========================
     ORDER
  ========================= */

  const handleOrder = (orderType) => {

    if (orderType === selectedPriceOrder) {

      setSelectedPriceOrder("");

      dispatch(orderProducto(""));

    } else {

      setSelectedPriceOrder(orderType);

      dispatch(orderProducto(orderType));
    }
  };

  /* =========================
     TOGGLE TALLA
  ========================= */

  const toggleTalla = (t) => {

    setTallas(prev =>

      prev.includes(t)
        ? prev.filter(x => x !== t)
        : [...prev, t]

    );
  };

  /* =========================
     TOGGLE COLOR
  ========================= */

  const toggleColor = (c) => {

    setColores(prev =>

      prev.includes(c)
        ? prev.filter(x => x !== c)
        : [...prev, c]

    );
  };

  /* =========================
     RESET FILTERS
  ========================= */

  const limpiarFiltros = () => {

    setSelectedSubcategory("");

    setPrecioMax(50000);

    setTallas([]);

    setColores([]);

    setSelectedPriceOrder("");

    dispatch(orderProducto(""));

    dispatch(
      filterProduc({
        rama: selectedMainCategory || "",
        categoria: "",
        subcategoria: "",
        tallas: [],
        colores: [],
        precioMax: 50000
      })
    );
  };

  /* =========================
     RENDER
  ========================= */

  return (

    <div className="modern-filters">

      {/* HEADER */}

      <div className="filters-top">

        <h2 className="filters-title">
          Filtros
        </h2>

        {/* <button
          className="clear-filters-btn"
          onClick={limpiarFiltros}
        >
          Limpiar
        </button> */}

      </div>

      {/* =========================
          CATEGORIAS
      ========================= */}

      <div className="filter-group">

        <span className="filter-label">
          Categorías
        </span>

        <div className="chips-row">

          {Object.keys(categorias).map(subcat => (

            <button
              key={subcat}
              className={`filter-chip ${selectedSubcategory === subcat
                ? "active"
                : ""
                }`}
              onClick={() =>
                handleFilter(subcat)
              }
            >
              {subcat}
            </button>

          ))}

        </div>

      </div>

      {/* =========================
          PRECIO
      ========================= 

      <div className="filter-group">

        <span className="filter-label">
          Precio máximo
        </span>

        <div className="price-filter">

          <input
            type="range"
            min="1000"
            max="50000"
            step="500"
            value={precioMax}
            onChange={(e) =>
              setPrecioMax(
                Number(e.target.value)
              )
            }
          />

          <span className="price-value">
            ${precioMax}
          </span>

        </div>

      </div>
*/}
      {/* =========================
          TALLAS
      ========================= 

      <div className="filter-group">

        <span className="filter-label">
          Tallas
        </span>

        <div className="chips-row">

          {tallasDisponibles.map(t => (

            <button
              key={t}
              className={`size-chip ${tallas.includes(t)
                ? "selected"
                : ""
                }`}
              onClick={() => toggleTalla(t)}
            >
              {t}
            </button>

          ))}

        </div>

      </div>
*/}
      {/* =========================
          COLORES
      ========================= 

      <div className="filter-group">

        <span className="filter-label">
          Colores
        </span>

        <div className="colors-row">

          {coloresDisponibles.map(c => (

            <button
              key={c}
              className={`color-circle ${colores.includes(c)
                ? "selected"
                : ""
                }`}
              style={{
                background: c
              }}
              onClick={() => toggleColor(c)}
            />

          ))}

        </div>

      </div>
*/}
      {/* =========================
          ORDEN
      ========================= */}

      <div className="filter-group">

        <span className="filter-label">
          Ordenar
        </span>

        <div className="chips-row">

          <button
            className={`filter-chip ${selectedPriceOrder === "precioAsc"
              ? "active"
              : ""
              }`}
            onClick={() =>
              handleOrder("precioAsc")
            }
          >
            Menor a mayor
          </button>

          <button
            className={`filter-chip ${selectedPriceOrder === "precioDesc"
              ? "active"
              : ""
              }`}
            onClick={() =>
              handleOrder("precioDesc")
            }
          >
            Mayor a menor
          </button>

        </div>

      </div>

    </div>
  );
};

export default FiltrosSidebar;
