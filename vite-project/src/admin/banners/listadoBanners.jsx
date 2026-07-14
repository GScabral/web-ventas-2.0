import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getBannersAdmin,
    crearBanner,
    actualizarBanner,
    eliminarBanner
} from "../../redux/action";

import InfoTooltip from "../components/InfoTooltip";

import "./listadoBanners.css";

const FORM_VACIO = {
    tipo: "main",
    eyebrow: "",
    titulo: "",
    textoBoton: "Ver más",
    link: "/catalogo",
    imagen: "",
    color: "#ff6b35",
    inicio: "",
    fin: "",
};

const BannersLista = () => {

    const dispatch = useDispatch();

    const banners = useSelector(state => state.bannersAdmin) || [];

    const [editandoId, setEditandoId] = useState(null);
    const [form, setForm] = useState(FORM_VACIO);
    const [guardando, setGuardando] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        dispatch(getBannersAdmin());
    }, [dispatch]);

    const handleChange = (campo, valor) => {
        setForm(prev => ({ ...prev, [campo]: valor }));
    };

    const handleEditar = (banner) => {
        setEditandoId(banner.id_banner);
        setForm({
            tipo: banner.tipo,
            eyebrow: banner.eyebrow || "",
            titulo: banner.titulo || "",
            textoBoton: banner.textoBoton || "Ver más",
            link: banner.link || "/catalogo",
            imagen: banner.imagen || "",
            color: banner.color || "#ff6b35",
            inicio: banner.inicio ? banner.inicio.slice(0, 10) : "",
            fin: banner.fin ? banner.fin.slice(0, 10) : "",
        });
    };

    const handleCancelar = () => {
        setEditandoId(null);
        setForm(FORM_VACIO);
        setErrorMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.titulo.trim()) {
            setErrorMsg("El banner necesita un título.");
            return;
        }

        setGuardando(true);
        setErrorMsg("");

        try {
            if (editandoId) {
                await dispatch(actualizarBanner(editandoId, form));
            } else {
                await dispatch(crearBanner(form));
            }

            handleCancelar();
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error ||
                "No pudimos guardar el banner. Intentá de nuevo."
            );
        } finally {
            setGuardando(false);
        }
    };

    const handleToggleActivo = (banner) => {
        dispatch(actualizarBanner(banner.id_banner, { activo: !banner.activo }));
    };

    const handleEliminar = (id) => {
        const confirmar = window.confirm("¿Eliminar este banner?");
        if (!confirmar) return;
        dispatch(eliminarBanner(id));
    };

    const bannersMain = banners.filter(b => b.tipo === "main");
    const bannersSide = banners.filter(b => b.tipo === "side");

    return (

        <div className="banners-page">

            <div className="banners-header">
                <h1>
                    Banners promocionales
                    <InfoTooltip texto="La sección 'banner' de la portada tiene que estar visible desde Diseño para que esto se vea en la tienda. Acá cargás la imagen, el texto y el link de cada uno." />
                </h1>
                <p>Gestioná la tira de banners que aparece arriba del catálogo en la home.</p>
            </div>

            <form className="banner-form" onSubmit={handleSubmit}>

                <h2>{editandoId ? "Editar banner" : "Nuevo banner"}</h2>

                <div className="banner-form-grid">

                    <div className="form-group">
                        <label>Tipo</label>
                        <select
                            value={form.tipo}
                            onChange={(e) => handleChange("tipo", e.target.value)}
                        >
                            <option value="main">Principal (banner grande)</option>
                            <option value="side">Secundario (banner chico)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Texto chico (eyebrow)</label>
                        <input
                            type="text"
                            value={form.eyebrow}
                            onChange={(e) => handleChange("eyebrow", e.target.value)}
                            placeholder="Ej: Nueva colección"
                        />
                    </div>

                    <div className="form-group form-group-full">
                        <label>Título</label>
                        <input
                            type="text"
                            value={form.titulo}
                            onChange={(e) => handleChange("titulo", e.target.value)}
                            placeholder="Ej: Hasta 30% OFF en productos seleccionados"
                        />
                    </div>

                    <div className="form-group">
                        <label>Texto del botón</label>
                        <input
                            type="text"
                            value={form.textoBoton}
                            onChange={(e) => handleChange("textoBoton", e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Link de destino</label>
                        <input
                            type="text"
                            value={form.link}
                            onChange={(e) => handleChange("link", e.target.value)}
                            placeholder="/catalogo"
                        />
                    </div>

                    <div className="form-group">
                        <label>Imagen de fondo (URL, opcional)</label>
                        <input
                            type="text"
                            value={form.imagen}
                            onChange={(e) => handleChange("imagen", e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Color de acento (si no hay imagen)</label>
                        <input
                            type="color"
                            value={form.color}
                            onChange={(e) => handleChange("color", e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Vigente desde (opcional)</label>
                        <input
                            type="date"
                            value={form.inicio}
                            onChange={(e) => handleChange("inicio", e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Vigente hasta (opcional)</label>
                        <input
                            type="date"
                            value={form.fin}
                            onChange={(e) => handleChange("fin", e.target.value)}
                        />
                    </div>

                </div>

                {errorMsg && (
                    <p className="banner-form-error">{errorMsg}</p>
                )}

                <div className="banner-form-actions">

                    <button type="submit" className="btn-save-banner" disabled={guardando}>
                        {guardando
                            ? "Guardando..."
                            : editandoId
                                ? "Guardar cambios"
                                : "Crear banner"}
                    </button>

                    {editandoId && (
                        <button
                            type="button"
                            className="btn-cancel-banner"
                            onClick={handleCancelar}
                        >
                            Cancelar
                        </button>
                    )}

                </div>

            </form>

            <div className="banners-section">

                <h2>Banner principal ({bannersMain.length})</h2>

                <div className="banners-grid">

                    {bannersMain.map(banner => (
                        <BannerCard
                            key={banner.id_banner}
                            banner={banner}
                            onEditar={handleEditar}
                            onToggle={handleToggleActivo}
                            onEliminar={handleEliminar}
                        />
                    ))}

                    {bannersMain.length === 0 && (
                        <p className="banners-empty">
                            No hay ningún banner principal cargado. Mientras tanto se muestra un texto por defecto en la home.
                        </p>
                    )}

                </div>

            </div>

            <div className="banners-section">

                <h2>Banners secundarios ({bannersSide.length})</h2>

                <div className="banners-grid">

                    {bannersSide.map(banner => (
                        <BannerCard
                            key={banner.id_banner}
                            banner={banner}
                            onEditar={handleEditar}
                            onToggle={handleToggleActivo}
                            onEliminar={handleEliminar}
                        />
                    ))}

                    {bannersSide.length === 0 && (
                        <p className="banners-empty">
                            No hay banners secundarios cargados. Mientras tanto se muestra "Recién llegado" por defecto, que lleva al catálogo ordenado por los productos más nuevos.
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
};

const BannerCard = ({ banner, onEditar, onToggle, onEliminar }) => (

    <div className={`banner-card ${!banner.activo ? "inactivo" : ""}`}>

        <div
            className="banner-card-preview"
            style={{
                background: banner.imagen
                    ? `url(${banner.imagen}) center / cover`
                    : banner.color || "#1a1410"
            }}
        >
            <span>{banner.eyebrow}</span>
            <strong>{banner.titulo}</strong>
        </div>

        <div className="banner-card-info">

            <p className="banner-card-link">{banner.link}</p>

            {(banner.inicio || banner.fin) && (
                <p className="banner-card-vigencia">
                    {banner.inicio ? new Date(banner.inicio).toLocaleDateString("es-AR") : "Siempre"}
                    {" → "}
                    {banner.fin ? new Date(banner.fin).toLocaleDateString("es-AR") : "Sin fin"}
                </p>
            )}

            <div className="banner-card-actions">

                <button onClick={() => onEditar(banner)}>
                    Editar
                </button>

                <button onClick={() => onToggle(banner)}>
                    {banner.activo ? "Desactivar" : "Activar"}
                </button>

                <button
                    className="banner-card-delete"
                    onClick={() => onEliminar(banner.id_banner)}
                >
                    Eliminar
                </button>

            </div>

        </div>

    </div>
);

export default BannersLista;
