import React from "react";
import { Link } from "react-router-dom";
import "./heroSection.css";

// Sección "hero" nueva, editable de punta a punta desde el admin
// (título, subtítulo, imagen de fondo, texto y link del botón). Es
// distinta del viejo componentes/hero.jsx (que sigue existiendo pero
// huérfano, sin usarse): ese tenía modal/stats/carrusel de slides con
// contenido bastante hardcodeado, difícil de exponer en un editor
// simple. Esta versión es deliberadamente más chica: solo lo que un
// admin no técnico puede completar con texto y una URL de imagen.
const HeroSection = ({ contenido = {} }) => {

    const {
        titulo = "",
        subtitulo = "",
        imagen = "",
        textoBoton = "Ver catálogo",
        linkBoton = "/",
    } = contenido;

    // Sin título ni imagen no hay mucho que mostrar — mejor no renderizar
    // una franja vacía que un admin todavía no terminó de completar.
    if (!titulo && !imagen) return null;

    return (
        <section
            className="hero-section"
            style={imagen ? { backgroundImage: `url(${imagen})` } : undefined}
        >
            <div className="hero-section-overlay" />

            <div className="hero-section-contenido">
                {titulo && <h1>{titulo}</h1>}
                {subtitulo && <p>{subtitulo}</p>}
                {textoBoton && (
                    <Link to={linkBoton || "/"} className="hero-section-boton">
                        {textoBoton}
                    </Link>
                )}
            </div>
        </section>
    );
};

export default HeroSection;
