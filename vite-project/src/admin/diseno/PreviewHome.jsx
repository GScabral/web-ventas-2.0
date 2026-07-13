import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";

import Home from "../../pages/Home/home";

import "./previewHome.css";

// Ruta propia (fuera del shell del panel admin, ver App.jsx) para que
// el admin vea el borrador con el mismo Nav/Footer que ve un visitante
// real, sin publicar nada. Reusa el mismo Home.jsx del sitio público,
// solo que en modo="borrador" (lee secciones_borrador en vez de
// secciones_publicado).
//
// Al ser una ruta hermana de "/admin/*" (no anidada dentro de las
// Routes de panelAdmin.jsx), valida sesión acá mismo en vez de heredar
// el isLoggedIn de PanelAdmin.
const PreviewHome = () => {

    const isLoggedIn = useSelector(state => state.isLoggedInAd);

    // "desktop" = ancho completo (como se ve normalmente). "mobile" =
    // recorta el ancho a 390px y centra, para simular una pantalla de
    // celular sin necesitar herramientas del navegador.
    const [vista, setVista] = useState("desktop");

    if (!isLoggedIn) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div>
            <div className="preview-home-aviso">
                <span>👁️ Vista previa del borrador — todavía no está publicado en la tienda.</span>

                <div className="preview-home-toggle">
                    <button
                        type="button"
                        className={vista === "desktop" ? "activo" : ""}
                        onClick={() => setVista("desktop")}
                    >
                        💻 Escritorio
                    </button>
                    <button
                        type="button"
                        className={vista === "mobile" ? "activo" : ""}
                        onClick={() => setVista("mobile")}
                    >
                        📱 Mobile
                    </button>
                </div>

                <Link to="/admin/diseno">Volver a Diseño</Link>
            </div>

            {vista === "mobile" ? (
                <div className="preview-home-mobile-frame">
                    <Home modo="borrador" />
                </div>
            ) : (
                <Home modo="borrador" />
            )}
        </div>
    );
};

export default PreviewHome;
