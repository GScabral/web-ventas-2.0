import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import VariantPicker from "./VariantSelector";
import "../styles/buybox.css";

// Antes, en pantallas anchas, la columna de al lado de la galería
// terminaba con el botón "Agregar al carrito" y dejaba un bloque de
// espacio vacío hasta el pie de la galería — la sensación era de una
// ficha de producto a medio terminar. Esto agrega la info de
// confianza típica de e-commerce (envío, cambios, medios de pago) que
// además es información real y útil, no solo relleno visual.
const InfoConfianza = () => {

    const configuracion = useSelector(state => state.configuracion);

    const envioGratisDesde = configuracion?.envio_gratis_desde;

    return (
        <div className="buybox-confianza">

            <div className="buybox-confianza-item">
                <span className="buybox-confianza-icono" aria-hidden="true">🚚</span>
                <span>
                    {envioGratisDesde
                        ? `Envío gratis en compras desde $${Number(envioGratisDesde).toLocaleString("es-AR")}`
                        : "Envío a todo el país"}
                </span>
            </div>

            <div className="buybox-confianza-item">
                <span className="buybox-confianza-icono" aria-hidden="true">↩️</span>
                <Link to="/DevolucionCambio">
                    Cambios y devoluciones
                </Link>
            </div>

            <div className="buybox-confianza-item">
                <span className="buybox-confianza-icono" aria-hidden="true">💳</span>
                <span>Mercado Pago o coordinás por WhatsApp</span>
            </div>

        </div>
    );
};

const BuyBox = ({
    variantes,
    talle,
    setTalle,
    color,
    setColor,
    cantidad,
    setCantidad,
    stock,
    stockError,
    onAdd
}) => {
    const talles = [...new Set(variantes.map(v => v.talla))];
    const colores = [...new Set(
        variantes.filter(v => v.talla === talle).map(v => v.color)
    )];

    const handleCantidadChange = (e) => {
        const valor = +e.target.value;

        if (!stock) {
            setCantidad(valor);
            return;
        }

        if (valor > stock) {
            setCantidad(stock);
            return;
        }

        setCantidad(valor);
    };

    return (
        <div className="buybox">

            <VariantPicker
                talles={talles}
                colores={colores}
                talle={talle}
                color={color}
                setTalle={setTalle}
                setColor={setColor}
            />

            <div className="qty">
                <label>Cantidad</label>
                <input
                    type="number"
                    min={1}
                    max={stock || undefined}
                    value={cantidad}
                    onChange={handleCantidadChange}
                />
            </div>

            {stockError && (
                <span className="qty-error">
                    {stockError}
                </span>
            )}

            <button className="add-btn" onClick={onAdd}>
                Agregar al carrito
            </button>

            <InfoConfianza />

        </div>
    );
};

export default BuyBox;