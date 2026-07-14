import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getCupones,
    crearCupon,
    toggleCupon,
    eliminarCupon,
} from "../../redux/action";

import InfoTooltip from "../components/InfoTooltip";

import "./Cupones.css";

const FORM_VACIO = {
    codigo: "",
    tipo: "porcentaje",
    valor: "",
    fecha_inicio: "",
    fecha_fin: "",
    usos_maximos: "",
    monto_minimo: "",
};

const Cupones = () => {

    const dispatch = useDispatch();

    const cupones = useSelector(state => state.cupones) || [];

    const [form, setForm] = useState(FORM_VACIO);
    const [guardando, setGuardando] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        dispatch(getCupones());
    }, [dispatch]);

    const handleChange = (campo, valor) => {
        setForm(prev => ({ ...prev, [campo]: valor }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMsg("");
        setMensaje("");
        setGuardando(true);

        try {
            await dispatch(crearCupon({
                codigo: form.codigo,
                tipo: form.tipo,
                valor: Number(form.valor),
                fecha_inicio: form.fecha_inicio || null,
                fecha_fin: form.fecha_fin || null,
                usos_maximos: form.usos_maximos ? Number(form.usos_maximos) : null,
                monto_minimo: form.monto_minimo ? Number(form.monto_minimo) : null,
            }));

            setMensaje(`Cupón "${form.codigo.toUpperCase()}" creado.`);
            setForm(FORM_VACIO);

        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error ||
                "No pudimos crear el cupón."
            );
        } finally {
            setGuardando(false);
        }
    };

    const handleToggle = (id) => {
        dispatch(toggleCupon(id));
    };

    const handleEliminar = (id, codigo) => {
        if (!window.confirm(`¿Eliminar el cupón "${codigo}"? Esta acción no se puede deshacer.`)) {
            return;
        }
        dispatch(eliminarCupon(id));
    };

    const estaVencido = (cupon) =>
        cupon.fecha_fin && new Date(cupon.fecha_fin) < new Date();

    const alcanzoLimite = (cupon) =>
        cupon.usos_maximos !== null && cupon.usos_actuales >= cupon.usos_maximos;

    return (
        <div className="cupones-page">

            <div className="cupones-header">
                <h1>
                    Cupones de descuento
                    <InfoTooltip texto="Creá un código (ej: VERANO20), definí el descuento, fecha de vigencia y usos máximos. El cliente lo escribe en el checkout para aplicarlo." />
                </h1>
                <p>
                    Creá códigos que tus clientes puedan escribir en el
                    checkout para obtener un descuento.
                </p>
            </div>

            <div className="cupones-layout">

                <form className="cupon-form" onSubmit={handleSubmit}>

                    <h2>Nuevo cupón</h2>

                    <div className="form-group">
                        <label>Código</label>
                        <input
                            type="text"
                            value={form.codigo}
                            onChange={(e) => handleChange("codigo", e.target.value)}
                            placeholder="Ej: BIENVENIDA10"
                            required
                        />
                        <p className="campo-hint">
                            Se guarda en mayúsculas, sin importar cómo lo escribas acá.
                        </p>
                    </div>

                    <div className="cupon-form-row">

                        <div className="form-group">
                            <label>Tipo</label>
                            <select
                                value={form.tipo}
                                onChange={(e) => handleChange("tipo", e.target.value)}
                            >
                                <option value="porcentaje">Porcentaje (%)</option>
                                <option value="fijo">Monto fijo ($)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Valor</label>
                            <input
                                type="number"
                                min="1"
                                value={form.valor}
                                onChange={(e) => handleChange("valor", e.target.value)}
                                placeholder={form.tipo === "porcentaje" ? "Ej: 10" : "Ej: 5000"}
                                required
                            />
                        </div>

                    </div>

                    <div className="cupon-form-row">

                        <div className="form-group">
                            <label>Vigencia desde (opcional)</label>
                            <input
                                type="date"
                                value={form.fecha_inicio}
                                onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Vigencia hasta (opcional)</label>
                            <input
                                type="date"
                                value={form.fecha_fin}
                                onChange={(e) => handleChange("fecha_fin", e.target.value)}
                            />
                        </div>

                    </div>

                    <div className="cupon-form-row">

                        <div className="form-group">
                            <label>Usos máximos (opcional)</label>
                            <input
                                type="number"
                                min="1"
                                value={form.usos_maximos}
                                onChange={(e) => handleChange("usos_maximos", e.target.value)}
                                placeholder="Sin límite"
                            />
                        </div>

                        <div className="form-group">
                            <label>Compra mínima (opcional)</label>
                            <input
                                type="number"
                                min="0"
                                value={form.monto_minimo}
                                onChange={(e) => handleChange("monto_minimo", e.target.value)}
                                placeholder="Sin mínimo"
                            />
                        </div>

                    </div>

                    {errorMsg && <p className="cupon-error">{errorMsg}</p>}
                    {mensaje && <p className="cupon-success">{mensaje}</p>}

                    <button
                        type="submit"
                        className="btn-crear-cupon"
                        disabled={guardando}
                    >
                        {guardando ? "Creando..." : "Crear cupón"}
                    </button>

                </form>

                <div className="cupones-lista">

                    <h2>Cupones existentes</h2>

                    {cupones.length === 0 ? (
                        <div className="admin-empty-state">
                            Todavía no creaste ningún cupón.
                        </div>
                    ) : (
                        cupones.map((cupon) => {

                            const vencido = estaVencido(cupon);
                            const sinUsos = alcanzoLimite(cupon);
                            const inactivo = !cupon.activo || vencido || sinUsos;

                            return (
                                <div
                                    key={cupon.id_cupon}
                                    className={`cupon-item ${inactivo ? "cupon-item-inactivo" : ""}`}
                                >

                                    <div className="cupon-item-info">

                                        <div className="cupon-item-codigo-row">
                                            <span className="cupon-item-codigo">{cupon.codigo}</span>

                                            {!cupon.activo && (
                                                <span className="cupon-tag cupon-tag-off">Desactivado</span>
                                            )}
                                            {cupon.activo && vencido && (
                                                <span className="cupon-tag cupon-tag-vencido">Vencido</span>
                                            )}
                                            {cupon.activo && !vencido && sinUsos && (
                                                <span className="cupon-tag cupon-tag-vencido">Sin usos disponibles</span>
                                            )}
                                            {cupon.activo && !vencido && !sinUsos && (
                                                <span className="cupon-tag cupon-tag-activo">Activo</span>
                                            )}
                                        </div>

                                        <span className="cupon-item-detalle">
                                            {cupon.tipo === "porcentaje"
                                                ? `${cupon.valor}% de descuento`
                                                : `$${Number(cupon.valor).toLocaleString("es-AR")} de descuento`}
                                            {cupon.monto_minimo ? ` · Mínimo $${Number(cupon.monto_minimo).toLocaleString("es-AR")}` : ""}
                                        </span>

                                        <span className="cupon-item-usos">
                                            Usado {cupon.usos_actuales} {cupon.usos_maximos ? `de ${cupon.usos_maximos}` : "vez(es)"}
                                            {cupon.fecha_fin ? ` · Vence el ${new Date(cupon.fecha_fin).toLocaleDateString("es-AR")}` : ""}
                                        </span>

                                    </div>

                                    <div className="cupon-item-actions">

                                        <button
                                            type="button"
                                            className="btn-action"
                                            onClick={() => handleToggle(cupon.id_cupon)}
                                        >
                                            {cupon.activo ? "Desactivar" : "Activar"}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn-action btn-delete"
                                            onClick={() => handleEliminar(cupon.id_cupon, cupon.codigo)}
                                        >
                                            Eliminar
                                        </button>

                                    </div>

                                </div>
                            );
                        })
                    )}

                </div>

            </div>

        </div>
    );
};

export default Cupones;
