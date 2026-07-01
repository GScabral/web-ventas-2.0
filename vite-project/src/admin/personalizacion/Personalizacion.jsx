import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getConfiguracion,
    actualizarConfiguracion,
} from "../../redux/action";

import "./Personalizacion.css";

const Personalizacion = () => {

    const dispatch = useDispatch();

    const configuracion = useSelector(state => state.configuracion);

    const [form, setForm] = useState({
        nombre_tienda: "",
        color_primario: "#ff6b35",
        color_secundario: "#e8a33d",
        color_acento: "#d6708a",
    });

    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        dispatch(getConfiguracion());
    }, [dispatch]);

    // Cuando llega la configuración del servidor, precargamos el form.
    useEffect(() => {
        if (!configuracion) return;

        setForm({
            nombre_tienda: configuracion.nombre_tienda || "",
            color_primario: configuracion.color_primario || "#ff6b35",
            color_secundario: configuracion.color_secundario || "#e8a33d",
            color_acento: configuracion.color_acento || "#d6708a",
        });
    }, [configuracion]);

    // Vista previa en vivo: mientras el admin mueve los selectores de
    // color, pintamos el sitio al toque, antes incluso de guardar. Si
    // cancela sin guardar, ThemeLoader va a repintar con lo guardado
    // real la próxima vez que se recargue la página.
    useEffect(() => {
        const raiz = document.documentElement;
        raiz.style.setProperty("--accent-terracota", form.color_primario);
        raiz.style.setProperty("--accent-mostaza", form.color_secundario);
        raiz.style.setProperty("--accent-rosa", form.color_acento);
    }, [form.color_primario, form.color_secundario, form.color_acento]);

    const handleChange = (campo, valor) => {
        setForm(prev => ({ ...prev, [campo]: valor }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setGuardando(true);
        setMensaje("");
        setErrorMsg("");

        try {
            await dispatch(actualizarConfiguracion(form));
            setMensaje("Cambios guardados. Ya se ven en toda la tienda.");
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error ||
                "No pudimos guardar los cambios."
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="personalizacion-page">

            <div className="personalizacion-header">
                <h1>Personalización</h1>
                <p>
                    Elegí el nombre y los colores de marca de tu tienda.
                    Los cambios se aplican en todo el sitio, incluido este panel.
                </p>
            </div>

            <form className="personalizacion-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Nombre de la tienda</label>
                    <input
                        type="text"
                        value={form.nombre_tienda}
                        onChange={(e) => handleChange("nombre_tienda", e.target.value)}
                        placeholder="Ej: Mi Tienda"
                        required
                    />
                </div>

                <div className="color-grid">

                    <div className="color-field">
                        <label>Color principal</label>
                        <p className="color-hint">Botones, links y detalles destacados</p>
                        <div className="color-input-row">
                            <input
                                type="color"
                                value={form.color_primario}
                                onChange={(e) => handleChange("color_primario", e.target.value)}
                            />
                            <span>{form.color_primario}</span>
                        </div>
                    </div>

                    <div className="color-field">
                        <label>Color secundario</label>
                        <p className="color-hint">Acentos y degradados</p>
                        <div className="color-input-row">
                            <input
                                type="color"
                                value={form.color_secundario}
                                onChange={(e) => handleChange("color_secundario", e.target.value)}
                            />
                            <span>{form.color_secundario}</span>
                        </div>
                    </div>

                    <div className="color-field">
                        <label>Color de acento</label>
                        <p className="color-hint">Detalles puntuales (ofertas, etiquetas)</p>
                        <div className="color-input-row">
                            <input
                                type="color"
                                value={form.color_acento}
                                onChange={(e) => handleChange("color_acento", e.target.value)}
                            />
                            <span>{form.color_acento}</span>
                        </div>
                    </div>

                </div>

                <div className="personalizacion-preview">
                    <span className="preview-label">Vista previa</span>
                    <div className="preview-swatches">
                        <button type="button" className="preview-btn-primary">
                            Botón principal
                        </button>
                        <span className="preview-tag">Etiqueta de oferta</span>
                    </div>
                </div>

                {errorMsg && <p className="personalizacion-error">{errorMsg}</p>}
                {mensaje && <p className="personalizacion-success">{mensaje}</p>}

                <button
                    type="submit"
                    className="btn-guardar-personalizacion"
                    disabled={guardando}
                >
                    {guardando ? "Guardando..." : "Guardar cambios"}
                </button>

            </form>

        </div>
    );
};

export default Personalizacion;
