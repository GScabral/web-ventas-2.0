import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { agregarAlCarrito } from "../../../redux/action";
import { useDispatch } from "react-redux";

const ProductModal = ({
  open,
  onClose,
  product
}) => {

  const dispatch = useDispatch();
  const [talla, setTalla] = useState("");
  const [color, setColor] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [agregado, setAgregado] = useState(false);

  // Si el modal se cierra y se vuelve a abrir (por ejemplo, para otro
  // producto), arrancamos limpio en vez de arrastrar la selección
  // anterior.
  useEffect(() => {
    if (open) {
      setTalla("");
      setColor("");
      setCantidad(1);
      setErrorMsg("");
      setAgregado(false);
    }
  }, [open, product?.id]);

  if (!open) return null;

  const variantes = product?.variantes || [];

  const tallas = [
    ...new Set(
      variantes.map(v => v.talla)
    )
  ];

  const colores = variantes
    .filter(v => v.talla === talla)
    .map(v => v.color);

  const varianteSeleccionada = variantes.find(
    v => v.talla === talla && v.color === color
  );

  const stockDisponible = varianteSeleccionada?.cantidad_disponible ?? 0;

  const imagenPrincipal =
    varianteSeleccionada?.imagenes?.[0] ||
    variantes?.[0]?.imagenes?.[0];

  const handleAgregarCarrito = () => {

    if (!talla) {
      setErrorMsg("Seleccioná un talle.");
      return;
    }

    if (!color) {
      setErrorMsg("Seleccioná un color.");
      return;
    }

    if (!varianteSeleccionada) {
      setErrorMsg("Esa combinación de talle y color no está disponible.");
      return;
    }

    if (cantidad > stockDisponible) {
      setErrorMsg(`Solo quedan ${stockDisponible} unidades disponibles.`);
      return;
    }

    setErrorMsg("");

    dispatch(agregarAlCarrito({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      cantidad,
      // Se manda con los dos nombres a propósito: CartItem.jsx lo
      // muestra como "talla", y useCheckout.js / el backend lo leen
      // como "talle". Mandar ambos evita que el talle se pierda en
      // alguno de los dos pasos por una diferencia de nombre.
      talla,
      talle: talla,
      color,
      idVariante: varianteSeleccionada.idVariante,
      imagen: varianteSeleccionada.imagenes?.[0]
    }));

    setAgregado(true);

    setTimeout(() => {
      onClose();
    }, 900);
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

        <button
          className="close-modal"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className="modal-left">

          <img
            src={imagenPrincipal}
            alt={product.nombre}
            className="modal-image"
          />

        </div>

        <div className="modal-right">

          <span className="modal-category">
            {product.categoria?.nombre || ""}
          </span>

          <h2 className="modal-title">
            {product.nombre}
          </h2>

          <p className="modal-description">
            {product.descripcion}
          </p>

          <h3 className="modal-price">
            ${Number(product.precio).toLocaleString("es-AR")}
          </h3>

          <div className="modal-section">

            <label>Talle</label>

            <div className="sizes-grid">

              {tallas.map((t, i) => (

                <button
                  key={i}
                  className={`size-btn ${talla === t ? "active" : ""
                    }`}
                  onClick={() => {
                    setTalla(t);
                    setColor("");
                    setErrorMsg("");
                  }}
                >
                  {t}
                </button>

              ))}

            </div>

          </div>

          {talla && (

            <div className="modal-section">

              <label>Color</label>

              <div className="colors-grid">

                {colores.map((c, i) => (

                  <button
                    key={i}
                    className={`color-btn ${color === c ? "active" : ""
                      }`}
                    onClick={() => {
                      setColor(c);
                      setErrorMsg("");
                    }}
                  >
                    {c}
                  </button>

                ))}

              </div>

            </div>

          )}

          <div className="quantity-row">

            <button
              onClick={() => {
                setCantidad(prev => Math.max(1, prev - 1));
                setErrorMsg("");
              }}
            >
              -
            </button>

            <span>{cantidad}</span>

            <button
              onClick={() => {
                setCantidad(prev =>
                  varianteSeleccionada
                    ? Math.min(stockDisponible, prev + 1)
                    : prev + 1
                );
                setErrorMsg("");
              }}
            >
              +
            </button>

          </div>

          {errorMsg && (
            <p className="modal-error">
              {errorMsg}
            </p>
          )}

          <div className="modal-actions">

            <button
              className={`confirm-cart-btn ${agregado ? "added" : ""}`}
              onClick={handleAgregarCarrito}
              disabled={agregado}
            >
              {agregado ? "Agregado ✓" : "Agregar al carrito"}
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