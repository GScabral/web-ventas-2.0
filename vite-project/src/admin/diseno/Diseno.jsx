import React, { useState } from "react";

import SeccionesEditor from "./SeccionesEditor";
import PlantillasEditor from "./PlantillasEditor";

// Reusa las clases genéricas de formulario/mensajes de Personalización
// (.campo-hint, .personalizacion-error/success, .btn-guardar-personalizacion)
// en vez de redefinirlas acá — mismo criterio que CatalogoSection
// importando home.css directamente.
import "../personalizacion/Personalizacion.css";
import "./Diseno.css";

// Pantalla "Diseño" del panel admin: dos pestañas.
// - Secciones: orden/visibilidad/contenido de la Home, con borrador
//   propio (no se ve en la tienda hasta publicar).
// - Plantillas: 3 combos de color/tipografía predefinidos, que se
//   aplican al toque (reusan Personalización por debajo).
const Diseno = () => {

    const [tab, setTab] = useState("secciones");

    return (
        <div className="diseno-page">

            <div className="diseno-header">
                <h1>Diseño</h1>
                <p>
                    Ordená y prendé o apagá las secciones de la portada, editá
                    sus textos, y elegí una plantilla de colores — todo sin
                    tocar código.
                </p>
            </div>

            <div className="diseno-tabs">
                <button
                    type="button"
                    className={"diseno-tab" + (tab === "secciones" ? " activa" : "")}
                    onClick={() => setTab("secciones")}
                >
                    Secciones de la portada
                </button>
                <button
                    type="button"
                    className={"diseno-tab" + (tab === "plantillas" ? " activa" : "")}
                    onClick={() => setTab("plantillas")}
                >
                    Plantillas
                </button>
            </div>

            {tab === "secciones" ? <SeccionesEditor /> : <PlantillasEditor />}

        </div>
    );
};

export default Diseno;
