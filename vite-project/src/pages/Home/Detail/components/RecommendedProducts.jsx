import React from "react";
import { Link } from "react-router-dom";
import "../styles/recommendations.css";

const RecommendedCarousel = ({ productos }) => {
  return (
    <div className="recommended">

      <h2>Recomendados</h2>

      <div className="scroll">

        {productos.map(p => (
          <Link key={p.id} to={`/detail/${p.id}`} className="card">

            <img src={p.variantes?.[0]?.imagenes?.[0]} />

            <p>{p.nombre}</p>

            <span>${p.precio}</span>

          </Link>
        ))}

      </div>

    </div>
  );
};

export default RecommendedCarousel;