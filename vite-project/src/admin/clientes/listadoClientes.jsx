import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllClientes } from "../../redux/action";
import styles from "./listadoCliente.module.css";

// Sección reactivada: antes vivía comentada por completo (sin ruta,
// sin ítem de menú) y era solo un listado sin buscador. Se reconstruyó
// con el mismo lenguaje visual del resto del panel (ver
// panelAdminDashboard.module.css / adminCommon.css) y se le agregó
// búsqueda por nombre, apellido o correo.
const ListadoClientes = () => {

    const dispatch = useDispatch();

    const allClientes = useSelector((state) => state.allClientes) || [];

    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        setCargando(true);
        dispatch(getAllClientes()).finally(() => setCargando(false));
    }, [dispatch]);

    const clientesFiltrados = useMemo(() => {
        const termino = busqueda.trim().toLowerCase();

        if (!termino) return allClientes;

        return allClientes.filter((cliente) => {
            const nombreCompleto = `${cliente.nombre || ""} ${cliente.apellido || ""}`.toLowerCase();
            const correo = (cliente.correo || "").toLowerCase();

            return (
                nombreCompleto.includes(termino) ||
                correo.includes(termino)
            );
        });
    }, [busqueda, allClientes]);

    return (
        <div>
            <div className="card-header">
                <h2>Clientes</h2>
                <p>{allClientes.length} cliente{allClientes.length === 1 ? "" : "s"} registrado{allClientes.length === 1 ? "" : "s"}</p>
            </div>

            <div className={styles.busquedaBox}>
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido o correo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={styles.busquedaInput}
                />
            </div>

            {cargando ? (
                <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Cargando clientes...
                </p>
            ) : clientesFiltrados.length === 0 ? (
                <div className="admin-empty-state">
                    {busqueda
                        ? `No encontramos ningún cliente para "${busqueda}".`
                        : "Todavía no hay clientes registrados."}
                </div>
            ) : (
                <div className={styles.tablaWrap}>
                    <table className={styles.clientesTable}>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Correo</th>
                                <th>Dirección</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientesFiltrados.map((cliente) => (
                                <tr key={cliente.id_cliente}>
                                    <td>{cliente.nombre || "—"}</td>
                                    <td>{cliente.apellido || "—"}</td>
                                    <td>{cliente.correo}</td>
                                    <td>{cliente.direccion || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ListadoClientes;
