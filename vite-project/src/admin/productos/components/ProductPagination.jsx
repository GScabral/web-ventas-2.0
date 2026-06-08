import React from "react";

import {
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import "../styles/ProductPagination.css";

const ProductPagination = ({
  currentPage,
  totalPages,
  onChangePage,
}) => {
  return (
    <div className="pagination-container">

      <button
        className="pagination-arrow"
        disabled={currentPage === 1}
        onClick={() =>
          onChangePage("prev")
        }
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
        />
      </button>

      <div className="pagination-pages">

        {Array.from(
          { length: totalPages },
          (_, index) => (
            <button
              key={index}
              className={
                currentPage ===
                index + 1
                  ? "page-btn active"
                  : "page-btn"
              }
              onClick={() =>
                onChangePage(
                  index + 1
                )
              }
            >
              {index + 1}
            </button>
          )
        )}

      </div>

      <button
        className="pagination-arrow"
        disabled={
          currentPage ===
          totalPages
        }
        onClick={() =>
          onChangePage("next")
        }
      >
        <FontAwesomeIcon
          icon={faArrowRight}
        />
      </button>

    </div>
  );
};

export default ProductPagination;