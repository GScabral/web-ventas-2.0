import React from "react";
import "./PublishCard.css";

const PublishCard = ({
  loading,
  variantesData,
  productName,
  productPrice,
}) => {
  return (
    <div className="publish-card">

      <div className="publish-header">
        <h2>Publicación</h2>
        <p>Resumen rápido del producto</p>
      </div>

      <div className="publish-info">

        <div className="publish-item">
          <span>Producto</span>
          <strong>
            {productName || "Sin nombre"}
          </strong>
        </div>

        <div className="publish-item">
          <span>Precio</span>
          <strong>
            {productPrice
              ? `$${productPrice}`
              : "$0"}
          </strong>
        </div>

        <div className="publish-item">
          <span>Variantes</span>
          <strong>
            {variantesData.length}
          </strong>
        </div>

      </div>

      <button
        type="submit"
        className="publish-button"
        disabled={loading}
      >
        {loading
          ? "Guardando..."
          : "Guardar Producto"}
      </button>

    </div>
  );
};

export default PublishCard;