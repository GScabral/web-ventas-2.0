import React from "react";
import { Link } from "react-router-dom";
import "../styles/recommendations.css";

const RecommendedCarousel = ({ productos }) => {

  if (!productos?.length) return null;

  return (
    <div className="recommended">

      <h2>Recomendados</h2>

      <div className="scroll">

        {productos.map(p => (
          <Link key={p.id} to={`/detail/${p.id}`} className="card">

            <img src={p.variantes?.[0]?.imagenes?.[0]} alt={p.nombre} loading="lazy" />

            <p>{p.nombre}</p>

            <span>${Number(p.precio).toLocaleString("es-AR")}</span>

          </Link>
        ))}

      </div>

    </div>
  );
};

export default RecommendedCarousel;