import { useState } from "react";
import { Link } from "react-router-dom";

import ProductModal from "./productModal";
import ProductPrice from "./productPrice";
import ProductActions from "./productoActions";
import "./card.css"

const ProductCard = ({ product }) => {

  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="product-card">

        {/* IMAGEN */}

        <Link to={`/detail/${product.id}`}>

          <div className="product-image-wrapper">

            <img
              src={product?.variantes?.[0]?.imagenes?.[0]}
              alt={product.nombre}
              className="product-image"
            />

          </div>

        </Link>

        {/* INFO */}

        <div className="product-info">

          <span className="product-category">
            {product.categoria}
          </span>

          <h3 className="product-title">
            {product.nombre}
          </h3>

          <p className="product-description">
            {product.descripcion}
          </p>

          {/* PRECIO */}

          <ProductPrice
            precio={product.precio}
            oferta={product.oferta}
          />

        </div>

        {/* ACTIONS */}

        <ProductActions
          onAddCart={() => setOpenModal(true)}
        />

      </div>

      {/* MODAL */}

      <ProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;