import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./promoStrip.css";

// Banner promocional compacto, al estilo de las tiras de banners que
// usan los grandes e-commerce (Shein, etc.) arriba del catálogo: una
// llamada principal a la oferta del momento, sin ocupar toda la pantalla
// como hacía el Hero editorial anterior.
const PromoStrip = () => {

    const ofertas = useSelector(state => state.ofertasActivas) || [];

    const ahora = new Date();

    const hayOfertasActivas = ofertas.some(o => {
        const inicio = new Date(o.inicio);
        const fin = new Date(o.fin);
        return inicio <= ahora && ahora <= fin;
    });

    return (
        <div className="promo-strip">

            <Link to="/catalogo" className="promo-strip-main">
                <span className="promo-strip-eyebrow">Nueva colección</span>
                <h2>Hasta 30% OFF en productos seleccionados</h2>
                <span className="promo-strip-cta">Comprar ahora →</span>
            </Link>

            {hayOfertasActivas && (
                <Link to="/catalogo" className="promo-strip-side promo-strip-ofertas">
                    <span>Ofertas</span>
                    <strong>Ver todas</strong>
                </Link>
            )}

            <Link to="/catalogo" className="promo-strip-side promo-strip-nuevo">
                <span>Recién llegado</span>
                <strong>Ver más</strong>
            </Link>

        </div>
    );
};

export default PromoStrip;
