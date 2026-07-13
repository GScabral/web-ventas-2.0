import React, { useState } from "react";
import { Link } from "react-router-dom";

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

            <div className="diseno-flujo">
                <div className="diseno-flujo-paso">
                    <span className="diseno-flujo-numero">1</span>
                    <div>
                        <strong>Editá</strong>
                        <p>Cambiá secciones o aplicá una plantilla. Nada de esto se ve todavía en la tienda.</p>
                    </div>
                </div>
                <span className="diseno-flujo-flecha">→</span>
                <div className="diseno-flujo-paso">
                    <span className="diseno-flujo-numero">2</span>
                    <div>
                        <strong>Revisá en Vista previa</strong>
                        <p>Mirá cómo queda, con el mismo diseño que ve un visitante real.</p>
                    </div>
                </div>
                <span className="diseno-flujo-flecha">→</span>
                <div className="diseno-flujo-paso">
                    <span className="diseno-flujo-numero">3</span>
                    <div>
                        <strong>Publicá</strong>
                        <p>Recién ahí el cambio se ve para cualquiera que entre a la tienda.</p>
                    </div>
                </div>
            </div>

            <p className="diseno-cross-link">
                ¿Buscás cambiar colores sueltos, tipografía, logo o datos de
                contacto? Eso se edita en{" "}
                <Link to="/admin/personalizacion">Personalización</Link>.
                Acá en Diseño se arma el orden y contenido de la portada, y
                se eligen combos de estilo ya armados (plantillas) que
                incluyen esos mismos colores y tipografía.
            </p>

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
