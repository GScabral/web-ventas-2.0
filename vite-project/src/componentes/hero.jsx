import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./hero.css";

const Hero = () => {

    const [showShippingModal, setShowShippingModal] = useState(false);
    const [current, setCurrent] = useState(0);

    const productos = useSelector(
        state => state.allProductos || []
    );

    const heroProductos = productos.filter(producto =>
        producto.sections?.some(
            section => section.section === "hero"
        )
    );

    const images = heroProductos
        .flatMap(producto =>
            producto.variantes?.flatMap(
                variante => variante.imagenes || []
            ) || []
        )
        .slice(0, 5);

    // Imagen de respaldo si todavía no hay productos cargados
    const heroImages = images.length
        ? images
        : ["/img/hero-default.jpg"];

    useEffect(() => {

        if (!heroImages.length) return;

        const interval = setInterval(() => {
            setCurrent(prev =>
                prev === heroImages.length - 1
                    ? 0
                    : prev + 1
            );
        }, 6000);

        return () => clearInterval(interval);

    }, [heroImages.length]);

    return (
        <>
            <section className="hero">

                {/* FONDO */}
                <div className="hero-overlay" />

                {/* TEXTO */}
                <div className="hero-content">

                    <span className="hero-badge">
                        HECHO CON PASIÓN Y DETALLE
                    </span>

                    <h1>
                        Prendas con estilo
                        <br />
                        para tu día a día
                    </h1>

                    <p>
                        Diseños actuales, materiales seleccionados y producción
                        cuidada para ofrecer ropa cómoda, auténtica y duradera.
                    </p>

                    {/* BOTONES */}
                    <div className="hero-buttons">

                        <Link
                            to="/shop"
                            className="hero-btn primary"
                        >
                            Comprar ahora
                        </Link>

                        <Link
                            to="/catalogo"
                            className="hero-btn secondary"
                        >
                            Ver catálogo
                        </Link>

                    </div>

                    {/* BENEFICIOS */}
                    <div className="hero-benefits">

                        <div
                            className="benefit clickable"
                            onClick={() => setShowShippingModal(true)}
                        >
                            🚚 Envíos a todo el país
                        </div>

                        <div className="benefit">
                            🔒 Compra segura
                        </div>

                        <div className="benefit">
                            ⭐ Calidad garantizada
                        </div>

                    </div>

                    {/* STATS */}
                    <div className="hero-stats">

                        <div className="stat-card">
                            <strong>+100</strong>
                            <span>Clientes satisfechos</span>
                        </div>

                        <div className="stat-card">
                            <strong>50+</strong>
                            <span>Modelos disponibles</span>
                        </div>

                        <div className="stat-card">
                            <strong>48h</strong>
                            <span>Preparación de pedidos</span>
                        </div>

                    </div>

                </div>

                {/* IMAGEN */}
                <div className="hero-image">

                    {heroImages.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Producto destacado ${index + 1}`}
                            className={`hero-slide ${index === current ? "active" : ""
                                }`}
                        />
                    ))}

                    <div className="floating-card">
                        ✨ Colección destacada
                    </div>

                </div>

            </section>

            {/* MODAL ENVÍOS */}
            {showShippingModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowShippingModal(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="modal-close"
                            onClick={() => setShowShippingModal(false)}
                        >
                            ✕
                        </button>

                        <h2>Información de envíos</h2>

                        <p>
                            Realizamos envíos a todo el país de forma rápida y segura.
                            Una vez confirmado el pago, comenzamos a preparar tu pedido.
                        </p>

                        <ul>
                            <li>
                                📦 Preparación del pedido en 24 a 48 horas hábiles.
                            </li>

                            <li>
                                🚚 Envíos a todo el país mediante correo y transporte.
                            </li>

                            <li>
                                📍 Recibirás un código de seguimiento cuando el pedido sea despachado.
                            </li>

                            <li>
                                💳 El costo del envío se calcula automáticamente al finalizar la compra.
                            </li>

                            <li>
                                📲 Te mantendremos informado sobre cada actualización del envío.
                            </li>
                        </ul>

                    </div>
                </div>
            )}
        </>
    );
};

export default Hero;