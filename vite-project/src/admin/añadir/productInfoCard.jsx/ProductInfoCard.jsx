import React from "react";
import "./ProductInfoCard.css";

const ProductInfoCard = ({
    stepNumber,
    productName,
    setProductName,
    productPrice,
    setProductPrice,
    productDescrip,
    setProductDescrip,
    fieldErrors = {},
    validateField,
}) => {
    return (
        <div className="product-info-card">

            <div className="card-header">
                <h2>
                    {stepNumber && (
                        <span className="step-badge">
                            {stepNumber}
                        </span>
                    )}
                    Información General
                </h2>
                <p>Datos principales del producto</p>
            </div>

            <div className="form-group">
                <label>Nombre del producto</label>

                <input
                    type="text"
                    value={productName}
                    onChange={(e) =>
                        setProductName(e.target.value)
                    }
                    onBlur={(e) =>
                        validateField?.(
                            "productName",
                            e.target.value
                        )
                    }
                    className={
                        fieldErrors.productName
                            ? "input-error"
                            : ""
                    }
                    placeholder="Ej: Camiseta Oversize"
                    required
                />

                {fieldErrors.productName && (
                    <span className="field-error">
                        {fieldErrors.productName}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label>Precio</label>

                <input
                    type="number"
                    min="1"
                    value={productPrice}
                    onChange={(e) =>
                        setProductPrice(e.target.value)
                    }
                    onBlur={(e) =>
                        validateField?.(
                            "productPrice",
                            e.target.value
                        )
                    }
                    className={
                        fieldErrors.productPrice
                            ? "input-error"
                            : ""
                    }
                    placeholder="0"
                    required
                />

                {fieldErrors.productPrice && (
                    <span className="field-error">
                        {fieldErrors.productPrice}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label>Descripción</label>

                <textarea
                    rows="6"
                    value={productDescrip}
                    onChange={(e) =>
                        setProductDescrip(e.target.value)
                    }
                    onBlur={(e) =>
                        validateField?.(
                            "productDescrip",
                            e.target.value
                        )
                    }
                    className={
                        fieldErrors.productDescrip
                            ? "input-error"
                            : ""
                    }
                    placeholder="Describe el producto..."
                    required
                />

                {fieldErrors.productDescrip && (
                    <span className="field-error">
                        {fieldErrors.productDescrip}
                    </span>
                )}
            </div>

        </div>
    );
};

export default ProductInfoCard;