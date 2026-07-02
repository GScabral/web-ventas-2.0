import React from "react";

import ProductBadges from "./ProductBadges";
import ProductActions from "./ProductActions";

import "../styles/ProductCard.css";

const UMBRAL_STOCK_BAJO = 5;

const ProductCard = ({
    producto,
    onEdit,
    onDelete,
    onOferta,
    onDuplicar,
}) => {
    const totalStock =
        producto?.variantes?.reduce(
            (acc, variante) =>
                acc +
                (variante.cantidad_disponible || 0),
            0
        ) || 0;

    const stockBajo = totalStock > 0 && totalStock <= UMBRAL_STOCK_BAJO;
    const sinStock = totalStock === 0;

    return (
        <div className="product-card">

            <div className="product-card-header">

                <div>

                    <span className="product-id">
                        #{producto.id}
                    </span>

                    <h3 className="product-title">
                        {producto.nombre}
                    </h3>

                </div>

                {(stockBajo || sinStock) && (
                    <span className={sinStock ? "stock-badge stock-badge-agotado" : "stock-badge stock-badge-bajo"}>
                        {sinStock ? "Sin stock" : "Últimas unidades"}
                    </span>
                )}

            </div>

            <p className="product-description">

                {producto.descripcion ||
                    "Sin descripción"}

            </p>

            <div className="product-info">

                <div className="info-item">

                    <span className="info-label">
                        Categoría
                    </span>

                    <strong>
                        {producto.categoria.nombre}
                    </strong>

                </div>

                <div className="info-item">

                    <span className="info-label">
                        Precio
                    </span>

                    <strong className="price">

                        ${producto.precio}

                    </strong>

                </div>

                <div className="info-item">

                    <span className="info-label">
                        Stock Total
                    </span>

                    <strong className={sinStock ? "stock-total-agotado" : stockBajo ? "stock-total-bajo" : ""}>

                        {totalStock}

                    </strong>

                </div>

            </div>

            <ProductBadges
                variantes={producto.variantes}
            />

            <ProductActions
                productId={producto.id}
                onEdit={onEdit}
                onDelete={onDelete}
                onOferta={onOferta}
                onDuplicar={onDuplicar}
            />

        </div>
    );
};

export default ProductCard;