import React from "react";
import "../detail.css";

const ProductInfo = ({ name, description, price }) => {
  return (
    <div className="product-info">

      <h1>{name}</h1>

      <p className="description">
        {description}
      </p>

      <div className="price">
        ${price}
      </div>

    </div>
  );
};

export default ProductInfo;