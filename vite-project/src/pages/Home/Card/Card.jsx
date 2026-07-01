import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import ProductModal from "./productModal";
import "./Card.css"

const ProductCard = ({ product }) => {

  const [openModal, setOpenModal] = useState(false);

  const ofertas = useSelector(state => state.ofertasActivas) || [];

  const ofertaProducto = ofertas.find(
    oferta => oferta.producto_id === product.id
  );

  const descuento = Number(ofertaProducto?.descuento || 0);

  const precioFinal = descuento > 0
    ? (product.precio * (1 - descuento / 100)).toFixed(2)
    : product.precio;

  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenModal(true);
  };

  return (
    <>
      <Link to={`/detail/${product.id}`} className="product-card">

        <div className="product-image-wrapper">

          {descuento > 0 && (
            <span className="product-badge-discount">
              -{descuento}%
            </span>
          )}

          <img
            src={product?.variantes?.[0]?.imagenes?.[0]}
            alt={product.nombre}
            className="product-image"
            loading="lazy"
          />

          <button
            type="button"
            className="product-quick-add"
            onClick={handleAddClick}
            aria-label="Agregar al carrito"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

        </div>

        <div className="product-info">

          <p className="product-title">
            {product.nombre}
          </p>

          {descuento > 0 ? (
            <div className="product-price-row">
              <span className="product-price-final">
                ${Number(precioFinal).toLocaleString("es-AR")}
              </span>
              <span className="product-price-old">
                ${Number(product.precio).toLocaleString("es-AR")}
              </span>
            </div>
          ) : (
            <span className="product-price-final">
              ${Number(product.precio).toLocaleString("es-AR")}
            </span>
          )}

        </div>

      </Link>

      <ProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;
