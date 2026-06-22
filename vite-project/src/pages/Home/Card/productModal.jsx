import { useState } from "react";
import { Link } from "react-router-dom";
import { agregarAlCarrito } from "../../../redux/action";
import { useDispatch } from "react-redux";

const ProductModal = ({
  open,
  onClose,
  product
}) => {

  const dispatch = useDispatch()
  const [talla, setTalla] = useState("");
  const [color, setColor] = useState("");
  const [cantidad, setCantidad] = useState(1);

  if (!open) return null;

  const tallas = [
    ...new Set(
      product.variantes.map(v => v.talla)
    )
  ];

  const colores = product.variantes
    .filter(v => v.talla === talla)
    .map(v => v.color);

  const imagenPrincipal =
    product?.variantes?.[0]?.imagenes?.[0];

  const handleAgregarCarrito = () => {
    if (!talla) {
      alert("Seleccione una talla");
      return;
    }

    if (!color) {
      alert("Seleccione un color");
      return;
    }

    const varianteSeleccionada = product.variantes.find(
      v => v.talla === talla && v.color === color
    );

    const productoCarrito = {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      cantidad,
      talla,
      color,
      idVariante: varianteSeleccionada?.idVariante,
      imagen: varianteSeleccionada?.imagenes?.[0]
    };


    dispatch(agregarAlCarrito (productoCarrito))
  };
  return (

    <div
      className="product-modal-overlay"
      onClick={onClose}
    >

      <div
        className="product-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE */}

        <button
          className="close-modal"
          onClick={onClose}
        >
          ×
        </button>

        {/* LEFT */}

        <div className="modal-left">

          <img
            src={imagenPrincipal}
            alt={product.nombre}
            className="modal-image"
          />

        </div>

        {/* RIGHT */}

        <div className="modal-right">

          <span className="modal-category">
            {product.categoria.nombre}
          </span>

          <h2 className="modal-title">
            {product.nombre}
          </h2>

          <p className="modal-description">
            {product.descripcion}
          </p>

          <h3 className="modal-price">
            ${product.precio}
          </h3>

          {/* TALLES */}

          <div className="modal-section">

            <label>Talle</label>

            <div className="sizes-grid">

              {tallas.map((t, i) => (

                <button
                  key={i}
                  className={`size-btn ${talla === t ? "active" : ""
                    }`}
                  onClick={() => setTalla(t)}
                >
                  {t}
                </button>

              ))}

            </div>

          </div>

          {/* COLORES */}

          {talla && (

            <div className="modal-section">

              <label>Color</label>

              <div className="colors-grid">

                {colores.map((c, i) => (

                  <button
                    key={i}
                    className={`color-btn ${color === c ? "active" : ""
                      }`}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>

                ))}

              </div>

            </div>

          )}

          {/* CANTIDAD */}

          <div className="quantity-row">

            <button
              onClick={() =>
                setCantidad(prev =>
                  Math.max(1, prev - 1)
                )
              }
            >
              -
            </button>

            <span>{cantidad}</span>

            <button
              onClick={() =>
                setCantidad(prev => prev + 1)
              }
            >
              +
            </button>

          </div>

          {/* ACTIONS */}

          <div className="modal-actions">

            <button
              className="confirm-cart-btn"
              onClick={handleAgregarCarrito}
            >
              Agregar al carrito
            </button>

            <Link
              to={`/detail/${product.id}`}
              className="see-detail-btn"
            >
              Ver detalle
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductModal;