import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { aplicarPlantillaDiseno } from "../../redux/action";

// Mismos 3 combos de color + fuente definidos en el backend
// (server/src/controllers/layoutHome/aplicarPlantilla.js, PLANTILLAS).
// Se repiten acá solo para pintar las tarjetas de vista previa — quien
// aplica la plantilla de verdad es el backend, esto es puramente visual.
const PLANTILLAS = [
    {
        clave: "minimalista",
        nombre: "Minimalista",
        descripcion: "Blanco y negro, tipografía limpia. Foco total en el producto.",
        colores: ["#111111", "#7a7a7a", "#4b5563"],
        fuente: "Minimal",
    },
    {
        clave: "urbano",
        nombre: "Urbano / Streetwear",
        descripcion: "Negro con acentos de color fuerte. Para marcas con actitud.",
        colores: ["#0a0a0a", "#eab308", "#ff3b30"],
        fuente: "Moderna",
    },
    {
        clave: "elegante",
        nombre: "Elegante / Boutique",
        descripcion: "Cálido y prolijo, terracota y mostaza. El look actual de la tienda.",
        colores: ["#ff6b35", "#e8a33d", "#d6708a"],
        fuente: "Elegante",
    },
];

// Elegir una plantilla solo toca los mismos campos de color/fuente que
// ya se pueden editar a mano en Personalización — nunca toca el orden
// ni el contenido de las secciones (ver SeccionesEditor.jsx), así que
// es reversible por diseño: volver a una plantilla anterior es solo
// aplicarla de nuevo, sin perder productos, imágenes ni textos.
const PlantillasEditor = () => {

    const dispatch = useDispatch();

    const layoutBorrador = useSelector(state => state.layoutHomeBorrador);
    const layoutPublicado = useSelector(state => state.layoutHome);
    const plantillaActiva =
        layoutBorrador?.plantilla_activa || layoutPublicado?.plantilla_activa || "elegante";

    const [aplicando, setAplicando] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const aplicar = async (clave) => {
        setAplicando(clave);
        setMensaje("");
        setErrorMsg("");

        try {
            await dispatch(aplicarPlantillaDiseno(clave));
            setMensaje("Plantilla aplicada. Ya se ve en toda la tienda.");
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error ||
                "No pudimos aplicar la plantilla."
            );
        } finally {
            setAplicando(null);
        }
    };

    return (
        <div className="plantillas-editor">

            <p className="campo-hint">
                Elegir una plantilla cambia colores y tipografía en toda la
                tienda al toque. No toca el orden ni el contenido de las
                secciones de la Home, ni borra productos, imágenes o textos
                ya cargados — podés cambiar de plantilla las veces que quieras.
            </p>

            {mensaje && <p className="personalizacion-success">{mensaje}</p>}
            {errorMsg && <p className="personalizacion-error">{errorMsg}</p>}

            <div className="plantillas-grid">
                {PLANTILLAS.map(plantilla => (
                    <div
                        key={plantilla.clave}
                        className={
                            "plantilla-card" +
                            (plantillaActiva === plantilla.clave ? " activa" : "")
                        }
                    >
                        <div className="plantilla-card-swatches">
                            {plantilla.colores.map((color, i) => (
                                <span key={i} style={{ background: color }} />
                            ))}
                        </div>

                        <h3>{plantilla.nombre}</h3>
                        <p>{plantilla.descripcion}</p>
                        <span className="plantilla-card-fuente">
                            Fuente: {plantilla.fuente}
                        </span>

                        {plantillaActiva === plantilla.clave ? (
                            <span className="plantilla-card-activa-badge">
                                Plantilla activa
                            </span>
                        ) : (
                            <button
                                type="button"
                                className="btn-add-variant"
                                onClick={() => aplicar(plantilla.clave)}
                                disabled={aplicando !== null}
                            >
                                {aplicando === plantilla.clave ? "Aplicando..." : "Aplicar"}
                            </button>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default PlantillasEditor;
