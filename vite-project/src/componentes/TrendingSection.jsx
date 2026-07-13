import React from "react";
import { Link } from "react-router-dom";
import "./trendingSection.css";

const TrendingSection = ({
    productos,
    eyebrow = "Destacados",
    titulo = "Las prendas que marcan tendencia",
    // Total de productos a mostrar (1 principal + el resto en la
    // grilla chica). Configurable desde Diseño → Secciones → Destacados.
    cantidad = 5,
}) => {

    if (!productos?.length) return null;

    return (

        <section className="trending-section">

            <div className="trending-header">

                <span>{eyebrow}</span>

                <h2>
                    {titulo}
                </h2>

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
                            loading="lazy"
                        />

                        <div className="featured-overlay">

                            <span>Producto destacado</span>

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

                    {productos.slice(1, Math.max(1, cantidad)).map(producto => (

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
                                loading="lazy"
                            />

                            <div className="side-info">

                                <span>
                                    {producto.categoria?.nombre || ""}
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