import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
    getCostosEnvioTodos,
    crearCostoEnvio,
    actualizarCostoEnvio,
    eliminarCostoEnvio,
    crearCostosEnvioBulk,
    getZonasMotoTodas,
    crearZonaMoto,
    actualizarZonaMoto,
    eliminarZonaMoto,
    mostrarToast,
} from "../../redux/action";

import { PROVINCIAS_AR } from "../../config/provinciasAR";
import InfoTooltip from "../components/InfoTooltip";

import "./Envios.css";

// Texto corto del tiempo de entrega para las listas del admin.
const textoDiasAdmin = (min, max) => {
    if (!min && !max) return "";
    if (min && max && min !== max) return `${min}-${max} días`;
    const n = max || min;
    return n ? `${n} día${n > 1 ? "s" : ""}` : "";
};

const Envios = () => {

    const dispatch = useDispatch();

    const [costos, setCostos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [provincia, setProvincia] = useState("");
    const [costo, setCosto] = useState("");
    const [diasMin, setDiasMin] = useState("");
    const [diasMax, setDiasMax] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [cargandoBulk, setCargandoBulk] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Zonas de envío por moto (entrega rápida dentro de la misma
    // ciudad) — mismo patrón que los costos por provincia de arriba,
    // pero matcheando por ciudad.
    const [zonasMoto, setZonasMoto] = useState([]);
    const [cargandoMoto, setCargandoMoto] = useState(true);

    const [ciudadMoto, setCiudadMoto] = useState("");
    const [costoMoto, setCostoMoto] = useState("");
    const [diasMinMoto, setDiasMinMoto] = useState("");
    const [diasMaxMoto, setDiasMaxMoto] = useState("");
    const [guardandoMoto, setGuardandoMoto] = useState(false);
    const [errorMotoMsg, setErrorMotoMsg] = useState("");

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

    const cargarMoto = async () => {
        setCargandoMoto(true);
        try {
            const datos = await getZonasMotoTodas();
            setZonasMoto(datos);
        } catch (error) {
            console.error(error);
        } finally {
            setCargandoMoto(false);
        }
    };

    useEffect(() => {
        cargar();
        cargarMoto();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMsg("");
        setGuardando(true);

        try {
            await dispatch(crearCostoEnvio({
                provincia,
                costo: Number(costo),
                dias_min: diasMin,
                dias_max: diasMax,
            }));
            setProvincia("");
            setCosto("");
            setDiasMin("");
            setDiasMax("");
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

    // Carga masiva: agrega todas las provincias argentinas que falten,
    // con costo 0. El admin después les pone precio y días.
    const handleBulk = async () => {
        setErrorMsg("");
        setCargandoBulk(true);
        try {
            const data = await crearCostosEnvioBulk();
            setCostos(data.costos);
            dispatch(mostrarToast(
                data.agregadas > 0
                    ? `Se agregaron ${data.agregadas} provincia(s). Ponéles el costo.`
                    : "Ya estaban cargadas todas las provincias."
            ));
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.error || "No pudimos cargar las provincias."
            );
        } finally {
            setCargandoBulk(false);
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

    const handleSubmitMoto = async (e) => {
        e.preventDefault();

        setErrorMotoMsg("");
        setGuardandoMoto(true);

        try {
            await dispatch(crearZonaMoto({
                ciudad: ciudadMoto,
                costo: Number(costoMoto),
                dias_min: diasMinMoto,
                dias_max: diasMaxMoto,
            }));
            setCiudadMoto("");
            setCostoMoto("");
            setDiasMinMoto("");
            setDiasMaxMoto("");
            dispatch(mostrarToast("Zona de envío por moto agregada."));
            cargarMoto();
        } catch (error) {
            setErrorMotoMsg(
                error?.response?.data?.error || "No pudimos guardar la zona de envío por moto."
            );
        } finally {
            setGuardandoMoto(false);
        }
    };

    const handleToggleActivoMoto = async (item) => {
        await dispatch(actualizarZonaMoto(item.id_zona_moto, { activo: !item.activo }));
        cargarMoto();
    };

    const handleEliminarMoto = async (item) => {
        if (!window.confirm(`¿Eliminar la zona de moto para "${item.ciudad}"?`)) return;
        await dispatch(eliminarZonaMoto(item.id_zona_moto));
        dispatch(mostrarToast("Zona de envío por moto eliminada."));
        cargarMoto();
    };

    return (
        <div className="envios-page">

            <div className="envios-header">
                <h1>
                    Costos de envío
                    <InfoTooltip texto="Un costo fijo por provincia para envío por correo. Se calcula solo en el checkout según la dirección del cliente." />
                </h1>
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
                        <select
                            value={provincia}
                            onChange={(e) => setProvincia(e.target.value)}
                            required
                        >
                            <option value="">Elegí una provincia</option>
                            {PROVINCIAS_AR.map((prov) => (
                                <option key={prov} value={prov}>{prov}</option>
                            ))}
                        </select>
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

                    <div className="form-group">
                        <label>Tiempo de entrega estimado (opcional)</label>
                        <div className="envio-dias-row">
                            <input
                                type="number"
                                min="0"
                                value={diasMin}
                                onChange={(e) => setDiasMin(e.target.value)}
                                placeholder="Mín."
                            />
                            <span>a</span>
                            <input
                                type="number"
                                min="0"
                                value={diasMax}
                                onChange={(e) => setDiasMax(e.target.value)}
                                placeholder="Máx."
                            />
                            <span>días hábiles</span>
                        </div>
                    </div>

                    {errorMsg && <p className="envio-error">{errorMsg}</p>}

                    <button type="submit" className="btn-agregar-envio" disabled={guardando}>
                        {guardando ? "Guardando..." : "Agregar"}
                    </button>

                    <button
                        type="button"
                        className="btn-bulk-provincias"
                        onClick={handleBulk}
                        disabled={cargandoBulk}
                    >
                        {cargandoBulk ? "Cargando..." : "+ Cargar todas las provincias"}
                    </button>
                    <p className="envio-bulk-hint">
                        Agrega de una las 24 provincias con costo 0. Después les
                        ponés el precio y el tiempo de entrega a cada una.
                    </p>

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
                                    {textoDiasAdmin(item.dias_min, item.dias_max) && (
                                        <span className="envio-item-dias">
                                            🚚 {textoDiasAdmin(item.dias_min, item.dias_max)}
                                        </span>
                                    )}
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

            <div className="envios-header" style={{ marginTop: "48px" }}>
                <h1>
                    Zonas de envío por moto
                    <InfoTooltip texto="Ciudades donde ofrecés entrega rápida en moto/cadete, más barata que el correo. Si la ciudad del cliente no está acá, no aparece esta opción en el checkout." />
                </h1>
                <p>
                    Ciudades donde ofrecés entrega rápida en moto/cadete
                    (más barata y más rápida que el correo dentro de la
                    misma ciudad). En el checkout, el cliente solo va a
                    ver esta opción si su ciudad coincide con una de las
                    cargadas acá.
                </p>
            </div>

            <div className="envios-layout">

                <form className="envio-form" onSubmit={handleSubmitMoto}>

                    <h2>Agregar ciudad</h2>

                    <div className="form-group">
                        <label>Ciudad</label>
                        <input
                            type="text"
                            value={ciudadMoto}
                            onChange={(e) => setCiudadMoto(e.target.value)}
                            placeholder="Ej: Resistencia"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Costo de envío por moto</label>
                        <input
                            type="number"
                            min="0"
                            value={costoMoto}
                            onChange={(e) => setCostoMoto(e.target.value)}
                            placeholder="Ej: 1500"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Tiempo de entrega estimado (opcional)</label>
                        <div className="envio-dias-row">
                            <input
                                type="number"
                                min="0"
                                value={diasMinMoto}
                                onChange={(e) => setDiasMinMoto(e.target.value)}
                                placeholder="Mín."
                            />
                            <span>a</span>
                            <input
                                type="number"
                                min="0"
                                value={diasMaxMoto}
                                onChange={(e) => setDiasMaxMoto(e.target.value)}
                                placeholder="Máx."
                            />
                            <span>días hábiles</span>
                        </div>
                    </div>

                    {errorMotoMsg && <p className="envio-error">{errorMotoMsg}</p>}

                    <button type="submit" className="btn-agregar-envio" disabled={guardandoMoto}>
                        {guardandoMoto ? "Guardando..." : "Agregar"}
                    </button>

                </form>

                <div className="envios-lista">

                    <h2>Ciudades cargadas</h2>

                    {cargandoMoto ? (
                        <p className="envios-cargando">Cargando...</p>
                    ) : zonasMoto.length === 0 ? (
                        <div className="admin-empty-state">
                            Todavía no cargaste ninguna zona de envío por moto.
                        </div>
                    ) : (
                        zonasMoto.map((item) => (
                            <div
                                key={item.id_zona_moto}
                                className={`envio-item ${!item.activo ? "envio-item-inactivo" : ""}`}
                            >
                                <div className="envio-item-info">
                                    <span className="envio-item-provincia">{item.ciudad}</span>
                                    <span className="envio-item-costo">
                                        ${Number(item.costo).toLocaleString("es-AR")}
                                    </span>
                                    {textoDiasAdmin(item.dias_min, item.dias_max) && (
                                        <span className="envio-item-dias">
                                            🚚 {textoDiasAdmin(item.dias_min, item.dias_max)}
                                        </span>
                                    )}
                                </div>

                                <div className="envio-item-actions">
                                    <button
                                        type="button"
                                        className="btn-action"
                                        onClick={() => handleToggleActivoMoto(item)}
                                    >
                                        {item.activo ? "Desactivar" : "Activar"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-action btn-delete"
                                        onClick={() => handleEliminarMoto(item)}
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
