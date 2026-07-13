import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTestimonios } from "../../redux/action";
import "./testimoniosSection.css";

const TestimoniosSection = ({ contenido = {} }) => {

    const dispatch = useDispatch();

    const testimonios = useSelector(state => state.testimonios) || [];

    useEffect(() => {
        dispatch(getTestimonios());
    }, [dispatch]);

    if (!testimonios.length) return null;

    const titulo = contenido.titulo || "Lo que dicen nuestros clientes";
    // "grilla" (por defecto) o "carrusel" — carrusel es CSS puro (scroll
    // horizontal con snap), sin sumar ninguna librería nueva.
    const esCarrusel = contenido.estilo === "carrusel";

    return (
        <section className="testimonios-section">

            <h2 className="testimonios-section-titulo">{titulo}</h2>

            <div className={
                "testimonios-section-grid" + (esCarrusel ? " carrusel" : "")
            }>

                {testimonios.map(testimonio => (
                    <div key={testimonio.id_testimonio} className="testimonio-card">

                        {testimonio.imagen && (
                            <img
                                src={testimonio.imagen}
                                alt={testimonio.nombre}
                                className="testimonio-card-imagen"
                            />
                        )}

                        <div className="testimonio-card-estrellas">
                            {"★".repeat(Math.max(0, Math.min(5, testimonio.calificacion || 5)))}
                        </div>

                        <p className="testimonio-card-texto">
                            "{testimonio.texto}"
                        </p>

                        <strong className="testimonio-card-nombre">
                            {testimonio.nombre}
                        </strong>

                    </div>
                ))}

            </div>

        </section>
    );
};

export default TestimoniosSection;
