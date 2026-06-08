import React from "react";
import { Link } from "react-router-dom";
import "./promoBanner.css";

const PromoBanner = ({ productos }) => {

    const producto = productos?.[0];

    if (!producto) return null;

    return (

        <section className="promo-banner">

            <div className="promo-image">

                <img
                    src={
                        producto?.variantes?.[0]
                            ?.imagenes?.[0]
                    }
                    alt={producto.nombre}
                />

            </div>

            <div className="promo-content">

                <span>
                    NUEVA TEMPORADA
                </span>

                <h2>
                    Streetwear Premium
                </h2>

                <p>
                    Diseños pensados para quienes buscan
                    personalidad, comodidad y estilo en
                    cada detalle.
                </p>

                <div className="promo-actions">

                    <Link
                        to="/catalogo"
                        className="promo-btn primary"
                    >
                        Explorar colección
                    </Link>

                    <Link
                        to={`/detail/${producto.id}`}
                        className="promo-btn secondary"
                    >
                        Ver destacado
                    </Link>

                </div>

            </div>

        </section>

    );

};

export default PromoBanner;