import React, {
  useState,
  useEffect,
  useMemo
} from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  filterProduc,
  orderProducto,
  getCategorias
} from "../../../redux/action";

import "./filtros.css";

const FiltrosSidebar = ({ selectedSubcategory, setSelectedSubcategory, selectedPriceOrder, setSelectedPriceOrder, }) => {

  const dispatch = useDispatch();

  const categorias = useSelector(state => state.categorias || []);

  const categoriasFiltradas = categorias;

  // Catálogo completo (sin paginar/filtrar) — se usa solo para saber
  // qué talles/colores existen y cuál es el precio más alto, no para
  // mostrar productos. allProductosforFiltro se llena una sola vez al
  // traer los productos y no se vuelve a tocar, así que sirve como
  // fuente estable para esto aunque haya un filtro activo.
  const catalogoCompleto = useSelector(state => state.allProductosforFiltro || []);

  // null = sin límite de precio. Importante que el default no sea un
  // número fijo (antes era 50000): eso ocultaba productos más caros
  // desde el primer render, sin que el usuario haya tocado nada.
  const [precioMax, setPrecioMax] =
    useState(null);

  const [tallas, setTallas] =
    useState([]);

  const [colores, setColores] =
    useState([]);

  const tallasDisponibles = useMemo(() => {
    const set = new Set();
    catalogoCompleto.forEach((producto) => {
      (producto.variantes || []).forEach((variante) => {
        if (variante.talla) set.add(variante.talla);
      });
    });
    return Array.from(set);
  }, [catalogoCompleto]);

  const coloresDisponibles = useMemo(() => {
    const set = new Set();
    catalogoCompleto.forEach((producto) => {
      (producto.variantes || []).forEach((variante) => {
        if (variante.color) set.add(variante.color);
      });
    });
    return Array.from(set);
  }, [catalogoCompleto]);

  const precioMaximoCatalogo = useMemo(() => {
    const precios = catalogoCompleto.map((producto) => Number(producto.precio) || 0);
    return precios.length ? Math.max(...precios) : 0;
  }, [catalogoCompleto]);

  useEffect(() => {
    dispatch(getCategorias());
  }, [dispatch]);



  useEffect(() => {

    dispatch(
      filterProduc({
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
    dispatch
  ]);

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

      dispatch(orderProducto(""));

    } else {

      setSelectedPriceOrder(orderType);

      dispatch(orderProducto(orderType));
    }
  };

  return (

    <div className="modern-filters">

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

          {categoriasFiltradas.map(categoria => (

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

    </div>
  );
};

export default FiltrosSidebar;