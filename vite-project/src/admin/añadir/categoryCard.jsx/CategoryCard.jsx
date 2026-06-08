import React from "react";
import { categoriasGlobal } from "../../../pages/Home/barralado/categorias";
import "./CategoryCard.css";

const CategoryCard = ({
  productGrupo,
  setProductGrupo,
  productCategoria,
  setProductCategoria,
  productSubCategoria,
  setProductSubCategoria,
}) => {
  return (
    <div className="category-card">

      <div className="card-header">
        <h2>Categorización</h2>
        <p>Organiza correctamente el producto</p>
      </div>

      <div className="form-group">
        <label>Rama</label>

        <select
          value={productGrupo}
          onChange={(e) => {
            setProductGrupo(e.target.value);
            setProductCategoria("");
            setProductSubCategoria("");
          }}
          required
        >
          <option value="">
            Selecciona una rama
          </option>

          {Object.keys(categoriasGlobal).map(
            (rama) => (
              <option
                key={rama}
                value={rama}
              >
                {rama}
              </option>
            )
          )}
        </select>
      </div>

      {productGrupo && (
        <div className="form-group">

          <label>Categoría</label>

          <select
            value={productCategoria}
            onChange={(e) => {
              setProductCategoria(
                e.target.value
              );

              setProductSubCategoria("");
            }}
            required
          >
            <option value="">
              Selecciona categoría
            </option>

            {Object.keys(
              categoriasGlobal[productGrupo]
            ).map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))}
          </select>

        </div>
      )}

      {productCategoria &&
        Array.isArray(
          categoriasGlobal[productGrupo][
            productCategoria
          ]
        ) && (
          <div className="form-group">

            <label>Subcategoría</label>

            <select
              value={productSubCategoria}
              onChange={(e) =>
                setProductSubCategoria(
                  e.target.value
                )
              }
            >
              <option value="">
                Selecciona subcategoría
              </option>

              {categoriasGlobal[
                productGrupo
              ][productCategoria].map(
                (sub, i) => (
                  <option
                    key={i}
                    value={sub}
                  >
                    {sub}
                  </option>
                )
              )}
            </select>

          </div>
        )}

    </div>
  );
};

export default CategoryCard;