import React from "react";
import "./PublishCard.css";

const PublishCard = ({
  stepNumber,
  loading,
  variantesData,
  productName,
  productPrice,
  checklist = [],
  isReadyToPublish,
}) => {
  return (
    <div className="publish-card">

      <div className="publish-header">
        <h2>
          {stepNumber && (
            <span className="step-badge">
              {stepNumber}
            </span>
          )}
          Publicación
        </h2>
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

      {checklist.length > 0 && (
        <ul className="publish-checklist">
          {checklist.map((item) => (
            <li
              key={item.label}
              className={
                item.done ? "done" : "pending"
              }
            >
              <span className="check-icon">
                {item.done ? "✓" : "○"}
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        className="publish-button"
        disabled={loading || !isReadyToPublish}
      >
        {loading
          ? "Guardando..."
          : "Guardar Producto"}
      </button>

      {!isReadyToPublish && !loading && (
        <p className="publish-hint">
          Completá los puntos marcados arriba
          para poder publicar.
        </p>
      )}

    </div>
  );
};

export default PublishCard;