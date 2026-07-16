import React, { useEffect, useState } from "react";

import {
    getResenasAdmin,
    toggleResenaAdmin,
    eliminarResenaAdmin,
} from "../../redux/action";

import InfoTooltip from "../components/InfoTooltip";

import "./Resenas.css";

const Estrellas = ({ valor }) => (
    <span className="resena-stars" aria-label={`${valor} de 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={n <= valor ? "on" : ""}>★</span>
        ))}
    </span>
);

const formatearFecha = (fecha) => {
    if (!fecha) return "";
    try {
        return new Date(fecha).toLocaleDateString("es-AR", {
            day: "2-digit", month: "short", year: "numeric",
        });
    } catch {
        return "";
    }
};

// Moderación de reseñas: el admin ve todas (aprobadas y ocultas), puede
// ocultar/mostrar una (sin borrarla) o eliminarla definitivamente.
const Resenas = () => {

    const [resenas, setResenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [accionando, setAccionando] = useState(null);

    const cargar = async () => {
        try {
            const data = await getResenasAdmin();
            setResenas(data);
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error || "No pudimos cargar las reseñas."
            );
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const toggle = async (id) => {
        setAccionando(id);
        try {
            const actualizada = await toggleResenaAdmin(id);
            setResenas((prev) =>
                prev.map((r) => (r.id_resena === id ? { ...r, aprobado: actualizada.aprobado } : r))
            );
        } catch (error) {
            setErrorMsg(error?.response?.data?.error || "No pudimos actualizar la reseña.");
        } finally {
            setAccionando(null);
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Eliminar esta reseña definitivamente?")) return;
        setAccionando(id);
        try {
            await eliminarResenaAdmin(id);
            setResenas((prev) => prev.filter((r) => r.id_resena !== id));
        } catch (error) {
            setErrorMsg(error?.response?.data?.error || "No pudimos eliminar la reseña.");
        } finally {
            setAccionando(null);
        }
    };

    return (
        <div className="resenas-page">
            <div className="resenas-header">
                <h1>
                    Reseñas
                    <InfoTooltip texto="Opiniones que dejan los compradores en cada producto. Se publican al instante; acá podés ocultar una (sin borrarla) o eliminarla si es spam u ofensiva." />
                </h1>
                <p>Moderá las opiniones de tus clientes sobre los productos.</p>
            </div>

            {errorMsg && <p className="personalizacion-error">{errorMsg}</p>}

            {cargando ? (
                <p className="resenas-cargando">Cargando reseñas...</p>
            ) : resenas.length === 0 ? (
                <div className="admin-empty-state">Todavía no hay reseñas.</div>
            ) : (
                <div className="resenas-lista">
                    {resenas.map((r) => (
                        <div
                            key={r.id_resena}
                            className={"resena-card" + (r.aprobado ? "" : " oculta")}
                        >
                            <div className="resena-card-top">
                                <div>
                                    <span className="resena-producto">
                                        {r.Producto?.nombre_producto ||
                                         r.Productos?.nombre_producto ||
                                         `Producto #${r.producto_id}`}
                                    </span>
                                    <Estrellas valor={r.calificacion} />
                                </div>
                                <span className={"resena-estado " + (r.aprobado ? "visible" : "oculto")}>
                                    {r.aprobado ? "Visible" : "Oculta"}
                                </span>
                            </div>

                            <p className="resena-comentario">{r.comentario}</p>

                            <div className="resena-card-foot">
                                <span className="resena-meta">
                                    {r.nombre} · {formatearFecha(r.createdAt)}
                                </span>
                                <div className="resena-acciones">
                                    <button
                                        type="button"
                                        className="btn-details"
                                        onClick={() => toggle(r.id_resena)}
                                        disabled={accionando === r.id_resena}
                                    >
                                        {r.aprobado ? "Ocultar" : "Mostrar"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-delete-size"
                                        onClick={() => eliminar(r.id_resena)}
                                        disabled={accionando === r.id_resena}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Resenas;
