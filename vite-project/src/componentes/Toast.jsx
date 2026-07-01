import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Toast.css";

const DURACION_MS = 2800;

// Aviso flotante genérico. Hoy solo lo dispara "se agregó al
// carrito", pero cualquier otra parte del sitio puede reusarlo
// despachando mostrarToast("lo que sea") — no hace falta tocar
// este componente para agregar un nuevo caso de uso.
const Toast = () => {

    const toast = useSelector(state => state.toast);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!toast) return;

        setVisible(true);

        const timeout = setTimeout(() => {
            setVisible(false);
        }, DURACION_MS);

        return () => clearTimeout(timeout);
    }, [toast?.key]);

    if (!toast) return null;

    return (
        <div className={`toast-aviso ${visible ? "toast-visible" : "toast-oculto"}`}>
            <span className="toast-check">✓</span>
            <span className="toast-mensaje">{toast.mensaje}</span>
            <Link to="/carrito" className="toast-link">
                Ver carrito
            </Link>
        </div>
    );
};

export default Toast;
