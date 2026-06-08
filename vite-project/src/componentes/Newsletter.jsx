import React from "react";
import "./newsletter.css";

const Newsletter = () => {

    return (

        <section className="newsletter-section">

            <div className="newsletter-card">

                <span>NEWSLETTER</span>

                <h2>
                    Únete a la comunidad
                </h2>

                <p>
                    Recibe lanzamientos exclusivos,
                    ofertas y novedades.
                </p>

                <div className="newsletter-form">

                    <input
                        type="email"
                        placeholder="Tu email"
                    />

                    <button>
                        Suscribirme
                    </button>

                </div>

            </div>

        </section>

    );
};

export default Newsletter;