import React from "react";
import { Link } from "react-router-dom";
import "./editorialGrid.css";

const EditorialGrid = ({ productos }) => {

    return (

        <section className="editorial-section">

            <div className="section-header">

                <span>EDITORIAL</span>

                <h2>
                    Inspira tu próximo look
                </h2>

                <p>
                    Descubre combinaciones, texturas y prendas
                    seleccionadas para crear conjuntos con personalidad.
                </p>

            </div>

            <div className="editorial-grid">

                {productos.slice(0, 6).map((p, index) => (

                    <Link
                        to={`/detail/${p.id}`}
                        key={p.id}
                        className={`editorial-card ${
                            index === 0 || index === 3
                                ? "featured"
                                : ""
                        }`}
                    >

                        <img
                            src={
                                p?.variantes?.[0]
                                    ?.imagenes?.[0]
                            }
                            alt={p.nombre}
                        />

                        <div className="editorial-overlay" />

                        <div className="editorial-info">

                            <div className="editorial-number">
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            <span>
                                {p.categoria}
                            </span>

                            <h3>
                                {p.nombre}
                            </h3>

                            <p className="editorial-link">
                                Ver inspiración →
                            </p>

                        </div>

                    </Link>

                ))}

            </div>

        </section>

    );
};

export default EditorialGrid;