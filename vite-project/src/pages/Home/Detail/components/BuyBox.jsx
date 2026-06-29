import React from "react";
import VariantPicker from "./VariantSelector";
import "../styles/buybox.css";

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
                    max={stock}
                    value={cantidad}
                    onChange={(e) => setCantidad(+e.target.value)}
                    className={stockError ? "qty-input-error" : ""}
                />

                {stockError && (
                    <span className="qty-error">
                        {stockError}
                    </span>
                )}
            </div>

            <button className="add-btn" onClick={onAdd}>
                Agregar al carrito
            </button>

        </div>
    );
};

export default BuyBox;