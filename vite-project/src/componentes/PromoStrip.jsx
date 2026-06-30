import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBanners } from "../redux/action";
import "./promoStrip.css";

// Banner promocional compacto, al estilo de las tiras de banners que
// usan los grandes e-commerce (Shein, etc.) arriba del catálogo: una
// llamada principal a la oferta del momento, sin ocupar toda la pantalla
// como hacía el Hero editorial anterior.
//
// Ahora lee los banners cargados desde el admin (state.banners, traídos
// de /banner/activos). Si todavía no hay banners cargados, se muestra
// un contenido por defecto para que la home no quede vacía.
const PromoStrip = () => {

    const dispatch = useDispatch();

    const banners = useSelector(state => state.banners) || [];
    const ofertas = useSelector(state => state.ofertasActivas) || [];

    useEffect(() => {
        dispatch(getBanners());
    }, [dispatch]);

    const ahora = new Date();

    const hayOfertasActivas = ofertas.some(o => {
        const inicio = new Date(o.inicio);
        const fin = new Date(o.fin);
        return inicio <= ahora && ahora <= fin;
    });

    // Separamos por tipo: "main" es el banner grande de la izquierda,
    // "side" son los chicos de la derecha. Tomamos como mucho 1 main
    // y 2 side, respetando el orden que viene del backend.
    const bannerMain = banners.find(b => b.tipo === "main");
    const bannersSide = banners.filter(b => b.tipo === "side").slice(0, 2);

    // Estilo dinámico: si el banner tiene imagen la usamos de fondo,
    // si no, usamos el color elegido en el admin como fondo sólido.
    const estiloBanner = (banner) => {
        if (!banner) return {};
        if (banner.imagen) {
            return {
                backgroundImage: `url(${banner.imagen})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            };
        }
        if (banner.color) {
            return { background: banner.color };
        }
        return {};
    };

    return (
        <div className="promo-strip">

            {bannerMain ? (
                <Link
                    to={bannerMain.link || "/catalogo"}
                    className="promo-strip-main"
                    style={estiloBanner(bannerMain)}
                >
                    {bannerMain.eyebrow && (
                        <span className="promo-strip-eyebrow">{bannerMain.eyebrow}</span>
                    )}
                    <h2>{bannerMain.titulo}</h2>
                    <span className="promo-strip-cta">
                        {bannerMain.textoBoton || "Ver más"} →
                    </span>
                </Link>
            ) : (
                <Link to="/catalogo" className="promo-strip-main">
                    <span className="promo-strip-eyebrow">Nueva colección</span>
                    <h2>Hasta 30% OFF en productos seleccionados</h2>
                    <span className="promo-strip-cta">Comprar ahora →</span>
                </Link>
            )}

            {bannersSide.length > 0 ? (
                bannersSide.map(banner => (
                    <Link
                        key={banner.id_banner}
                        to={banner.link || "/catalogo"}
                        className="promo-strip-side"
                        style={estiloBanner(banner)}
                    >
                        {banner.eyebrow && <span>{banner.eyebrow}</span>}
                        <strong>{banner.titulo}</strong>
                    </Link>
                ))
            ) : (
                <>
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
                </>
            )}

        </div>
    );
};

export default PromoStrip;