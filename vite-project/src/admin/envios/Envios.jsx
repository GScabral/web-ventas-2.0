import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
    getCostosEnvioTodos,
    crearCostoEnvio,
    actualizarCostoEnvio,
    eliminarCostoEnvio,
    mostrarToast,
} from "../../redux/action";

import "./Envios.css";

const Envios = () => {

    const dispatch = useDispatch();

    const [costos, setCostos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [provincia, setProvincia] = useState("");
    const [costo, setCosto] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const cargar = async () => {
        setCargando(true);
        try {
            const datos = await getCostosEnvioTodos();
            setCostos(datos);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMsg("");
        setGuardando(true);

        try {
            await dispatch(crearCostoEnvio({ provincia, costo: Number(costo) }));
            setProvincia("");
            setCosto("");
            dispatch(mostrarToast("Costo de envío agregado."));
            cargar();
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error || "No pudimos guardar el costo de envío."
            );
        } finally {
            setGuardando(false);
        }
    };

    const handleToggleActivo = async (item) => {
        await dispatch(actualizarCostoEnvio(item.id_costo_envio, { activo: !item.activo }));
        cargar();
    };

    const handleEliminar = async (item) => {
        if (!window.confirm(`¿Eliminar el costo de envío para "${item.provincia}"?`)) return;
        await dispatch(eliminarCostoEnvio(item.id_costo_envio));
        dispatch(mostrarToast("Costo de envío eliminado."));
        cargar();
    };

    return (
        <div className="envios-page">

            <div className="envios-header">
                <h1>Costos de envío</h1>
                <p>
                    Definí cuánto cobrar de envío según la provincia
                    del cliente. Se calcula solo en el checkout —
                    si una provincia no está cargada acá, el envío
                    se sigue coordinando a mano.
                </p>
            </div>

            <div className="envios-layout">

                <form className="envio-form" onSubmit={handleSubmit}>

                    <h2>Agregar provincia</h2>

                    <div className="form-group">
                        <label>Provincia</label>
                        <input
                            type="text"
                            value={provincia}
                            onChange={(e) => setProvincia(e.target.value)}
                            placeholder="Ej: Corrientes"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Costo de envío</label>
                        <input
                            type="number"
                            min="0"
                            value={costo}
                            onChange={(e) => setCosto(e.target.value)}
                            placeholder="Ej: 4500"
                            required
                        />
                    </div>

                    {errorMsg && <p className="envio-error">{errorMsg}</p>}

                    <button type="submit" className="btn-agregar-envio" disabled={guardando}>
                        {guardando ? "Guardando..." : "Agregar"}
                    </button>

                </form>

                <div className="envios-lista">

                    <h2>Provincias cargadas</h2>

                    {cargando ? (
                        <p className="envios-cargando">Cargando...</p>
                    ) : costos.length === 0 ? (
                        <div className="admin-empty-state">
                            Todavía no cargaste ningún costo de envío.
                        </div>
                    ) : (
                        costos.map((item) => (
                            <div
                                key={item.id_costo_envio}
                                className={`envio-item ${!item.activo ? "envio-item-inactivo" : ""}`}
                            >
                                <div className="envio-item-info">
                                    <span className="envio-item-provincia">{item.provincia}</span>
                                    <span className="envio-item-costo">
                                        ${Number(item.costo).toLocaleString("es-AR")}
                                    </span>
                                </div>

                                <div className="envio-item-actions">
                                    <button
                                        type="button"
                                        className="btn-action"
                                        onClick={() => handleToggleActivo(item)}
                                    >
                                        {item.activo ? "Desactivar" : "Activar"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-action btn-delete"
                                        onClick={() => handleEliminar(item)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                </div>

            </div>

        </div>
    );
};

export default Envios;
