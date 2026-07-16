import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    aplicarPlantillaDiseno,
    guardarPlantillaPersonalizada,
    eliminarPlantillaPersonalizada,
} from "../../redux/action";

// Mismos 6 combos definidos en el backend
// (server/src/controllers/layoutHome/aplicarPlantilla.js, PLANTILLAS):
// color + fuente + bordes/densidad/fondos, MÁS una distribución (qué
// secciones van visibles y en qué orden, acá como array "orden" — el
// mismo array arma tanto el texto "X → Y → Z" como el mockup de abajo,
// para que nunca queden desincronizados entre sí). Se repiten acá solo
// para pintar las tarjetas — quien aplica la plantilla de verdad es el
// backend, esto es puramente visual. Las 6 son a propósito muy
// distintas entre sí en QUÉ secciones muestran y en qué orden, no solo
// en color/tipografía — es lo que hace que cada una se sienta como una
// página distinta, no una recoloreada de la anterior.
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
        orden: ["banner", "catalogo", "newsletter"],
    },
    {
        clave: "urbano",
        nombre: "Urbano / Streetwear",
        descripcion: "Gris cemento con negro y amarillo fuerte. Industrial, con actitud.",
        color_primario: "#111111",
        color_secundario: "#eab308",
        color_acento: "#ff3b30",
        fuente: "Moderna",
        radio_bordes: "cuadrado",
        color_fondo: "#e9e9e6",
        color_fondo_tarjetas: "#ffffff",
        orden: ["banner", "destacados", "categorias", "catalogo", "newsletter"],
    },
    {
        clave: "elegante",
        nombre: "Elegante / Boutique",
        descripcion: "Crema cálido, terracota y mostaza. Recorrido completo con prueba social.",
        color_primario: "#ff6b35",
        color_secundario: "#e8a33d",
        color_acento: "#d6708a",
        fuente: "Elegante",
        radio_bordes: "redondeado",
        color_fondo: "#faf3ee",
        color_fondo_tarjetas: "#ffffff",
        orden: ["banner", "destacados", "categorias", "catalogo", "testimonios", "newsletter"],
    },
    {
        clave: "impacto",
        nombre: "Impacto / Landing",
        descripcion: "Celeste hielo con azul eléctrico y rosa. Hero grande, directo a comprar.",
        color_primario: "#1d4ed8",
        color_secundario: "#0ea5e9",
        color_acento: "#f43f7e",
        fuente: "Moderna",
        radio_bordes: "redondeado",
        color_fondo: "#eaf2fb",
        color_fondo_tarjetas: "#ffffff",
        orden: ["hero", "destacados", "catalogo", "newsletter"],
    },
    {
        clave: "editorial",
        nombre: "Editorial / Curada",
        descripcion: "Beige tipo revista, serif y tonos tierra. Arranca por categorías, sin banner.",
        color_primario: "#7a5b3a",
        color_secundario: "#8a8b5e",
        color_acento: "#c2703d",
        fuente: "Clásica",
        radio_bordes: "redondeado",
        color_fondo: "#efe7d9",
        color_fondo_tarjetas: "#ffffff",
        orden: ["categorias", "destacados", "testimonios", "catalogo", "newsletter"],
    },
    {
        clave: "outlet",
        nombre: "Outlet / Directo",
        descripcion: "Lila enérgico con violeta y rosa fuerte. Banner de oferta y directo al catálogo.",
        color_primario: "#6d28d9",
        color_secundario: "#ec4899",
        color_acento: "#7c3aed",
        fuente: "Minimal",
        radio_bordes: "cuadrado",
        color_fondo: "#f5f0ff",
        color_fondo_tarjetas: "#ffffff",
        orden: ["banner", "catalogo"],
    },
];

// Nombre corto + ícono por tipo de sección, solo para el mockup y el
// texto "X → Y → Z" de cada tarjeta (nada que ver con el editor de
// Secciones, que tiene su propio ETIQUETAS_SECCION más completo).
const INFO_SECCION = {
    banner: { nombre: "Banner", icono: "🖼️" },
    hero: { nombre: "Hero", icono: "🏔️" },
    destacados: { nombre: "Destacados", icono: "⭐" },
    categorias: { nombre: "Categorías", icono: "🗂️" },
    catalogo: { nombre: "Catálogo", icono: "🛍️" },
    testimonios: { nombre: "Testimonios", icono: "💬" },
    newsletter: { nombre: "Newsletter", icono: "✉️" },
};

// Alto relativo de cada bloque en el mockup — así el wireframe también
// comunica que un "hero"/"catálogo" ocupan mucho más lugar real en la
// página que un "banner" o el "newsletter" del final.
const TAMANO_BLOQUE = {
    hero: "grande",
    catalogo: "grande",
    destacados: "mediano",
    testimonios: "mediano",
    categorias: "chico",
    banner: "chico",
    newsletter: "chico",
};

// Una plantilla built-in trae "orden" (array de tipos, ya en el orden
// en que se van a mostrar). Una plantilla personalizada no tiene ese
// array — tiene "secciones" (la foto completa del borrador) — así que
// derivamos el mismo tipo de lista filtrando por visible y ordenando
// por "orden" numérico. El mockup no necesita saber cuál de los dos
// casos es: siempre termina con una lista simple de tipos.
const obtenerOrdenVisible = (plantilla) => {
    if (Array.isArray(plantilla.orden)) return plantilla.orden;

    if (Array.isArray(plantilla.secciones)) {
        return [...plantilla.secciones]
            .filter(seccion => seccion.visible)
            .sort((a, b) => a.orden - b.orden)
            .map(seccion => seccion.tipo);
    }

    return [];
};

// Texto "Banner → Catálogo → Newsletter" derivado del mismo array que
// pinta el mockup, para que la descripción y el dibujo nunca digan
// cosas distintas.
const textoDistribucion = (plantilla) =>
    obtenerOrdenVisible(plantilla)
        .map(tipo => INFO_SECCION[tipo]?.nombre || tipo)
        .join(" → ");

// Mockup visual: una mini "barra de navegación" arriba y, debajo, un
// wireframe apilado con un bloque por cada sección visible, en su
// orden real y con un alto relativo según su tipo. A diferencia de la
// versión anterior (que solo mostraba un color de fondo + una tarjeta
// + un botón, igual en las 3 plantillas), esto deja ver de un vistazo
// que las plantillas no solo cambian de color: arman la portada con
// piezas distintas y en orden distinto.
const MockupPlantilla = ({ plantilla }) => {
    const cuadrado = plantilla.radio_bordes === "cuadrado";
    const ordenVisible = obtenerOrdenVisible(plantilla);

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

            <div className="plantilla-mockup-stack">
                {ordenVisible.map((tipo, i) => {
                    const info = INFO_SECCION[tipo] || { nombre: tipo, icono: "▫️" };
                    const tamano = TAMANO_BLOQUE[tipo] || "chico";

                    return (
                        <div
                            key={`${tipo}-${i}`}
                            className={`plantilla-mockup-bloque tam-${tamano}`}
                            style={{
                                background: plantilla.color_fondo_tarjetas,
                                borderRadius: cuadrado ? "2px" : "6px",
                                borderLeft: `3px solid ${plantilla.color_primario}`,
                            }}
                        >
                            <span className="plantilla-mockup-bloque-icono">{info.icono}</span>
                            <span
                                className="plantilla-mockup-bloque-nombre"
                                style={{ color: plantilla.color_primario }}
                            >
                                {info.nombre}
                            </span>
                        </div>
                    );
                })}
            </div>
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
        if (!window.confirm(
            "Aplicar esta plantilla va a reemplazar los colores, la " +
            "tipografía y el orden de secciones actuales (no borra " +
            "productos, imágenes ni textos ya cargados). Si habías " +
            "personalizado algo a mano en Personalización o reordenado " +
            "secciones sin usar una plantilla, se pierde ese ajuste. " +
            "¿Continuar?"
        )) return;

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
                densidad y fondos, qué secciones de la Home se ven y en qué
                orden, y también <strong>la forma en que se presentan los
                productos</strong> (grilla, tarjetas y proporción de las
                fotos) — todo al toque, en toda la tienda. No borra
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
                            {textoDistribucion(plantilla)}
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
                                <span className="plantilla-card-distribucion">
                                    {textoDistribucion(plantilla)}
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
