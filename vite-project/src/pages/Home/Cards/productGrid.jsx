import ProductCard from "../Card/Card";

import "./productGrid.css";

const ProductGrid = ({ productos }) => {

  if (!productos?.length) {
    return (
      <div className="empty-products">
        No hay productos
      </div>
    );
  }

  return (

    <div className="products-grid">

      {productos.map((product) => (

        <ProductCard
          key={product.id}
          product={product}
        />

      ))}

    </div>
  );
};

export default ProductGrid;