import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
    getPapelera,
    restaurarProducto,
    eliminarDefinitivoProducto,
    mostrarToast,
} from "../../redux/action";

import InfoTooltip from "../components/InfoTooltip";

import "./Papelera.css";

const formatearFecha = (fecha) =>
    fecha
        ? new Date(fecha).toLocaleDateString("es-AR", {
            day: "2-digit", month: "2-digit", year: "numeric",
        })
        : "";

const Papelera = () => {

    const dispatch = useDispatch();

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const cargarPapelera = async () => {
        setCargando(true);
        try {
            const datos = await getPapelera();
            setProductos(datos);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarPapelera();
    }, []);

    const handleRestaurar = async (id, nombre) => {
        try {
            await dispatch(restaurarProducto(id));
            dispatch(mostrarToast(`"${nombre}" restaurado al inventario.`));
            cargarPapelera();
        } catch (error) {
            dispatch(mostrarToast("No pudimos restaurar el producto."));
        }
    };

    const handleEliminarDefinitivo = async (id, nombre) => {
        if (!window.confirm(
            `¿Eliminar "${nombre}" para siempre? Esta acción no se puede deshacer — se pierden todas sus variantes e imágenes.`
        )) {
            return;
        }

        try {
            await dispatch(eliminarDefinitivoProducto(id));
            dispatch(mostrarToast(`"${nombre}" eliminado definitivamente.`));
            cargarPapelera();
        } catch (error) {
            dispatch(mostrarToast("No pudimos eliminar el producto."));
        }
    };

    return (
        <div className="papelera-page">

            <div className="papelera-header">
                <h1>
                    Papelera
                    <InfoTooltip texto="Los productos eliminados quedan acá, no se borran para siempre. Podés restaurarlos, o eliminarlos definitivamente cuando estés seguro." />
                </h1>
                <p>
                    Los productos eliminados quedan acá antes de
                    borrarse para siempre — podés restaurarlos si fue
                    un error.
                </p>
            </div>

            {cargando ? (
                <p className="papelera-cargando">Cargando...</p>
            ) : productos.length === 0 ? (
                <div className="admin-empty-state">
                    La papelera está vacía.
                </div>
            ) : (
                <div className="papelera-lista">
                    {productos.map((producto) => (
                        <div key={producto.id} className="papelera-item">

                            <div className="papelera-item-info">
                                <span className="papelera-item-nombre">
                                    {producto.nombre}
                                </span>
                                <span className="papelera-item-meta">
                                    {producto.categoria?.nombre || "Sin categoría"}
                                    {" · "}
                                    {producto.cantidadVariantes} variante(s)
                                    {" · "}
                                    Archivado el {formatearFecha(producto.archivado_en)}
                                </span>
                            </div>

                            <div className="papelera-item-actions">
                                <button
                                    type="button"
                                    className="btn-restaurar"
                                    onClick={() => handleRestaurar(producto.id, producto.nombre)}
                                >
                                    Restaurar
                                </button>

                                <button
                                    type="button"
                                    className="btn-eliminar-definitivo"
                                    onClick={() => handleEliminarDefinitivo(producto.id, producto.nombre)}
                                >
                                    Eliminar para siempre
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Papelera;
