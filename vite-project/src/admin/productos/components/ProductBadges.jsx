import React from "react";

import "../styles/ProductBadges.css";

const ProductBadges = ({
  variantes = [],
}) => {
  const tallas = [
    ...new Set(
      variantes.map(
        (v) => v.talla
      )
    ),
  ];

  const colores = [
    ...new Set(
      variantes.map(
        (v) => v.color
      )
    ),
  ];

  return (
    <div className="product-badges">

      <div className="badge-group">

        <span className="badge-title">
          Tallas
        </span>

        <div className="badges">

          {tallas.map(
            (talla, index) => (
              <span
                key={index}
                className="badge badge-size"
              >
                {talla}
              </span>
            )
          )}

        </div>

      </div>

      <div className="badge-group">

        <span className="badge-title">
          Colores
        </span>

        <div className="badges">

          {colores.map(
            (color, index) => (
              <span
                key={index}
                className="badge badge-color"
              >
                {color}
              </span>
            )
          )}

        </div>

      </div>

    </div>
  );
};

export default ProductBadges;