import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getProductos, getPedidos } from "../redux/action";

import "./BusquedaGlobal.css";

// Buscador tipo "Cmd+K": no depende de en qué pantalla del admin
// esté parado — busca en productos y pedidos ya cargados en el store,
// y si todavía no se cargó nada (ej. abriste el admin y fuiste
// directo a Banners), los pide la primera vez que se abre el buscador.
const BusquedaGlobal = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [abierto, setAbierto] = useState(false);
    const [query, setQuery] = useState("");

    const productos = useSelector(state => state.allProductosforFiltro) || [];
    const pedidos = useSelector(state => state.allPedidos) || [];

    useEffect(() => {
        const handleKeyDown = (e) => {
            const esAtajo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";

            if (esAtajo) {
                e.preventDefault();
                setAbierto(prev => !prev);
            }

            if (e.key === "Escape") {
                setAbierto(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (!abierto) return;

        if (!productos.length) dispatch(getProductos());
        if (!pedidos.length) dispatch(getPedidos());
    }, [abierto, dispatch]);

    const resultados = useMemo(() => {
        const termino = query.trim().toLowerCase();

        if (!termino) return { productos: [], pedidos: [] };

        const productosEncontrados = productos
            .filter(p => (p.nombre || "").toLowerCase().includes(termino))
            .slice(0, 6);

        const pedidosEncontrados = pedidos
            .filter(p =>
                String(p.id_pedido).includes(termino) ||
                (p.nombre || "").toLowerCase().includes(termino) ||
                (p.email_cliente || "").toLowerCase().includes(termino)
            )
            .slice(0, 6);

        return { productos: productosEncontrados, pedidos: pedidosEncontrados };
    }, [query, productos, pedidos]);

    const cerrar = () => {
        setAbierto(false);
        setQuery("");
    };

    const irAProducto = () => {
        navigate("/admin/lista");
        cerrar();
    };

    const irAPedido = () => {
        navigate("/admin/PedidosLista");
        cerrar();
    };

    if (!abierto) return null;

    const sinResultados = query.trim() &&
        resultados.productos.length === 0 &&
        resultados.pedidos.length === 0;

    return (
        <div className="busqueda-global-overlay" onClick={cerrar}>

            <div className="busqueda-global-caja" onClick={(e) => e.stopPropagation()}>

                <input
                    type="text"
                    autoFocus
                    placeholder="Buscar productos o pedidos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="busqueda-global-input"
                />

                <div className="busqueda-global-resultados">

                    {!query.trim() && (
                        <p className="busqueda-global-hint">
                            Escribí para buscar por nombre de producto,
                            o por cliente / email / número de pedido.
                        </p>
                    )}

                    {sinResultados && (
                        <p className="busqueda-global-hint">
                            No encontramos nada para "{query}".
                        </p>
                    )}

                    {resultados.productos.length > 0 && (
                        <div className="busqueda-global-grupo">
                            <span className="busqueda-global-grupo-titulo">Productos</span>
                            {resultados.productos.map((p) => (
                                <button
                                    key={`p-${p.id}`}
                                    className="busqueda-global-item"
                                    onClick={irAProducto}
                                >
                                    <span className="busqueda-global-item-icono">📦</span>
                                    <span>{p.nombre}</span>
                                    <span className="busqueda-global-item-extra">
                                        ${Number(p.precio).toLocaleString("es-AR")}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {resultados.pedidos.length > 0 && (
                        <div className="busqueda-global-grupo">
                            <span className="busqueda-global-grupo-titulo">Pedidos</span>
                            {resultados.pedidos.map((p) => (
                                <button
                                    key={`ped-${p.id_pedido}`}
                                    className="busqueda-global-item"
                                    onClick={irAPedido}
                                >
                                    <span className="busqueda-global-item-icono">🧾</span>
                                    <span>#{p.id_pedido} — {p.nombre || p.email_cliente}</span>
                                    <span className="busqueda-global-item-extra">
                                        {p.estado}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                </div>

                <div className="busqueda-global-footer">
                    <span><kbd>Esc</kbd> para cerrar</span>
                    <span><kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>K</kbd> para abrir</span>
                </div>

            </div>

        </div>
    );
};

export default BusquedaGlobal;
