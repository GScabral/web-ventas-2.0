const ProductPrice = ({ precio, oferta }) => {

    const precioFinal = oferta
        ? (precio * (1 - oferta / 100)).toFixed(2)
        : precio;

    return (
        <div className="product-price-container">

            {oferta ? (
                <>
                    <span className="product-offer">
                        {oferta}% OFF
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