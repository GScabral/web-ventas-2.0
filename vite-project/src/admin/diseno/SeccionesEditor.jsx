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
    destacados: { nombre: "Productos destacados", icono: "⭐" },
    categorias: { nombre: "Categorías", icono: "🗂️" },
    catalogo: { nombre: "Catálogo completo", icono: "🛍️" },
    testimonios: { nombre: "Testimonios de clientes", icono: "💬" },
    newsletter: { nombre: "Newsletter", icono: "✉️" },
};

// Editor de orden/visibilidad/contenido de las secciones de la Home.
// Trabaja sobre una copia local (secciones) que solo se sincroniza con
// el borrador del servidor la primera vez que llega — así, aplicar una
// plantilla de colores en la otra pestaña (que también refresca el
// borrador) no pisa cambios de orden que el admin todavía no guardó acá.
const SeccionesEditor = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const layoutBorrador = useSelector(state => state.layoutHomeBorrador);

    const [secciones, setSecciones] = useState([]);
    const [cargado, setCargado] = useState(false);

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

    const renderContenido = (seccion, index) => {
        switch (seccion.tipo) {

            case "destacados":
                return (
                    <div className="diseno-seccion-contenido">

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

                    </div>
                );

            case "categorias":
                return (
                    <div className="diseno-seccion-contenido">
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={seccion.contenido?.titulo || ""}
                                onChange={(e) => actualizarContenido(index, "titulo", e.target.value)}
                                placeholder="Ej: Comprá por categoría"
                            />
                        </div>
                    </div>
                );

            case "testimonios":
                return (
                    <div className="diseno-seccion-contenido">

                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={seccion.contenido?.titulo || ""}
                                onChange={(e) => actualizarContenido(index, "titulo", e.target.value)}
                                placeholder="Ej: Lo que dicen nuestros clientes"
                            />
                        </div>

                        <TestimoniosEditor />

                    </div>
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

                            </div>

                            {renderContenido(seccion, index)}

                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default SeccionesEditor;
