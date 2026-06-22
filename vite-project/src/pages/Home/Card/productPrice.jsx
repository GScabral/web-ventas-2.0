import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductPrice = ({
    precio,
    productoId
}) => {

    const ofertas = useSelector(
        state => state.ofertasActivas
    );

    const ofertaProducto = ofertas.find(
        oferta =>
            oferta.producto_id === productoId
    );

    const descuento = Number(
        ofertaProducto?.descuento || 0
    );

    const precioFinal = descuento > 0
        ? (precio * (1 - descuento / 100)).toFixed(2)
        : precio;

    return (
        <div className="product-price-container">

            {descuento > 0 ? (
                <>
                    <span className="product-offer">
                        {descuento}% OFF
                    </span>

                    <div className="product-price-row">

                        <span className="old-price">
                            ${precio}
                        </span>

                        <span className="final-price">
                            ${precioFinal}
                        </span>

                    </div>
                </>
            ) : (
                <span className="final-price">
                    ${precio}
                </span>
            )}

        </div>
    );
};

export default ProductPrice;