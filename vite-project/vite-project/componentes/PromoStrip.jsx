import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBanners } from "../redux/action";
import "./promoStrip.css";

const PromoStrip = () => {

    const dispatch = useDispatch();

    const banners = useSelector(state => state.banners) || [];

    useEffect(() => {
        dispatch(getBanners());
    }, [dispatch]);

    const bannerMain = banners.find(b => b.tipo === "main");
    const bannersSide = banners.filter(b => b.tipo === "side");

    return (
        <div className="promo-strip">

            <Link
                to={bannerMain?.link || "/catalogo"}
                className="promo-strip-main"
                style={
                    bannerMain?.imagen
                        ? { backgroundImage: `url(${bannerMain.imagen})` }
                        : undefined
                }
            >
                <span className="promo-strip-eyebrow">
                    {bannerMain?.eyebrow || "Nueva colección"}
                </span>

                <h2>
                    {bannerMain?.titulo || "Hasta 30% OFF en productos seleccionados"}
                </h2>

                <span className="promo-strip-cta">
                    {bannerMain?.textoBoton || "Comprar ahora"} →
                </span>
            </Link>

            {bannersSide.length > 0 ? (

                bannersSide.map((banner, index) => (
                    <Link
                        key={banner.id_banner}
                        to={banner.link || "/catalogo"}
                        className="promo-strip-side"
                        style={{
                            background: banner.imagen
                                ? `url(${banner.imagen}) center / cover`
                                : banner.color
                                    ? `linear-gradient(135deg, ${banner.color} 0%, ${banner.color}cc 100%)`
                                    : index % 2 === 0
                                        ? "linear-gradient(135deg, #d6708a 0%, #c2547a 100%)"
                                        : "linear-gradient(135deg, #ff6b35 0%, #e8a33d 100%)"
                        }}
                    >
                        <span>{banner.eyebrow}</span>
                        <strong>{banner.titulo}</strong>
                    </Link>
                ))

            ) : (

                <Link to="/catalogo?orden=recientes" className="promo-strip-side promo-strip-nuevo">
                    <span>Recién llegado</span>
                    <strong>Ver más</strong>
                </Link>

            )}

        </div>
    );
};

export default PromoStrip;
