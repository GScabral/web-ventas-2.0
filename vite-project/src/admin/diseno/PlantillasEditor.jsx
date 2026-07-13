import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    aplicarPlantillaDiseno,
    guardarPlantillaPersonalizada,
    eliminarPlantillaPersonalizada,
} from "../../redux/action";

// Mismos 3 combos definidos en el backend
// (server/src/controllers/layoutHome/aplicarPlantilla.js, PLANTILLAS):
// color + fuente + bordes/densidad/fondos, MÁS una distribución (qué
// secciones van visibles y en qué orden). Se repiten acá solo para
// pintar las tarjetas — quien aplica la plantilla de verdad es el
// backend, esto es puramente visual.
const PLANTILLAS = [
    {
        clave: "minimalista",
        nombre: "Minimalista",
        descripcion: "Blanco y negro, tipografía limpia. Foco total en el producto.",
        color_primario: "#111111",
        color_secundario: "#7a7a7a",
        color_acento: "#4b5563",
        fuente: "Minimal",
        radio_bordes: "cuadrado",
        color_fondo: "#ffffff",
        color_fondo_tarjetas: "#ffffff",
        distribucion: "Banner → Catálogo → Newsletter",
    },
    {
        clave: "urbano",
        nombre: "Urbano / Streetwear",
        descripcion: "Negro con acentos de color fuerte. Para marcas con actitud.",
        color_primario: "#0a0a0a",
        color_secundario: "#eab308",
        color_acento: "#ff3b30",
        fuente: "Moderna",
        radio_bordes: "cuadrado",
        color_fondo: "#f5f5f5",
        color_fondo_tarjetas: "#ffffff",
        distribucion: "Banner → Destacados → Categorías → Catálogo → Newsletter",
    },
    {
        clave: "elegante",
        nombre: "Elegante / Boutique",
        descripcion: "Cálido y prolijo, terracota y mostaza. Recorrido completo con prueba social.",
        color_primario: "#ff6b35",
        color_secundario: "#e8a33d",
        color_acento: "#d6708a",
        fuente: "Elegante",
        radio_bordes: "redondeado",
        color_fondo: "#f5f6f8",
        color_fondo_tarjetas: "#ffffff",
        distribucion: "Banner → Destacados → Categorías → Catálogo → Testimonios → Newsletter",
    },
];

// Mini mockup visual (nav + tarjeta + botón) para dar una idea real de
// cómo se ve cada plantilla, en vez de solo círculos de color.
const MockupPlantilla = ({ plantilla }) => {
    const cuadrado = plantilla.radio_bordes === "cuadrado";

    return (
        <div
            className="plantilla-mockup"
            style={{
                background: plantilla.color_fondo,
                borderRadius: cuadrado ? "4px" : "12px",
            }}
        >
            <div
                className="plantilla-mockup-nav"
                style={{
                    background: plantilla.color_fondo_tarjetas,
                    borderRadius: cuadrado ? "0" : "999px",
                }}
            />
            <div
                className="plantilla-mockup-card"
                style={{
                    background: plantilla.color_fondo_tarjetas,
                    borderRadius: cuadrado ? "2px" : "8px",
                }}
            >
                <div style={{ background: plantilla.color_secundario }} />
            </div>
            <div
                className="plantilla-mockup-btn"
                style={{
                    background: plantilla.color_primario,
                    borderRadius: cuadrado ? "2px" : "999px",
                }}
            />
        </div>
    );
};

// Elegir una plantilla aplica colores + fuente + bordes + densidad +
// fondos (igual que Personalización) Y ADEMÁS reacomoda qué secciones
// de la Home van visibles y en qué orden (ver "distribucion" en cada
// tarjeta). Nunca toca el contenido de cada sección — textos, fuente
// de productos elegida, testimonios cargados — así que es reversible y
// no se pierde nada cargado. Lo que sí se pisa es un reordenamiento
// manual que el admin haya hecho en la pestaña "Secciones" sin pasar
// por una plantilla.
const PlantillasEditor = () => {

    const dispatch = useDispatch();

    const layoutBorrador = useSelector(state => state.layoutHomeBorrador);
    const layoutPublicado = useSelector(state => state.layoutHome);
    const plantillaActiva =
        layoutBorrador?.plantilla_activa || layoutPublicado?.plantilla_activa || "elegante";

    const plantillasPersonalizadas = layoutBorrador?.plantillas_personalizadas || [];

    const [aplicando, setAplicando] = useState(null);
    const [eliminando, setEliminando] = useState(null);
    const [nombreNueva, setNombreNueva] = useState("");
    const [guardandoNueva, setGuardandoNueva] = useState(false);
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

    const guardarActual = async (e) => {
        e.preventDefault();

        setGuardandoNueva(true);
        setMensaje("");
        setErrorMsg("");

        try {
            await dispatch(guardarPlantillaPersonalizada(nombreNueva));
            setMensaje(`Guardaste "${nombreNueva}" como plantilla propia.`);
            setNombreNueva("");
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error ||
                "No pudimos guardar la plantilla."
            );
        } finally {
            setGuardandoNueva(false);
        }
    };

    const eliminar = async (plantilla) => {
        if (!window.confirm(`¿Borrar la plantilla "${plantilla.nombre}"?`)) return;

        setEliminando(plantilla.id);

        try {
            await dispatch(eliminarPlantillaPersonalizada(plantilla.id));
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error ||
                "No pudimos eliminar la plantilla."
            );
        } finally {
            setEliminando(null);
        }
    };

    return (
        <div className="plantillas-editor">

            <p className="campo-hint">
                Elegir una plantilla cambia colores, tipografía, bordes,
                densidad y fondos, y también qué secciones de la Home se ven
                y en qué orden — todo al toque, en toda la tienda. No borra
                productos, imágenes ni textos ya cargados (si una sección
                queda oculta, su contenido sigue guardado por si la volvés a
                activar), pero si habías reordenado secciones a mano en la
                pestaña "Secciones" sin pasar por una plantilla, ese orden
                se reemplaza. Podés cambiar de plantilla las veces que quieras.
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
                        <MockupPlantilla plantilla={plantilla} />

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

            {/* ---- Plantillas propias ---- */}
            <div className="plantillas-personalizadas">

                <h2>Tus plantillas</h2>
                <p className="campo-hint">
                    Guardá la combinación de colores, bordes, densidad, fondos
                    y secciones que armaste (en Personalización y en la
                    pestaña Secciones) como una plantilla propia, para poder
                    volver a ella cuando quieras.
                </p>

                {plantillasPersonalizadas.length > 0 && (
                    <div className="plantillas-grid">
                        {plantillasPersonalizadas.map(plantilla => (
                            <div
                                key={plantilla.id}
                                className={
                                    "plantilla-card" +
                                    (plantillaActiva === plantilla.id ? " activa" : "")
                                }
                            >
                                <MockupPlantilla plantilla={plantilla} />

                                <h3>{plantilla.nombre}</h3>
                                <span className="plantilla-card-fuente">
                                    Guardada el {new Date(plantilla.creado_en).toLocaleDateString("es-AR")}
                                </span>

                                {plantillaActiva === plantilla.id ? (
                                    <span className="plantilla-card-activa-badge">
                                        Plantilla activa
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn-add-variant"
                                        onClick={() => aplicar(plantilla.id)}
                                        disabled={aplicando !== null}
                                    >
                                        {aplicando === plantilla.id ? "Aplicando..." : "Aplicar"}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="btn-delete-size"
                                    onClick={() => eliminar(plantilla)}
                                    disabled={eliminando === plantilla.id}
                                >
                                    {eliminando === plantilla.id ? "Borrando..." : "Borrar"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <form className="plantilla-guardar-form" onSubmit={guardarActual}>
                    <input
                        type="text"
                        value={nombreNueva}
                        onChange={(e) => setNombreNueva(e.target.value)}
                        placeholder="Nombre para la plantilla (ej: Verano 2027)"
                        required
                    />
                    <button type="submit" className="btn-add-variant" disabled={guardandoNueva}>
                        {guardandoNueva ? "Guardando..." : "Guardar combinación actual"}
                    </button>
                </form>

            </div>

        </div>
    );
};

export default PlantillasEditor;
