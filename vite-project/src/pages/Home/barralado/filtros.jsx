import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { filterProduc, orderProducto } from "../../../redux/action";
import { categoriasGlobal } from "./categorias";

const FiltrosSidebar = ({
  selectedMainCategory,   // 👈 ahora recibes la categoría principal (Ropa, Accesorios, Maquillaje)
  selectedSubcategory,
  setSelectedSubcategory,
  selectedPriceOrder,
  setSelectedPriceOrder,
}) => {
  const [mostrarF, setMostrarF] = useState(true);
  const [mostrarO, setMostrarO] = useState(false);
  const [precio, setPrecio] = useState(false);

  const dispatch = useDispatch();

  // 👉 Solo usamos la rama de categoriasGlobal que corresponde a la página
  const categorias = categoriasGlobal[selectedMainCategory] || {};

  const handleFilter = (subcategory, variante) => {
    setSelectedSubcategory(subcategory || "");

    dispatch(
      filterProduc({
        rama: selectedMainCategory || "",   // 👈 viene de Nav (Ropa, Accesorios, Maquillaje)
        categoria: subcategory || "",       // 👈 ej: Vestido, Zapatos
        subcategoria: variante || "",       // 👈 ej: de noche, casual
      })
    );
  };

  const toggleFiltros = () => {
    setMostrarF(!mostrarF);
  };

  const toggleOrden = () => {
    setMostrarO(!mostrarO);
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
          {Object.entries(categorias).map(([subcat, variantes]) => (
            <li key={subcat}>
              {/* Subcategorías */}
              <button
                className={
                  selectedSubcategory === subcat
                    ? "button-selected"
                    : "button-sub-categoria"
                }
                onClick={() =>
                  handleFilter(
                    selectedSubcategory === subcat ? "" : subcat,
                    ""
                  )
                }
              >
                {subcat}
              </button>

              {/* Variantes dentro de la subcategoría */}
              {variantes.length > 0 && selectedSubcategory === subcat && (
                <ul>
                  {variantes.map((variante) => (
                    <li key={variante}>
                      <button
                        className="button-sub-categoria"
                        onClick={() => handleFilter(subcat, variante)}
                      >
                        {variante}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      <hr className="divider" />

      <button className="button-filtros" onClick={toggleOrden}>
        ORDENAR POR:
      </button>

      {mostrarO && (
        <ul className="ul-filtros">
          <button
            className="button-filtros"
            onClick={() => setPrecio(!precio)}
          >
            Precio
          </button>

          {precio && (
            <div>
              <button
                className={
                  selectedPriceOrder === "precioAsc"
                    ? "button-selected"
                    : "button-talles"
                }
                onClick={() => handleOrder("precioAsc")}
              >
                Menor a Mayor
              </button>

              <button
                className={
                  selectedPriceOrder === "precioDesc"
                    ? "button-selected"
                    : "button-talles"
                }
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
