import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getCajaActual,
    abrirCaja,
    agregarMovimientoCaja,
    cerrarCaja,
    getHistorialCajas,
    mostrarToast,
} from "../../redux/action";

import InfoTooltip from "../components/InfoTooltip";

import "./Caja.css";

const formatearMoneda = (valor) =>
    `$${Number(valor || 0).toLocaleString("es-AR")}`;

const formatearFechaHora = (fecha) =>
    new Date(fecha).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

const formatearHora = (fecha) =>
    new Date(fecha).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
    });

const METODOS_PAGO = [
    { value: "efectivo", label: "💵 Efectivo" },
    { value: "transferencia", label: "🏦 Transferencia" },
    { value: "tarjeta_debito", label: "💳 Tarjeta débito" },
    { value: "tarjeta_credito", label: "💳 Tarjeta crédito" },
    { value: "mercado_pago", label: "📱 Mercado Pago" },
    { value: "otro", label: "Otro" },
];

const labelMetodoPago = (valor) =>
    METODOS_PAGO.find(m => m.value === valor)?.label || valor;

const Caja = () => {

    const dispatch = useDispatch();

    const cajaActual = useSelector(state => state.cajaActual);

    const [cargando, setCargando] = useState(true);

    const [montoInicial, setMontoInicial] = useState("");
    const [notasApertura, setNotasApertura] = useState("");
    const [abriendo, setAbriendo] = useState(false);
    const [errorApertura, setErrorApertura] = useState("");

    const [tipoMovimiento, setTipoMovimiento] = useState("ingreso");
    const [conceptoMovimiento, setConceptoMovimiento] = useState("");
    const [montoMovimiento, setMontoMovimiento] = useState("");
    const [metodoPagoMovimiento, setMetodoPagoMovimiento] = useState("efectivo");
    const [registrando, setRegistrando] = useState(false);
    const [errorMovimiento, setErrorMovimiento] = useState("");

    const [mostrarCierre, setMostrarCierre] = useState(false);
    const [montoContado, setMontoContado] = useState("");
    const [notasCierre, setNotasCierre] = useState("");
    const [cerrando, setCerrando] = useState(false);
    const [errorCierre, setErrorCierre] = useState("");

    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [historial, setHistorial] = useState([]);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);

    useEffect(() => {
        dispatch(getCajaActual()).finally(() => setCargando(false));
    }, [dispatch]);

    const handleAbrir = async (e) => {
        e.preventDefault();

        setErrorApertura("");
        setAbriendo(true);

        try {
            await dispatch(abrirCaja({
                monto_inicial: Number(montoInicial),
                notas: notasApertura,
            }));

            setMontoInicial("");
            setNotasApertura("");

            dispatch(mostrarToast("Caja abierta."));

        } catch (error) {
            setErrorApertura(
                error?.response?.data?.error || "No pudimos abrir la caja."
            );
        } finally {
            setAbriendo(false);
        }
    };

    const handleRegistrarMovimiento = async (e) => {
        e.preventDefault();

        setErrorMovimiento("");
        setRegistrando(true);

        try {
            await dispatch(agregarMovimientoCaja({
                tipo: tipoMovimiento,
                concepto: conceptoMovimiento,
                monto: Number(montoMovimiento),
                metodo_pago: metodoPagoMovimiento,
            }));

            setConceptoMovimiento("");
            setMontoMovimiento("");
            setMetodoPagoMovimiento("efectivo");

            dispatch(mostrarToast(
                tipoMovimiento === "ingreso" ? "Ingreso registrado." : "Egreso registrado."
            ));

        } catch (error) {
            setErrorMovimiento(
                error?.response?.data?.error || "No pudimos registrar el movimiento."
            );
        } finally {
            setRegistrando(false);
        }
    };

    const handleCerrar = async (e) => {
        e.preventDefault();

        setErrorCierre("");
        setCerrando(true);

        try {
            await dispatch(cerrarCaja({
                monto_contado: Number(montoContado),
                notas: notasCierre,
            }));

            setMostrarCierre(false);
            setMontoContado("");
            setNotasCierre("");

            dispatch(mostrarToast("Caja cerrada."));

        } catch (error) {
            setErrorCierre(
                error?.response?.data?.error || "No pudimos cerrar la caja."
            );
        } finally {
            setCerrando(false);
        }
    };

    const handleVerHistorial = async () => {
        setMostrarHistorial(true);
        setCargandoHistorial(true);

        try {
            const datos = await getHistorialCajas();
            setHistorial(datos);
        } catch (error) {
            console.error(error);
        } finally {
            setCargandoHistorial(false);
        }
    };

    if (cargando) {
        return (
            <div className="caja-page">
                <p className="caja-cargando">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="caja-page">

            <div className="caja-header">
                <div>
                    <h1>
                        Caja
                        <InfoTooltip texto="Abrí la caja con el efectivo inicial del día, registrá cada entrada/salida de plata, y cerrala al final para que quede el arqueo. Las ventas pagadas con Mercado Pago se registran solas." />
                    </h1>
                    <p>
                        Abrí la caja al empezar el día, registrá los
                        movimientos de efectivo, y cerrala al final
                        contando lo que hay en el cajón.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn-ver-historial"
                    onClick={handleVerHistorial}
                >
                    Ver historial
                </button>
            </div>

            {!cajaActual ? (

                <form className="caja-form-apertura" onSubmit={handleAbrir}>

                    <h2>Abrir caja</h2>

                    <div className="form-group">
                        <label>Fondo inicial</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={montoInicial}
                            onChange={(e) => setMontoInicial(e.target.value)}
                            placeholder="Ej: 5000"
                            required
                        />
                        <p className="campo-hint">
                            El efectivo con el que arrancás el día (vuelto, etc.)
                        </p>
                    </div>

                    <div className="form-group">
                        <label>Notas (opcional)</label>
                        <input
                            type="text"
                            value={notasApertura}
                            onChange={(e) => setNotasApertura(e.target.value)}
                            placeholder="Ej: turno mañana"
                        />
                    </div>

                    {errorApertura && <p className="caja-error">{errorApertura}</p>}

                    <button type="submit" className="btn-abrir-caja" disabled={abriendo}>
                        {abriendo ? "Abriendo..." : "Abrir caja"}
                    </button>

                </form>

            ) : (

                <>
                    <div className="caja-resumen">

                        <div className="caja-resumen-item">
                            <span>Fondo inicial</span>
                            <strong>{formatearMoneda(cajaActual.monto_inicial)}</strong>
                        </div>

                        <div className="caja-resumen-item caja-resumen-ingreso">
                            <span>Ingresos (todos los métodos)</span>
                            <strong>+{formatearMoneda(cajaActual.totalIngresos)}</strong>
                        </div>

                        <div className="caja-resumen-item caja-resumen-egreso">
                            <span>Egresos (todos los métodos)</span>
                            <strong>-{formatearMoneda(cajaActual.totalEgresos)}</strong>
                        </div>

                        <div className="caja-resumen-item caja-resumen-saldo">
                            <span>Saldo esperado en el cajón (solo efectivo)</span>
                            <strong>{formatearMoneda(cajaActual.saldoActual)}</strong>
                        </div>

                    </div>

                    <div className="caja-layout">

                        <form className="caja-form-movimiento" onSubmit={handleRegistrarMovimiento}>

                            <h2>Registrar movimiento</h2>

                            <div className="caja-tipo-toggle">
                                <button
                                    type="button"
                                    className={tipoMovimiento === "ingreso" ? "activo" : ""}
                                    onClick={() => setTipoMovimiento("ingreso")}
                                >
                                    + Ingreso
                                </button>
                                <button
                                    type="button"
                                    className={tipoMovimiento === "egreso" ? "activo" : ""}
                                    onClick={() => setTipoMovimiento("egreso")}
                                >
                                    − Egreso
                                </button>
                            </div>

                            <div className="form-group">
                                <label>Concepto</label>
                                <input
                                    type="text"
                                    value={conceptoMovimiento}
                                    onChange={(e) => setConceptoMovimiento(e.target.value)}
                                    placeholder={
                                        tipoMovimiento === "ingreso"
                                            ? "Ej: Venta pedido #12 en efectivo"
                                            : "Ej: Retiro para compra de insumos"
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Monto</label>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={montoMovimiento}
                                    onChange={(e) => setMontoMovimiento(e.target.value)}
                                    placeholder="Ej: 5000"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Método de pago</label>
                                <select
                                    value={metodoPagoMovimiento}
                                    onChange={(e) => setMetodoPagoMovimiento(e.target.value)}
                                >
                                    {METODOS_PAGO.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="campo-hint">
                                    Solo lo marcado como "Efectivo" afecta el
                                    conteo del cajón al cerrar caja.
                                </p>
                            </div>

                            {errorMovimiento && <p className="caja-error">{errorMovimiento}</p>}

                            <button
                                type="submit"
                                className={`btn-registrar-movimiento ${tipoMovimiento}`}
                                disabled={registrando}
                            >
                                {registrando ? "Registrando..." : `Registrar ${tipoMovimiento}`}
                            </button>

                        </form>

                        <div className="caja-movimientos-lista">

                            <h2>Movimientos de hoy</h2>

                            {(!cajaActual.movimientos || cajaActual.movimientos.length === 0) ? (
                                <div className="admin-empty-state">
                                    Todavía no hay movimientos registrados.
                                </div>
                            ) : (
                                cajaActual.movimientos.map((mov) => (
                                    <div key={mov.id_movimiento} className="caja-movimiento-item">
                                        <div>
                                            <span className="caja-movimiento-concepto">{mov.concepto}</span>
                                            <div className="caja-movimiento-meta">
                                                <span className="caja-movimiento-hora">
                                                    🕐 {formatearHora(mov.fecha)}
                                                </span>
                                                <span className="caja-movimiento-metodo">
                                                    {labelMetodoPago(mov.metodo_pago)}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`caja-movimiento-monto ${mov.tipo}`}>
                                            {mov.tipo === "ingreso" ? "+" : "-"}{formatearMoneda(mov.monto)}
                                        </span>
                                    </div>
                                ))
                            )}

                        </div>

                    </div>

                    <button
                        type="button"
                        className="btn-cerrar-caja"
                        onClick={() => setMostrarCierre(true)}
                    >
                        Cerrar caja
                    </button>

                </>
            )}

            {mostrarCierre && (
                <div className="custom-modal-overlay" onClick={() => setMostrarCierre(false)}>
                    <div className="custom-modal" onClick={(e) => e.stopPropagation()}>

                        <div className="custom-modal-header">
                            <h2>Cerrar caja</h2>
                            <button
                                type="button"
                                className="custom-modal-close"
                                onClick={() => setMostrarCierre(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCerrar}>
                            <div className="custom-modal-body">

                                <p className="caja-cierre-esperado">
                                    Saldo esperado según el sistema:{" "}
                                    <strong>{formatearMoneda(cajaActual?.saldoActual)}</strong>
                                </p>

                                <div className="form-group">
                                    <label>Efectivo contado en el cajón</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={montoContado}
                                        onChange={(e) => setMontoContado(e.target.value)}
                                        placeholder="Contá el efectivo real y escribilo acá"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {montoContado && (
                                    <p className={
                                        "caja-diferencia-preview " +
                                        (Number(montoContado) - (cajaActual?.saldoActual || 0) === 0
                                            ? "caja-diferencia-ok"
                                            : "caja-diferencia-mal")
                                    }>
                                        {Number(montoContado) - (cajaActual?.saldoActual || 0) === 0
                                            ? "✓ Coincide exacto."
                                            : Number(montoContado) - (cajaActual?.saldoActual || 0) > 0
                                                ? `Sobran ${formatearMoneda(Number(montoContado) - (cajaActual?.saldoActual || 0))}`
                                                : `Faltan ${formatearMoneda(Math.abs(Number(montoContado) - (cajaActual?.saldoActual || 0)))}`
                                        }
                                    </p>
                                )}

                                <div className="form-group">
                                    <label>Notas (opcional)</label>
                                    <input
                                        type="text"
                                        value={notasCierre}
                                        onChange={(e) => setNotasCierre(e.target.value)}
                                        placeholder="Ej: faltante por vuelto de más"
                                    />
                                </div>

                                {errorCierre && <p className="caja-error">{errorCierre}</p>}

                            </div>

                            <div className="custom-modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setMostrarCierre(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-save"
                                    disabled={cerrando}
                                >
                                    {cerrando ? "Cerrando..." : "Confirmar cierre"}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

            {mostrarHistorial && (
                <div className="custom-modal-overlay" onClick={() => setMostrarHistorial(false)}>
                    <div className="custom-modal caja-historial-modal" onClick={(e) => e.stopPropagation()}>

                        <div className="custom-modal-header">
                            <h2>Historial de cajas</h2>
                            <button
                                type="button"
                                className="custom-modal-close"
                                onClick={() => setMostrarHistorial(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="custom-modal-body">
                            {cargandoHistorial ? (
                                <p className="caja-cargando">Cargando...</p>
                            ) : historial.length === 0 ? (
                                <div className="admin-empty-state">
                                    Todavía no cerraste ninguna caja.
                                </div>
                            ) : (
                                historial.map((sesion) => (
                                    <div key={sesion.id_sesion} className="caja-historial-item">
                                        <div className="caja-historial-fecha">
                                            {new Date(sesion.fecha_apertura).toLocaleDateString("es-AR")}
                                            {" — "}
                                            {formatearFechaHora(sesion.fecha_apertura)} a{" "}
                                            {formatearFechaHora(sesion.fecha_cierre)}
                                        </div>
                                        <div className="caja-historial-montos">
                                            <span>Inicial: {formatearMoneda(sesion.monto_inicial)}</span>
                                            <span>Esperado: {formatearMoneda(sesion.monto_final_esperado)}</span>
                                            <span>Contado: {formatearMoneda(sesion.monto_final_contado)}</span>
                                            <span className={
                                                sesion.diferencia === 0
                                                    ? "caja-diferencia-ok"
                                                    : "caja-diferencia-mal"
                                            }>
                                                Diferencia: {sesion.diferencia > 0 ? "+" : ""}{formatearMoneda(sesion.diferencia)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Caja;
