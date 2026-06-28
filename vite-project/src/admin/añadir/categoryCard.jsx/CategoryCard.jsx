import React from "react";
import "./CategoryCard.css";

const CategoryCard = ({
  stepNumber,
  productGrupo,
  setProductGrupo,

  categorias,

  categoriaId,
  setCategoriaId,

  nuevaCategoria,
  setNuevaCategoria,

  fieldErrors = {},
  validateField,
}) => {

  return (

    <div className="category-card">

      <div className="card-header">

        <h2>
          {stepNumber && (
            <span className="step-badge">
              {stepNumber}
            </span>
          )}
          Categorización
        </h2>

        <p>
          Organiza correctamente el producto
        </p>

      </div>

      {/* Rama */}

      <div className="form-group">

        <label>Rama</label>

        <input
          type="text"
          value={productGrupo}
          onChange={(e) =>
            setProductGrupo(
              e.target.value
            )
          }
          onBlur={(e) =>
            validateField?.(
              "productGrupo",
              e.target.value
            )
          }
          className={
            fieldErrors.productGrupo
              ? "input-error"
              : ""
          }
          placeholder="Ej: Indumentaria"
          required
        />

        {fieldErrors.productGrupo && (
          <span className="field-error">
            {fieldErrors.productGrupo}
          </span>
        )}

      </div>

      {/* Categoría existente */}

      <div className="form-group">

        <label>
          Categoría existente
        </label>

        <select
          value={categoriaId}
          onChange={(e) => {

            setCategoriaId(
              e.target.value
            );

            setNuevaCategoria("");

          }}
        >

          <option value="">
            Seleccionar categoría
          </option>

          {categorias?.map(cat => (

            <option
              key={cat.id_categoria}
              value={cat.id_categoria}
            >

              {cat.nombre}

            </option>

          ))}

        </select>

      </div>

      {/* Nueva categoría */}

      <div className="form-group">

        <label>
          O crear nueva categoría
        </label>

        <input
          type="text"
          placeholder="Ej: Remeras Deportivas"
          value={nuevaCategoria}
          onChange={(e) => {

            setNuevaCategoria(
              e.target.value
            );

            setCategoriaId("");

          }}
        />

      </div>

    </div>

  );
};

export default CategoryCard;