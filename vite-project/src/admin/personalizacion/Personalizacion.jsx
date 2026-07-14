import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getConfiguracion,
    actualizarConfiguracion,
} from "../../redux/action";

import { FUENTES } from "../../config/fuentes";

import "./Personalizacion.css";

const FORM_VACIO = {
    nombre_tienda: "",
    tagline: "",
    logo_url: "",
    color_primario: "#ff6b35",
    color_secundario: "#e8a33d",
    color_acento: "#d6708a",
    fuente: "clasica",
    radio_bordes: "redondeado",
    densidad: "amplia",
    color_fondo: "#f5f6f8",
    color_fondo_tarjetas: "#ffffff",
    whatsapp: "",
    instagram: "",
    facebook: "",
    direccion: "",
    maps_url: "",
    email_notificaciones: "",
    envio_gratis_desde: "",
};

const Personalizacion = () => {

    const dispatch = useDispatch();

    const configuracion = useSelector(state => state.configuracion);

    const [form, setForm] = useState(FORM_VACIO);
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
            tagline: configuracion.tagline || "",
            logo_url: configuracion.logo_url || "",
            color_primario: configuracion.color_primario || "#ff6b35",
            color_secundario: configuracion.color_secundario || "#e8a33d",
            color_acento: configuracion.color_acento || "#d6708a",
            fuente: configuracion.fuente || "clasica",
            radio_bordes: configuracion.radio_bordes || "redondeado",
            densidad: configuracion.densidad || "amplia",
            color_fondo: configuracion.color_fondo || "#f5f6f8",
            color_fondo_tarjetas: configuracion.color_fondo_tarjetas || "#ffffff",
            whatsapp: configuracion.whatsapp || "",
            instagram: configuracion.instagram || "",
            facebook: configuracion.facebook || "",
            direccion: configuracion.direccion || "",
            maps_url: configuracion.maps_url || "",
            email_notificaciones: configuracion.email_notificaciones || "",
            envio_gratis_desde: configuracion.envio_gratis_desde ?? "",
        });
    }, [configuracion]);

    // Vista previa en vivo: mientras el admin toca colores o
    // tipografía, los pintamos al toque sobre <html> (antes incluso
    // de guardar), así el resto del panel y el mockup de acá abajo ya
    // se ven con el cambio. Si cancela sin guardar, ThemeLoader va a
    // repintar con lo guardado real la próxima vez que se recargue.
    useEffect(() => {
        const raiz = document.documentElement;
        raiz.style.setProperty("--accent-terracota", form.color_primario);
        raiz.style.setProperty("--accent-mostaza", form.color_secundario);
        raiz.style.setProperty("--accent-rosa", form.color_acento);

        const fuenteElegida = FUENTES[form.fuente] || FUENTES.clasica;
        raiz.style.setProperty("--font-display", fuenteElegida.display);
        raiz.style.setProperty("--font-body", fuenteElegida.body);

        if (form.radio_bordes === "cuadrado") {
            raiz.style.setProperty("--radius-sm", "2px");
            raiz.style.setProperty("--radius-md", "4px");
            raiz.style.setProperty("--radius-lg", "6px");
        } else {
            raiz.style.setProperty("--radius-sm", "8px");
            raiz.style.setProperty("--radius-md", "12px");
            raiz.style.setProperty("--radius-lg", "16px");
        }

        if (form.densidad === "compacta") {
            raiz.style.setProperty("--sp-4", "12px");
            raiz.style.setProperty("--sp-5", "16px");
            raiz.style.setProperty("--sp-6", "20px");
            raiz.style.setProperty("--sp-7", "28px");
        } else {
            raiz.style.setProperty("--sp-4", "16px");
            raiz.style.setProperty("--sp-5", "24px");
            raiz.style.setProperty("--sp-6", "32px");
            raiz.style.setProperty("--sp-7", "48px");
        }

        raiz.style.setProperty("--bg-base", form.color_fondo);
        raiz.style.setProperty("--bg-elevated", form.color_fondo_tarjetas);
    }, [
        form.color_primario, form.color_secundario, form.color_acento, form.fuente,
        form.radio_bordes, form.densidad, form.color_fondo, form.color_fondo_tarjetas,
    ]);

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

            <p className="campo-hint personalizacion-intro">
                Nombre, logo, colores, tipografía y datos de contacto. Los
                cambios se guardan y se ven en toda la tienda apenas tocás
                "Guardar cambios" — no hace falta publicar por separado.
            </p>

            <div className="personalizacion-layout">

                <form className="personalizacion-form" onSubmit={handleSubmit}>

                    {/* ---- Identidad ---- */}
                    <section className="personalizacion-section">
                        <h2>Identidad</h2>

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

                        <div className="form-group">
                            <label>Frase corta (tagline)</label>
                            <input
                                type="text"
                                value={form.tagline}
                                onChange={(e) => handleChange("tagline", e.target.value)}
                                placeholder="Ej: Moda accesible para todos los días"
                            />
                        </div>

                        <div className="form-group">
                            <label>Logo (URL de imagen)</label>
                            <input
                                type="text"
                                value={form.logo_url}
                                onChange={(e) => handleChange("logo_url", e.target.value)}
                                placeholder="https://..."
                            />
                            <p className="campo-hint">
                                Pegá el link de una imagen ya subida (igual que en Banners).
                                Dejalo vacío para mostrar solo el nombre.
                            </p>
                        </div>
                    </section>

                    {/* ---- Colores ---- */}
                    <section className="personalizacion-section">
                        <h2>Colores</h2>

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
                    </section>

                    {/* ---- Tipografía ---- */}
                    <section className="personalizacion-section">
                        <h2>Tipografía</h2>
                        <p className="campo-hint">
                            Elegí el par de fuentes (títulos + texto) de todo el sitio.
                        </p>

                        <div className="fuentes-grid">
                            {Object.entries(FUENTES).map(([clave, opcion]) => (
                                <button
                                    type="button"
                                    key={clave}
                                    className={
                                        "fuente-card" +
                                        (form.fuente === clave ? " activa" : "")
                                    }
                                    onClick={() => handleChange("fuente", clave)}
                                >
                                    <span
                                        className="fuente-preview-titulo"
                                        style={{ fontFamily: opcion.display }}
                                    >
                                        Aa
                                    </span>
                                    <span className="fuente-nombre">{opcion.label}</span>
                                    <span className="fuente-descripcion">{opcion.descripcion}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* ---- Bordes y densidad ---- */}
                    <section className="personalizacion-section">
                        <h2>Bordes y densidad</h2>
                        <p className="campo-hint">
                            Controlan la sensación general del sitio: más
                            filoso y compacto, o más suave y espacioso.
                        </p>

                        <div className="toggle-grid">
                            <div className="toggle-field">
                                <label>Bordes</label>
                                <div className="toggle-buttons">
                                    <button
                                        type="button"
                                        className={form.radio_bordes === "redondeado" ? "activo" : ""}
                                        onClick={() => handleChange("radio_bordes", "redondeado")}
                                    >
                                        Redondeado
                                    </button>
                                    <button
                                        type="button"
                                        className={form.radio_bordes === "cuadrado" ? "activo" : ""}
                                        onClick={() => handleChange("radio_bordes", "cuadrado")}
                                    >
                                        Cuadrado
                                    </button>
                                </div>
                            </div>

                            <div className="toggle-field">
                                <label>Densidad</label>
                                <div className="toggle-buttons">
                                    <button
                                        type="button"
                                        className={form.densidad === "amplia" ? "activo" : ""}
                                        onClick={() => handleChange("densidad", "amplia")}
                                    >
                                        Amplia
                                    </button>
                                    <button
                                        type="button"
                                        className={form.densidad === "compacta" ? "activo" : ""}
                                        onClick={() => handleChange("densidad", "compacta")}
                                    >
                                        Compacta
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ---- Fondos ---- */}
                    <section className="personalizacion-section">
                        <h2>Fondos</h2>
                        <p className="campo-hint">
                            Se mantienen claros a propósito: los colores de
                            texto todavía no se adaptan a fondos oscuros.
                        </p>

                        <div className="color-grid">

                            <div className="color-field">
                                <label>Fondo de página</label>
                                <p className="color-hint">Detrás de todo el contenido</p>
                                <div className="color-input-row">
                                    <input
                                        type="color"
                                        value={form.color_fondo}
                                        onChange={(e) => handleChange("color_fondo", e.target.value)}
                                    />
                                    <span>{form.color_fondo}</span>
                                </div>
                            </div>

                            <div className="color-field">
                                <label>Fondo de tarjetas</label>
                                <p className="color-hint">Productos, secciones, paneles</p>
                                <div className="color-input-row">
                                    <input
                                        type="color"
                                        value={form.color_fondo_tarjetas}
                                        onChange={(e) => handleChange("color_fondo_tarjetas", e.target.value)}
                                    />
                                    <span>{form.color_fondo_tarjetas}</span>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* ---- Contacto y redes ---- */}
                    <section className="personalizacion-section">
                        <h2>Contacto y redes</h2>

                        <div className="form-group">
                            <label>WhatsApp</label>
                            <input
                                type="text"
                                value={form.whatsapp}
                                onChange={(e) => handleChange("whatsapp", e.target.value)}
                                placeholder="Ej: 5493794562823 (con código de país, sin +)"
                            />
                        </div>

                        <div className="form-group">
                            <label>Instagram</label>
                            <input
                                type="text"
                                value={form.instagram}
                                onChange={(e) => handleChange("instagram", e.target.value)}
                                placeholder="https://instagram.com/tu_tienda"
                            />
                        </div>

                        <div className="form-group">
                            <label>Facebook</label>
                            <input
                                type="text"
                                value={form.facebook}
                                onChange={(e) => handleChange("facebook", e.target.value)}
                                placeholder="https://facebook.com/tu_tienda"
                            />
                        </div>

                        <div className="form-group">
                            <label>Dirección</label>
                            <input
                                type="text"
                                value={form.direccion}
                                onChange={(e) => handleChange("direccion", e.target.value)}
                                placeholder="Ej: Catamarca 1330, Corrientes Capital"
                            />
                        </div>

                        <div className="form-group">
                            <label>Link de Google Maps</label>
                            <input
                                type="text"
                                value={form.maps_url}
                                onChange={(e) => handleChange("maps_url", e.target.value)}
                                placeholder="https://maps.app.goo.gl/..."
                            />
                        </div>
                    </section>

                    {/* ---- Notificaciones ---- */}
                    <section className="personalizacion-section">
                        <h2>Notificaciones</h2>

                        <div className="form-group">
                            <label>Avisarme por correo cuando entra un pedido</label>
                            <input
                                type="email"
                                value={form.email_notificaciones}
                                onChange={(e) => handleChange("email_notificaciones", e.target.value)}
                                placeholder="tu-email@ejemplo.com"
                            />
                            <p className="campo-hint">
                                Dejalo vacío si no querés recibir avisos por correo.
                            </p>
                        </div>
                    </section>

                    {/* ---- Envíos ---- */}
                    <section className="personalizacion-section">
                        <h2>Envíos</h2>

                        <div className="form-group">
                            <label>Envío gratis a partir de</label>
                            <input
                                type="number"
                                min="0"
                                value={form.envio_gratis_desde}
                                onChange={(e) => handleChange("envio_gratis_desde", e.target.value)}
                                placeholder="Ej: 50000"
                            />
                            <p className="campo-hint">
                                Si el subtotal del carrito llega a este monto, el envío
                                (por correo o por moto) sale gratis. Dejalo vacío para
                                no ofrecer envío gratis.
                            </p>
                        </div>

                        <p className="campo-hint">
                            Las ciudades con envío por moto y las provincias con costo
                            de envío por correo se configuran en la sección "Envíos"
                            del panel, no acá.
                        </p>
                    </section>

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

                {/* ---- Vista previa en vivo ---- */}
                <aside className="preview-panel">

                    <span className="preview-panel-label">Vista previa</span>

                    <div
                        className="preview-mockup"
                        style={{
                            background: form.color_fondo,
                            borderRadius: form.radio_bordes === "cuadrado" ? "4px" : "16px",
                        }}
                    >

                        <div className="preview-mockup-nav">
                            {form.logo_url && (
                                <img
                                    src={form.logo_url}
                                    alt=""
                                    className="preview-mockup-logo"
                                />
                            )}
                            <span className="preview-mockup-brand">
                                {form.nombre_tienda || "Mi Tienda"}
                            </span>
                        </div>

                        <div className="preview-mockup-hero">
                            <span className="preview-mockup-tagline">
                                {form.tagline || "Tu frase de marca acá"}
                            </span>
                            <button type="button" className="preview-mockup-btn">
                                Ver catálogo
                            </button>
                        </div>

                        <div
                            className="preview-mockup-card"
                            style={{
                                background: form.color_fondo_tarjetas,
                                borderRadius: form.radio_bordes === "cuadrado" ? "4px" : "14px",
                            }}
                        >
                            <div className="preview-mockup-card-img" />
                            <div className="preview-mockup-card-info">
                                <span className="preview-mockup-card-title">
                                    Producto de ejemplo
                                </span>
                                <span className="preview-mockup-card-price">
                                    $19.900
                                </span>
                            </div>
                            <span className="preview-mockup-card-tag">Oferta</span>
                        </div>

                        <div className="preview-mockup-footer">
                            <span>
                                © {new Date().getFullYear()} {form.nombre_tienda || "Mi Tienda"}
                            </span>
                            <div className="preview-mockup-socials">
                                {form.whatsapp && <span className="preview-mockup-social-dot" />}
                                {form.instagram && <span className="preview-mockup-social-dot" />}
                                {form.facebook && <span className="preview-mockup-social-dot" />}
                            </div>
                        </div>

                    </div>

                    <p className="preview-panel-hint">
                        Esto es una vista simplificada. Guardá los cambios y mirá
                        la tienda real para ver el resultado completo.
                    </p>

                </aside>

            </div>

        </div>
    );
};

export default Personalizacion;
