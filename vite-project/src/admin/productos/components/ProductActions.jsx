import React from "react";

import {
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";

import {
  faPencilAlt,
  faTrash,
  faPercent,
} from "@fortawesome/free-solid-svg-icons";

import "../styles/ProductActions.css";

const ProductActions = ({
  productId,
  onEdit,
  onDelete,
  onOferta,
}) => {
  return (
    <div className="product-actions">

      <button
        className="btn-action btn-edit"
        onClick={() =>
          onEdit(productId)
        }
      >
        <FontAwesomeIcon
          icon={faPencilAlt}
        />

        Editar
      </button>

      <button
        className="btn-action btn-offer"
        onClick={() =>
          onOferta(productId)
        }
      >
        <FontAwesomeIcon
          icon={faPercent}
        />

        Oferta
      </button>

      <button
        className="btn-action btn-delete"
        onClick={() =>
          onDelete(productId)
        }
      >
        <FontAwesomeIcon
          icon={faTrash}
        />

        Eliminar
      </button>

    </div>
  );
};

export default ProductActions;