import React from "react";
import "./ProductInfoCard.css";

const ProductInfoCard = ({
    productName,
    setProductName,
    productPrice,
    setProductPrice,
    productDescrip,
    setProductDescrip,
}) => {
    return (
        <div className="product-info-card">

            <div className="card-header">
                <h2>Información General</h2>
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
                    placeholder="Ej: Camiseta Oversize"
                    required
                />
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
                    placeholder="0"
                    required
                />
            </div>

            <div className="form-group">
                <label>Descripción</label>

                <textarea
                    rows="6"
                    value={productDescrip}
                    onChange={(e) =>
                        setProductDescrip(e.target.value)
                    }
                    placeholder="Describe el producto..."
                    required
                />
            </div>

        </div>
    );
};

export default ProductInfoCard;