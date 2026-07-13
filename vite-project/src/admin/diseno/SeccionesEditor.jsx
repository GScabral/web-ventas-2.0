import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import {
    getLayoutHomeBorrador,
    actualizarLayoutHomeBorrador,
    publicarLayoutHome,
} from "../../redux/action";

import TestimoniosEditor from "./TestimoniosEditor";

// Mismas etiquetas que puede tener un producto en "Editar producto" →
// "Mostrar producto en" (ver availableSections en admin/productos/editar.jsx).
// Se reusan acá como opciones de "de dónde saco los productos" para la
// sección "destacados", en vez de inventar un criterio de filtrado nuevo.
const OPCIONES_FUENTE_PRODUCTOS = ["hero", "banner", "destacados", "nuevos", "ofertas"];

const ETIQUETAS_SECCION = {
    banner: { nombre: "Banner promocional", icono: "🖼️" },
    hero: { nombre: "Portada grande (hero)", icono: "🏔️" },
    destacados: { nombre: "Productos destacados", icono: "⭐" },
    categorias: { nombre: "Categorías", icono: "🗂️" },
    catalogo: { nombre: "Catálogo completo", icono: "🛍️" },
    testimonios: { nombre: "Testimonios de clientes", icono: "💬" },
    newsletter: { nombre: "Newsletter", icono: "✉️" },
};

// Con qué contenido arranca cada sección nueva agregada desde "Agregar
// sección". Mismos valores por defecto que seccionesPorDefecto.js en
// el backend, para que una sección recién agregada se vea igual acá
// que si hubiera venido seedeada de fábrica.
const contenidoPorDefecto = (tipo) => {
    switch (tipo) {
        case "hero":
            return { titulo: "", subtitulo: "", imagen: "", textoBoton: "Ver catálogo", linkBoton: "/" };
        case "destacados":
            return { seccionSlug: "destacados", titulo: "Las prendas que marcan tendencia", cantidad: 5 };
        case "categorias":
            return { titulo: "Comprá por categoría" };
        case "testimonios":
            return { titulo: "Lo que dicen nuestros clientes", estilo: "grilla" };
        default:
            return {};
    }
};

// Editor de orden/visibilidad/contenido de las secciones de la Home.
// Trabaja sobre una copia local (secciones) que solo se sincroniza con
// el borrador del servidor la primera vez que llega — así, aplicar una
// plantilla de colores en la otra pestaña (que también refresca el
// borrador) no pisa cambios de orden que el admin todavía no guardó acá.
//
// Permite tener más de una sección del mismo tipo (por ejemplo, dos
// bloques de "destacados" con distinta fuente de productos): el backend
// no lo prohíbe (ver TIPOS_VALIDOS en actualizarLayoutHomeBorrador.js),
// solo valida que cada "tipo" sea uno conocido.
const SeccionesEditor = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const layoutBorrador = useSelector(state => state.layoutHomeBorrador);

    const [secciones, setSecciones] = useState([]);
    const [cargado, setCargado] = useState(false);
    const [tipoAAgregar, setTipoAAgregar] = useState("destacados");

    const [guardando, setGuardando] = useState(false);
    const [publicando, setPublicando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        dispatch(getLayoutHomeBorrador());
    }, [dispatch]);

    useEffect(() => {
        if (!cargado && layoutBorrador?.secciones) {
            setSecciones(
                [...layoutBorrador.secciones].sort((a, b) => a.orden - b.orden)
            );
            setCargado(true);
        }
    }, [layoutBorrador, cargado]);

    const mover = (index, direccion) => {
        const destino = index + direccion;
        if (destino < 0 || destino >= secciones.length) return;

        const copia = [...secciones];
        [copia[index], copia[destino]] = [copia[destino], copia[index]];

        // El orden de guardado siempre es el orden del array, no un
        // número separado que haya que mantener sincronizado a mano.
        setSecciones(copia.map((s, i) => ({ ...s, orden: i })));
    };

    const toggleVisible = (index) => {
        setSecciones(prev =>
            prev.map((s, i) => i === index ? { ...s, visible: !s.visible } : s)
        );
    };

    const actualizarContenido = (index, campo, valor) => {
        setSecciones(prev =>
            prev.map((s, i) =>
                i === index
                    ? { ...s, contenido: { ...s.contenido, [campo]: valor } }
                    : s
            )
        );
    };

    const agregarSeccion = () => {
        setSecciones(prev => ([
            ...prev,
            {
                tipo: tipoAAgregar,
                visible: true,
                orden: prev.length,
                contenido: contenidoPorDefecto(tipoAAgregar),
            },
        ]));
    };

    const eliminarSeccion = (index) => {
        const etiqueta = ETIQUETAS_SECCION[secciones[index].tipo]?.nombre || secciones[index].tipo;
        if (!window.confirm(`¿Sacar "${etiqueta}" de la Home?`)) return;

        setSecciones(prev =>
            prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, orden: i }))
        );
    };

    const guardarBorrador = async () => {
        setGuardando(true);
        setMensaje("");
        setErrorMsg("");

        try {
            await dispatch(actualizarLayoutHomeBorrador(secciones));
            setMensaje(
                "Borrador guardado. Todavía no se ve en la tienda — " +
                "revisalo en Vista previa y publicalo cuando esté listo."
            );
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error ||
                "No pudimos guardar los cambios."
            );
        } finally {
            setGuardando(false);
        }
    };

    const publicar = async () => {
        if (!window.confirm(
            "¿Publicar los cambios? Se van a ver en la tienda para " +
            "cualquier visitante al toque. Asegurate de haber guardado " +
            "el borrador antes."
        )) return;

        setPublicando(true);
        setMensaje("");
        setErrorMsg("");

        try {
            await dispatch(publicarLayoutHome());
            setMensaje("¡Publicado! Los cambios ya se ven en la tienda.");
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error ||
                "No pudimos publicar los cambios."
            );
        } finally {
            setPublicando(false);
        }
    };

    const renderCamposEspecificos = (seccion, index) => {
        switch (seccion.tipo) {

            case "hero":
                return (
                    <>
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={seccion.contenido?.titulo || ""}
                                onChange={(e) => actualizarContenido(index, "titulo", e.target.value)}
                                placeholder="Ej: Nueva colección de invierno"
                            />
                        </div>

                        <div className="form-group">
                            <label>Subtítulo</label>
                            <input
                                type="text"
                                value={seccion.contenido?.subtitulo || ""}
                                onChange={(e) => actualizarContenido(index, "subtitulo", e.target.value)}
                                placeholder="Ej: Prendas abrigadas, hasta 30% off"
                            />
                        </div>

                        <div className="form-group">
                            <label>Imagen de fondo (URL)</label>
                            <input
                                type="text"
                                value={seccion.contenido?.imagen || ""}
                                onChange={(e) => actualizarContenido(index, "imagen", e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Texto del botón</label>
                            <input
                                type="text"
                                value={seccion.contenido?.textoBoton || ""}
                                onChange={(e) => actualizarContenido(index, "textoBoton", e.target.value)}
                                placeholder="Ej: Ver catálogo"
                            />
                        </div>

                        <div className="form-group">
                            <label>Link del botón</label>
                            <input
                                type="text"
                                value={seccion.contenido?.linkBoton || ""}
                                onChange={(e) => actualizarContenido(index, "linkBoton", e.target.value)}
                                placeholder="Ej: /?categoria=Invierno"
                            />
                        </div>

                        <p className="campo-hint">
                            Sin título ni imagen, esta sección no se muestra
                            aunque esté marcada como visible.
                        </p>
                    </>
                );

            case "destacados":
                return (
                    <>
                        <div className="form-group">
                            <label>Fuente de productos</label>
                            <select
                                value={seccion.contenido?.seccionSlug || "destacados"}
                                onChange={(e) => actualizarContenido(index, "seccionSlug", e.target.value)}
                            >
                                {OPCIONES_FUENTE_PRODUCTOS.map(op => (
                                    <option key={op} value={op}>{op}</option>
                                ))}
                            </select>
                            <p className="campo-hint">
                                Muestra los productos que tengan esta etiqueta marcada
                                en "Editar producto" → "Mostrar producto en".
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Texto pequeño (eyebrow)</label>
                            <input
                                type="text"
                                value={seccion.contenido?.eyebrow || ""}
                                onChange={(e) => actualizarContenido(index, "eyebrow", e.target.value)}
                                placeholder="Ej: Destacados"
                            />
                        </div>

                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={seccion.contenido?.titulo || ""}
                                onChange={(e) => actualizarContenido(index, "titulo", e.target.value)}
                                placeholder="Ej: Las prendas que marcan tendencia"
                            />
                        </div>

                        <div className="form-group">
                            <label>Cantidad de productos</label>
                            <input
                                type="number"
                                min="2"
                                max="9"
                                value={seccion.contenido?.cantidad || 5}
                                onChange={(e) => actualizarContenido(index, "cantidad", Number(e.target.value))}
                            />
                            <p className="campo-hint">
                                Uno se muestra grande y el resto en tarjetas chicas al lado.
                            </p>
                        </div>
                    </>
                );

            case "categorias":
                return (
                    <div className="form-group">
                        <label>Título</label>
                        <input
                            type="text"
                            value={seccion.contenido?.titulo || ""}
                            onChange={(e) => actualizarContenido(index, "titulo", e.target.value)}
                            placeholder="Ej: Comprá por categoría"
                        />
                    </div>
                );

            case "testimonios":
                return (
                    <>
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={seccion.contenido?.titulo || ""}
                                onChange={(e) => actualizarContenido(index, "titulo", e.target.value)}
                                placeholder="Ej: Lo que dicen nuestros clientes"
                            />
                        </div>

                        <div className="form-group">
                            <label>Estilo</label>
                            <select
                                value={seccion.contenido?.estilo || "grilla"}
                                onChange={(e) => actualizarContenido(index, "estilo", e.target.value)}
                            >
                                <option value="grilla">Grilla</option>
                                <option value="carrusel">Carrusel (desliza al costado)</option>
                            </select>
                        </div>

                        <TestimoniosEditor />
                    </>
                );

            case "banner":
                return (
                    <p className="campo-hint diseno-seccion-nota">
                        El contenido de esta sección se edita desde{" "}
                        <Link to="/admin/banners">Banners</Link>, en el menú.
                    </p>
                );

            case "catalogo":
                return (
                    <p className="campo-hint diseno-seccion-nota">
                        Muestra el catálogo completo con filtros de categoría y
                        precio. No tiene contenido propio para editar acá.
                    </p>
                );

            case "newsletter":
                return (
                    <p className="campo-hint diseno-seccion-nota">
                        Formulario de suscripción por correo. No tiene contenido
                        propio para editar acá.
                    </p>
                );

            default:
                return null;
        }
    };

    const renderContenido = (seccion, index) => (
        <div className="diseno-seccion-contenido">

            {renderCamposEspecificos(seccion, index)}

            {/* Campo universal: cualquier sección puede tener un color de
                fondo propio, para lograr franjas alternadas (zebra) sin
                tocar CSS. Vacío = sin franja, se ve igual que antes. */}
            <div className="form-group form-group-fondo">
                <label>Color de fondo de esta sección (opcional)</label>
                <div className="color-input-row">
                    <input
                        type="color"
                        value={seccion.contenido?.fondo || "#ffffff"}
                        onChange={(e) => actualizarContenido(index, "fondo", e.target.value)}
                    />
                    <span>{seccion.contenido?.fondo || "Sin color (usa el fondo general)"}</span>
                    {seccion.contenido?.fondo && (
                        <button
                            type="button"
                            className="btn-details"
                            onClick={() => actualizarContenido(index, "fondo", "")}
                        >
                            Quitar
                        </button>
                    )}
                </div>
            </div>

        </div>
    );

    if (!cargado) {
        return <p className="diseno-cargando">Cargando borrador...</p>;
    }

    return (
        <div className="secciones-editor">

            <div className="diseno-toolbar">

                <button
                    type="button"
                    className="btn-guardar-personalizacion"
                    onClick={guardarBorrador}
                    disabled={guardando}
                >
                    {guardando ? "Guardando..." : "Guardar borrador"}
                </button>

                <button
                    type="button"
                    className="btn-details"
                    onClick={() => navigate("/admin/preview-home")}
                >
                    Vista previa
                </button>

                <button
                    type="button"
                    className="btn-ticket"
                    onClick={publicar}
                    disabled={publicando}
                >
                    {publicando ? "Publicando..." : "Publicar cambios"}
                </button>

            </div>

            {errorMsg && <p className="personalizacion-error">{errorMsg}</p>}
            {mensaje && <p className="personalizacion-success">{mensaje}</p>}

            <div className="diseno-secciones-lista">
                {secciones.map((seccion, index) => {
                    const etiqueta = ETIQUETAS_SECCION[seccion.tipo] || {
                        nombre: seccion.tipo,
                        icono: "▫️",
                    };

                    return (
                        <div
                            key={`${seccion.tipo}-${index}`}
                            className={
                                "diseno-seccion-card" +
                                (seccion.visible ? "" : " oculta")
                            }
                        >
                            <div className="diseno-seccion-card-header">

                                <div className="diseno-seccion-orden-botones">
                                    <button
                                        type="button"
                                        onClick={() => mover(index, -1)}
                                        disabled={index === 0}
                                        aria-label="Subir sección"
                                        title="Subir"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => mover(index, 1)}
                                        disabled={index === secciones.length - 1}
                                        aria-label="Bajar sección"
                                        title="Bajar"
                                    >
                                        ▼
                                    </button>
                                </div>

                                <span className="diseno-seccion-icono">{etiqueta.icono}</span>
                                <span className="diseno-seccion-nombre">{etiqueta.nombre}</span>

                                <label className="diseno-seccion-toggle">
                                    <input
                                        type="checkbox"
                                        checked={seccion.visible}
                                        onChange={() => toggleVisible(index)}
                                    />
                                    <span>{seccion.visible ? "Visible" : "Oculta"}</span>
                                </label>

                                <button
                                    type="button"
                                    className="diseno-seccion-eliminar"
                                    onClick={() => eliminarSeccion(index)}
                                    aria-label="Sacar sección"
                                    title="Sacar esta sección"
                                >
                                    🗑
                                </button>

                            </div>

                            {renderContenido(seccion, index)}

                        </div>
                    );
                })}
            </div>

            <div className="diseno-agregar-seccion">
                <select value={tipoAAgregar} onChange={(e) => setTipoAAgregar(e.target.value)}>
                    {Object.entries(ETIQUETAS_SECCION).map(([tipo, { nombre }]) => (
                        <option key={tipo} value={tipo}>{nombre}</option>
                    ))}
                </select>
                <button type="button" className="btn-add-variant" onClick={agregarSeccion}>
                    + Agregar sección
                </button>
            </div>

        </div>
    );
};

export default SeccionesEditor;
