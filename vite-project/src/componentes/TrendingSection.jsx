import React from "react";
import { Link } from "react-router-dom";
import "./trendingSection.css";

const TrendingSection = ({ productos }) => {

    return (

        <section className="trending-section">

            <div className="trending-header">

                <span>DESTACADOS</span>

                <h2>
                    Las prendas que marcan tendencia
                </h2>

                <p>
                    Una selección especial con los productos
                    más elegidos y recomendados de la temporada.
                </p>

            </div>

            <div className="featured-layout">

                {/* Producto principal */}

                {productos[0] && (

                    <Link
                        to={`/detail/${productos[0].id}`}
                        className="featured-main"
                    >

                        <img
                            src={
                                productos[0]?.variantes?.[0]
                                    ?.imagenes?.[0]
                            }
                            alt={productos[0].nombre}
                        />

                        <div className="featured-overlay">

                            <span>⭐ Producto destacado</span>

                            <h3>
                                {productos[0].nombre}
                            </h3>

                            <p>
                                ${Number(
                                    productos[0].precio
                                ).toLocaleString()}
                            </p>

                        </div>

                    </Link>

                )}

                {/* Productos secundarios */}

                <div className="featured-side">

                    {productos.slice(1, 5).map(producto => (

                        <Link
                            key={producto.id}
                            to={`/detail/${producto.id}`}
                            className="side-card"
                        >

                            <img
                                src={
                                    producto?.variantes?.[0]
                                        ?.imagenes?.[0]
                                }
                                alt={producto.nombre}
                            />

                            <div className="side-info">

                                <span>
                                    {producto.categoria}
                                </span>

                                <h4>
                                    {producto.nombre}
                                </h4>

                                <p>
                                    ${Number(
                                        producto.precio
                                    ).toLocaleString()}
                                </p>

                            </div>

                        </Link>

                    ))}

                </div>

            </div>

        </section>

    );
};

export default TrendingSection;
