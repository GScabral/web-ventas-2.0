import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getTestimoniosAdmin,
    crearTestimonio,
    actualizarTestimonio,
    eliminarTestimonio,
} from "../../redux/action";

const FORM_VACIO = {
    nombre: "",
    texto: "",
    imagen: "",
    calificacion: 5,
    activo: true,
    orden: 0,
};

// CRUD chico embebido en la sección "testimonios" del editor de Diseño.
// A diferencia de "destacados" (que reusa productos ya cargados) o
// "categorias" (que reusa categorías ya cargadas), los testimonios son
// contenido nuevo que no existe en ningún otro lado del sistema, así
// que necesitan su propia pantalla de alta/edición/borrado.
const TestimoniosEditor = () => {

    const dispatch = useDispatch();

    const testimonios = useSelector(state => state.testimoniosAdmin) || [];

    const [form, setForm] = useState(FORM_VACIO);
    const [editandoId, setEditandoId] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        dispatch(getTestimoniosAdmin());
    }, [dispatch]);

    const handleChange = (campo, valor) => {
        setForm(prev => ({ ...prev, [campo]: valor }));
    };

    const empezarEdicion = (testimonio) => {
        setEditandoId(testimonio.id_testimonio);
        setErrorMsg("");
        setForm({
            nombre: testimonio.nombre || "",
            texto: testimonio.texto || "",
            imagen: testimonio.imagen || "",
            calificacion: testimonio.calificacion ?? 5,
            activo: testimonio.activo ?? true,
            orden: testimonio.orden ?? 0,
        });
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setForm(FORM_VACIO);
        setErrorMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setGuardando(true);
        setErrorMsg("");

        try {
            if (editandoId) {
                await dispatch(actualizarTestimonio(editandoId, form));
            } else {
                await dispatch(crearTestimonio(form));
            }
            cancelarEdicion();
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error ||
                "No pudimos guardar el testimonio."
            );
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async (testimonio) => {
        if (!window.confirm(`¿Borrar el testimonio de "${testimonio.nombre}"?`)) return;

        await dispatch(eliminarTestimonio(testimonio.id_testimonio));

        if (editandoId === testimonio.id_testimonio) cancelarEdicion();
    };

    return (
        <div className="testimonios-editor">

            <span className="testimonios-editor-titulo">Testimonios cargados</span>

            {testimonios.length === 0 && (
                <p className="admin-empty-state">
                    Todavía no cargaste ningún testimonio.
                </p>
            )}

            {testimonios.length > 0 && (
                <ul className="testimonios-editor-lista">
                    {testimonios.map(testimonio => (
                        <li key={testimonio.id_testimonio} className="testimonios-editor-item">

                            <div className="testimonios-editor-item-info">
                                <strong>{testimonio.nombre}</strong>
                                <span className={
                                    "testimonios-editor-estado" +
                                    (testimonio.activo ? "" : " oculto")
                                }>
                                    {testimonio.activo ? "Activo" : "Oculto"}
                                </span>
                                <p>{testimonio.texto}</p>
                            </div>

                            <div className="testimonios-editor-acciones">
                                <button
                                    type="button"
                                    className="btn-details"
                                    onClick={() => empezarEdicion(testimonio)}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    className="btn-delete-size"
                                    onClick={() => handleEliminar(testimonio)}
                                >
                                    Borrar
                                </button>
                            </div>

                        </li>
                    ))}
                </ul>
            )}

            <form className="testimonios-editor-form" onSubmit={handleSubmit}>

                <span className="testimonios-editor-subtitulo">
                    {editandoId ? "Editar testimonio" : "Agregar testimonio"}
                </span>

                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => handleChange("nombre", e.target.value)}
                        placeholder="Ej: María G."
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Texto</label>
                    <textarea
                        value={form.texto}
                        onChange={(e) => handleChange("texto", e.target.value)}
                        placeholder="Lo que dijo la clienta o el cliente"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Imagen (URL, opcional)</label>
                    <input
                        type="text"
                        value={form.imagen}
                        onChange={(e) => handleChange("imagen", e.target.value)}
                        placeholder="https://..."
                    />
                </div>

                <div className="form-group">
                    <label>Calificación (1 a 5)</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={form.calificacion}
                        onChange={(e) => handleChange("calificacion", Number(e.target.value))}
                    />
                </div>

                <div className="form-group form-group-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={form.activo}
                            onChange={(e) => handleChange("activo", e.target.checked)}
                        />
                        Visible en la tienda
                    </label>
                </div>

                {errorMsg && <p className="personalizacion-error">{errorMsg}</p>}

                <div className="testimonios-editor-form-botones">
                    <button
                        type="submit"
                        className="btn-add-variant"
                        disabled={guardando}
                    >
                        {guardando
                            ? "Guardando..."
                            : editandoId ? "Guardar cambios" : "Agregar"}
                    </button>

                    {editandoId && (
                        <button
                            type="button"
                            className="btn-details"
                            onClick={cancelarEdicion}
                        >
                            Cancelar
                        </button>
                    )}
                </div>

            </form>

        </div>
    );
};

export default TestimoniosEditor;
