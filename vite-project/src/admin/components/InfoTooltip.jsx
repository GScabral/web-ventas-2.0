import React, { useEffect, useRef, useState } from "react";

// Círculo con "!" que muestra una explicación corta al hacer click —
// no al hover, para que funcione igual en mobile que en desktop (un
// admin en el celular no tiene forma de "pasar el mouse por arriba").
// Se usa junto al <h1>/<h2> de cada pantalla del panel para explicar
// en una frase qué es esa sección y para qué sirve, sin tener que
// abrir un manual aparte. Estilos en admin/adminCommon.css
// (.info-tooltip*), compartidos por todas las pantallas que ya
// importan ese archivo.
const InfoTooltip = ({ texto }) => {

    const [abierto, setAbierto] = useState(false);
    const contenedorRef = useRef(null);

    useEffect(() => {
        if (!abierto) return;

        const cerrarSiEsAfuera = (e) => {
            if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
                setAbierto(false);
            }
        };
        const cerrarConEscape = (e) => {
            if (e.key === "Escape") setAbierto(false);
        };

        document.addEventListener("mousedown", cerrarSiEsAfuera);
        document.addEventListener("keydown", cerrarConEscape);
        return () => {
            document.removeEventListener("mousedown", cerrarSiEsAfuera);
            document.removeEventListener("keydown", cerrarConEscape);
        };
    }, [abierto]);

    return (
        <span className="info-tooltip" ref={contenedorRef}>
            <button
                type="button"
                className="info-tooltip-boton"
                onClick={() => setAbierto(prev => !prev)}
                aria-expanded={abierto}
                aria-label="Más información sobre esta sección"
            >
                !
            </button>

            {abierto && (
                <span className="info-tooltip-globo" role="tooltip">
                    {texto}
                </span>
            )}
        </span>
    );
};

export default InfoTooltip;
