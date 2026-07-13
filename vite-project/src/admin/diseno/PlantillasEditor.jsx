import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { aplicarPlantillaDiseno } from "../../redux/action";

// Mismos 3 combos definidos en el backend
// (server/src/controllers/layoutHome/aplicarPlantilla.js, PLANTILLAS):
// color + fuente, MÁS una distribución (qué secciones van visibles y
// en qué orden). Se repiten acá solo para pintar las tarjetas — quien
// aplica la plantilla de verdad es el backend, esto es puramente visual.
const PLANTILLAS = [
    {
        clave: "minimalista",
        nombre: "Minimalista",
        descripcion: "Blanco y negro, tipografía limpia. Foco total en el producto.",
        colores: ["#111111", "#7a7a7a", "#4b5563"],
        fuente: "Minimal",
        distribucion: "Banner → Catálogo → Newsletter",
    },
    {
        clave: "urbano",
        nombre: "Urbano / Streetwear",
        descripcion: "Negro con acentos de color fuerte. Para marcas con actitud.",
        colores: ["#0a0a0a", "#eab308", "#ff3b30"],
        fuente: "Moderna",
        distribucion: "Banner → Destacados → Categorías → Catálogo → Newsletter",
    },
    {
        clave: "elegante",
        nombre: "Elegante / Boutique",
        descripcion: "Cálido y prolijo, terracota y mostaza. Recorrido completo con prueba social.",
        colores: ["#ff6b35", "#e8a33d", "#d6708a"],
        fuente: "Elegante",
        distribucion: "Banner → Destacados → Categorías → Catálogo → Testimonios → Newsletter",
    },
];

// Elegir una plantilla aplica colores + fuente (igual que Personalización)
// Y ADEMÁS reacomoda qué secciones de la Home van visibles y en qué
// orden (ver "distribucion" en cada tarjeta). Nunca toca el contenido
// de cada sección — textos, fuente de productos elegida, testimonios
// cargados — así que es reversible y no se pierde nada cargado. Lo que
// sí se pisa es un reordenamiento manual que el admin haya hecho en la
// pestaña "Secciones" sin pasar por una plantilla.
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
                Elegir una plantilla cambia colores, tipografía y también
                qué secciones de la Home se ven y en qué orden — todo al
                toque, en toda la tienda. No borra productos, imágenes ni
                textos ya cargados (si una sección queda oculta, su
                contenido sigue guardado por si la volvés a activar), pero
                si habías reordenado secciones a mano en la pestaña
                "Secciones", ese orden se reemplaza por el de la plantilla.
                Podés cambiar de plantilla las veces que quieras.
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
                        <span className="plantilla-card-distribucion">
                            {plantilla.distribucion}
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
