import React, { useState } from "react";
import { useSelector } from "react-redux";

import { STORE_CONFIG } from "../../config/storeConfig";

import "./LoginScreen.css";

const LoginScreen = ({ onSubmit, loginError, loading }) => {

    const configuracion = useSelector((state) => state.configuracion);

    const nombreTienda = configuracion?.nombre_tienda || STORE_CONFIG.name;
    const logoUrl = configuracion?.logo_url;

    const [verPassword, setVerPassword] = useState(false);

    return (
        <div className="login-screen">

            <div className="login-screen-fondo" />

            <div className="login-card">

                <div className="login-card-marca">
                    {logoUrl ? (
                        <img src={logoUrl} alt={nombreTienda} className="login-card-logo" />
                    ) : (
                        <div className="login-card-logo-fallback">
                            {nombreTienda.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <span className="login-card-nombre">{nombreTienda}</span>
                </div>

                <div className="login-card-encabezado">
                    <h1>Panel de administración</h1>
                    <p>Ingresá tu contraseña para continuar.</p>
                </div>

                <form onSubmit={onSubmit} autoComplete="off" className="login-form">

                    <label className="login-label" htmlFor="password">
                        Contraseña
                    </label>

                    <div className="login-input-row">
                        <input
                            id="password"
                            type={verPassword ? "text" : "password"}
                            name="password"
                            className="login-input"
                            placeholder="••••••••"
                            autoFocus
                        />

                        <button
                            type="button"
                            className="login-toggle-ver"
                            onClick={() => setVerPassword((v) => !v)}
                            tabIndex={-1}
                            aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {verPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    {loginError && (
                        <p className="login-error">{loginError}</p>
                    )}

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>

                </form>

                <p className="login-footer">
                    Acceso restringido — solo administradores.
                </p>

            </div>

        </div>
    );
};

export default LoginScreen;
