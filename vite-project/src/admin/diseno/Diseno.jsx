import React, { useState } from "react";

import Personalizacion from "../personalizacion/Personalizacion";
import SeccionesEditor from "./SeccionesEditor";
import PlantillasEditor from "./PlantillasEditor";
import InfoTooltip from "../components/InfoTooltip";

// Reusa las clases genéricas de formulario/mensajes de Personalización
// (.campo-hint, .personalizacion-error/success, .btn-guardar-personalizacion)
// en vez de redefinirlas acá — mismo criterio que CatalogoSection
// importando home.css directamente.
import "../personalizacion/Personalizacion.css";
import "./Diseno.css";

// Pantalla "Diseño" del panel admin: un solo lugar para todo lo visual,
// en 3 pestañas (antes "Personalización" vivía en su propia pantalla
// separada — se unificó acá para no obligar al admin a adivinar en
// cuál de las dos entrar):
// - Identidad y colores: nombre, logo, colores, tipografía, contacto.
//   Se guarda y se ve en el sitio al instante (ver Personalizacion.jsx).
// - Secciones: orden/visibilidad/contenido de la Home, con borrador
//   propio (no se ve en la tienda hasta publicar).
// - Plantillas: 3 combos de color/tipografía/orden predefinidos, que
//   se aplican al instante (reusan Personalización + Secciones por debajo).
const TABS = [
    { clave: "identidad", etiqueta: "Identidad y colores" },
    { clave: "secciones", etiqueta: "Secciones de la portada" },
    { clave: "plantillas", etiqueta: "Plantillas" },
];

const Diseno = () => {

    const [tab, setTab] = useState("identidad");

    return (
        <div className="diseno-page">

            <div className="diseno-header">
                <h1>
                    Diseño
                    <InfoTooltip texto="Identidad y colores se guarda al instante. Secciones tiene un borrador aparte: revisalo en Vista previa antes de publicar. Plantillas aplica un combo completo al instante." />
                </h1>
                <p>
                    Todo lo visual de tu tienda en un solo lugar: nombre, logo
                    y colores; qué secciones tiene la portada y en qué orden;
                    y combos de estilo ya armados — sin tocar código.
                </p>
            </div>

            <div className="diseno-tabs">
                {TABS.map(({ clave, etiqueta }) => (
                    <button
                        key={clave}
                        type="button"
                        className={"diseno-tab" + (tab === clave ? " activa" : "")}
                        onClick={() => setTab(clave)}
                    >
                        {etiqueta}
                    </button>
                ))}
            </div>

            {tab === "secciones" && (
                <div className="diseno-flujo">
                    <div className="diseno-flujo-paso">
                        <span className="diseno-flujo-numero">1</span>
                        <div>
                            <strong>Editá</strong>
                            <p>Reordená, agregá o completá secciones. Nada de esto se ve todavía en la tienda.</p>
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
            )}

            {(tab === "identidad" || tab === "plantillas") && (
                <p className="diseno-nota-instantaneo">
                    {tab === "identidad"
                        ? "Estos cambios se aplican al instante al guardar — no hay borrador ni publicación aparte."
                        : "Aplicar una plantilla cambia colores, tipografía y el orden de secciones al instante en toda la tienda."}
                </p>
            )}

            {tab === "identidad" && <Personalizacion />}
            {tab === "secciones" && <SeccionesEditor />}
            {tab === "plantillas" && <PlantillasEditor />}

        </div>
    );
};

export default Diseno;
