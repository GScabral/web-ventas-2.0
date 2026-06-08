const ProductActions = ({ onAddCart }) => {

    return (
        <div className="product-actions">

            <button
                className="add-cart-btn"
                onClick={onAddCart}
            >
                Añadir al carrito
            </button>

        </div>
    );
};

export default ProductActions;