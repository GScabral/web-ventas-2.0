import React, { useEffect, useState } from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  getCategorias,
  getFacetas
} from "../../../redux/action";

import "./filtros.css";

// Antes este componente manejaba talla/color/precio como estado propio
// y disparaba las acciones FILTER/ORDER de Redux (que filtraban el
// catálogo completo ya descargado en memoria). Ahora que el catálogo se
// filtra en el servidor (useCatalogo.js), el filtro pasó a ser un
// componente "controlado": el padre (Catalogo.jsx / CatalogoSection.jsx)
// es quien tiene el estado real y decide qué pedir al backend; acá sólo
// se muestran los controles y se avisa de los cambios via props.
const FiltrosSidebar = ({
  selectedSubcategory,
  setSelectedSubcategory,
  selectedPriceOrder,
  setSelectedPriceOrder,
  tallas,
  setTallas,
  colores,
  setColores,
  precioMax,
  setPrecioMax,
}) => {

  const dispatch = useDispatch();

  // En mobile los filtros arrancan colapsados detrás de un botón
  // "Filtros" para no empujar los productos hacia abajo. En desktop el
  // CSS los muestra siempre (el botón queda oculto).
  const [abierto, setAbierto] = useState(false);

  const categorias = useSelector(state => state.categorias || []);

  // Tallas/colores/precio máximo disponibles: antes se calculaban
  // recorriendo el catálogo completo ya descargado (allProductosforFiltro).
  // Ahora los provee el backend (GET /producto/facetas) sin tener que
  // bajar todos los productos sólo para leer estos tres datos.
  const facetas = useSelector(
    state => state.facetas || { tallas: [], colores: [], precioMaximo: 0 }
  );

  const tallasDisponibles = facetas.tallas;
  const coloresDisponibles = facetas.colores;
  const precioMaximoCatalogo = facetas.precioMaximo;

  useEffect(() => {
    dispatch(getCategorias());
    dispatch(getFacetas());
  }, [dispatch]);

  const handleFilter = (subcategory) => {

    const nuevaCategoria =
      selectedSubcategory === subcategory
        ? ""
        : subcategory;

    setSelectedSubcategory(
      nuevaCategoria
    );
  };

  const toggleTalla = (talla) => {
    setTallas((previas) =>
      previas.includes(talla)
        ? previas.filter((t) => t !== talla)
        : [...previas, talla]
    );
  };

  const toggleColor = (color) => {
    setColores((previos) =>
      previos.includes(color)
        ? previos.filter((c) => c !== color)
        : [...previos, color]
    );
  };

  const handleOrder = (orderType) => {

    if (orderType === selectedPriceOrder) {

      setSelectedPriceOrder("");

    } else {

      setSelectedPriceOrder(orderType);
    }
  };

  return (

    <div className="modern-filters">

      {/* Solo visible en mobile (CSS): abre/cierra el panel de filtros. */}
      <button
        type="button"
        className={"filters-mobile-toggle" + (abierto ? " abierto" : "")}
        onClick={() => setAbierto((o) => !o)}
        aria-expanded={abierto}
      >
        <span>Filtros</span>
        <span className="filters-mobile-chevron">▾</span>
      </button>

      <div className={"filters-body" + (abierto ? " abierto" : "")}>

      <div className="filters-top">

        <h2 className="filters-title">
          Filtros
        </h2>

      </div>

      <div className="filter-group">

        <span className="filter-label">
          Categorías
        </span>

        <div className="chips-row">

          {categorias.map(categoria => (

            <button
              key={categoria.id_categoria}
              className={`filter-chip ${selectedSubcategory === categoria.nombre
                ? "active"
                : ""
                }`}
              onClick={() =>
                handleFilter(
                  categoria.nombre
                )
              }
            >
              {categoria.nombre}
            </button>

          ))}

        </div>

      </div>

      {tallasDisponibles.length > 0 && (
        <div className="filter-group">

          <span className="filter-label">
            Talla
          </span>

          <div className="chips-row">

            {tallasDisponibles.map((talla) => (

              <button
                key={talla}
                className={`filter-chip ${tallas.includes(talla) ? "active" : ""}`}
                onClick={() => toggleTalla(talla)}
              >
                {talla}
              </button>

            ))}

          </div>

        </div>
      )}

      {coloresDisponibles.length > 0 && (
        <div className="filter-group">

          <span className="filter-label">
            Color
          </span>

          <div className="chips-row">

            {coloresDisponibles.map((color) => (

              <button
                key={color}
                className={`filter-chip ${colores.includes(color) ? "active" : ""}`}
                onClick={() => toggleColor(color)}
              >
                {color}
              </button>

            ))}

          </div>

        </div>
      )}

      {precioMaximoCatalogo > 0 && (
        <div className="filter-group">

          <span className="filter-label">
            Precio hasta {" "}
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              maximumFractionDigits: 0
            }).format(precioMax ?? precioMaximoCatalogo)}
          </span>

          <input
            type="range"
            className="filter-price-range"
            min={0}
            max={precioMaximoCatalogo}
            step={100}
            value={precioMax ?? precioMaximoCatalogo}
            onChange={(e) => setPrecioMax(Number(e.target.value))}
          />

          {precioMax !== null && (
            <button
              type="button"
              className="filter-price-reset"
              onClick={() => setPrecioMax(null)}
            >
              Quitar límite de precio
            </button>
          )}

        </div>
      )}

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

      </div>{/* /filters-body */}

    </div>
  );
};

export default FiltrosSidebar;
