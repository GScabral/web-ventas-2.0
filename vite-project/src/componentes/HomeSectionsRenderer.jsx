import React from "react";
import sectionRegistry from "./sectionRegistry";

// Recorre la lista de secciones (ordenada, con visibilidad y contenido
// ya resueltos) y renderiza cada una a través del registro. Cualquier
// tipo de sección que no esté en el registro (por ejemplo, quedó algo
// viejo guardado de una versión anterior) se ignora en vez de romper
// toda la página.
const HomeSectionsRenderer = ({ secciones = [] }) => {

    const seccionesOrdenadas = [...secciones]
        .filter(s => s.visible)
        .sort((a, b) => a.orden - b.orden);

    return (
        <>
            {seccionesOrdenadas.map((seccion, index) => {

                const Componente = sectionRegistry[seccion.tipo];

                if (!Componente) return null;

                const elemento = (
                    <Componente
                        key={seccion.contenido?.fondo ? undefined : `${seccion.tipo}-${index}`}
                        contenido={seccion.contenido || {}}
                    />
                );

                // "fondo" es un campo universal (no específico de ningún
                // tipo de sección): si el admin le puso un color desde el
                // editor, se envuelve en una franja de ese color. Sin
                // "fondo", no se agrega ningún wrapper — cada componente
                // de sección ya renderiza su propio <section> semántico
                // (PromoStrip, CatalogoSection, Newsletter, etc.) y no
                // hace falta duplicar contenedores.
                if (seccion.contenido?.fondo) {
                    return (
                        <div
                            key={`${seccion.tipo}-${index}`}
                            className="home-seccion-fondo"
                            style={{ background: seccion.contenido.fondo }}
                        >
                            {elemento}
                        </div>
                    );
                }

                return elemento;

            })}
        </>
    );
};

export default HomeSectionsRenderer;
