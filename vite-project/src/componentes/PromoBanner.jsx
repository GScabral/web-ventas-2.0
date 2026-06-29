import React from "react";
import { Link } from "react-router-dom";
import "./promoBanner.css";

const PromoBanner = ({ productos }) => {

    const producto = productos?.[0];

    return (

        <section className="promo-banner">

            <span className="promo-eyebrow">
                Hecho para durar
            </span>

            <h2>
                Cada pieza pasa por nuestras manos
                antes de llegar a las tuyas
            </h2>

            <div className="promo-actions">

                <Link
                    to="/catalogo"
                    className="promo-btn"
                >
                    Conocé la colección
                </Link>

                {producto && (
                    <Link
                        to={`/detail/${producto.id}`}
                        className="promo-link"
                    >
                        Ver destacado →
                    </Link>
                )}

            </div>

        </section>

    );

};

export default PromoBanner;