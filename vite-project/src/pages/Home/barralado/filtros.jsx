import React, {
  useState,
  useEffect
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

const FiltrosSidebar = ({ selectedMainCategory, selectedSubcategory, setSelectedSubcategory, selectedPriceOrder, setSelectedPriceOrder, }) => {

  const dispatch = useDispatch();

  const categorias = useSelector(state => state.categorias || []);

  const categoriasFiltradas = categorias;

  const [precioMax, setPrecioMax] =
    useState(50000);

  const [tallas, setTallas] =
    useState([]);

  const [colores, setColores] =
    useState([]);

  useEffect(() => {
    dispatch(getCategorias());
  }, [dispatch]);



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

  const handleFilter = (subcategory) => {

    const nuevaCategoria =
      selectedSubcategory === subcategory
        ? ""
        : subcategory;

    setSelectedSubcategory(
      nuevaCategoria
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