import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../Card/Card";
import "./catalogo.css";

const Catalogo = () => {

    const productos = useSelector(
        state => state.allProductos
    );

    const destacado = productos?.[0];

    return (
        <div className="catalogo">

            {/* HERO */}

            <section className="lookbook-hero">

                <div className="lookbook-overlay">

                    <span>
                        NUEVA TEMPORADA
                    </span>

                    <h1>
                        STREETWEAR
                        <br />
                        PREMIUM
                    </h1>

                    <p>
                        Diseñado para quienes entienden
                        que el estilo no se sigue,
                        se crea.
                    </p>

                    <a
                        href="#coleccion"
                        className="hero-btn"
                    >
                        Ver colección
                    </a>

                </div>

            </section>

            {/* DESTACADO */}

            {destacado && (

                <section className="featured-product">

                    <div className="featured-image">

                        <img
                            src={
                                destacado.variantes?.[0]
                                    ?.imagenes?.[0]
                            }
                            alt={destacado.nombre}
                        />

                    </div>

                    <div className="featured-content">

                        <span>
                            PRODUCTO DESTACADO
                        </span>

                        <h2>
                            {destacado.nombre}
                        </h2>

                        <p>
                            {destacado.descripcion}
                        </p>

                        <h3>
                            ${destacado.precio}
                        </h3>

                    </div>

                </section>

            )}

            {/* FRASE */}

            <section className="editorial-quote">

                <h2>
                    "La ropa no define quién eres.
                    Tu actitud sí."
                </h2>

            </section>

            {/* PRODUCTOS */}

            <section
                id="coleccion"
                className="products-section"
            >

                <div className="section-header">

                    <span>
                        COLECCIÓN COMPLETA
                    </span>

                    <h2>
                        Nuevos Ingresos
                    </h2>

                </div>

                <div className="products-grid">

                    {productos.map(producto => (

                        <ProductCard
                            key={producto.id}
                            product={producto}
                        />

                    ))}

                </div>

            </section>

        </div>
    );
};

export default Catalogo;