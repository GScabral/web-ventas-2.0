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

                // Cada componente de sección ya renderiza su propio
                // <section>/wrapper semántico con su propia clase CSS
                // (PromoStrip, CatalogoSection, Newsletter, etc.) — acá
                // no se envuelve de nuevo para no duplicar contenedores.
                return (
                    <Componente
                        key={`${seccion.tipo}-${index}`}
                        contenido={seccion.contenido || {}}
                    />
                );

            })}
        </>
    );
};

export default HomeSectionsRenderer;
