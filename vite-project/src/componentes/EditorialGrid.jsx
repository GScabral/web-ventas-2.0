import React from "react";
import { Link } from "react-router-dom";
import "./editorialGrid.css";

const ACCENTS = ["accent-rosa", "accent-mostaza", "accent-terracota"];

const EditorialGrid = ({ productos }) => {

    if (!productos?.length) return null;

    return (

        <section className="editorial-section">

            <div className="section-header">

                <span>Editorial</span>

                <h2>
                    Inspira tu próximo look
                </h2>

            </div>

            <div className="editorial-grid">

                {productos.slice(0, 6).map((p, index) => (

                    <Link
                        to={`/detail/${p.id}`}
                        key={p.id}
                        className="editorial-item"
                    >

                        <div className="editorial-image-wrap">

                            <img
                                src={
                                    p?.variantes?.[0]
                                        ?.imagenes?.[0]
                                }
                                alt={p.nombre}
                            />

                        </div>

                        <span
                            className={`editorial-category ${ACCENTS[index % ACCENTS.length]}`}
                        >
                            {p.categoria?.nombre || "Sin categoría"}
                        </span>

                        <h3>
                            {p.nombre}
                        </h3>

                        <p className="editorial-price">
                            ${Number(p.precio).toLocaleString()}
                        </p>

                    </Link>

                ))}

            </div>

        </section>

    );
};

export default EditorialGrid;