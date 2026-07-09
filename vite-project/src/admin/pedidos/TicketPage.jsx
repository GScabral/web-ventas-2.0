import React, {
    useEffect,
    useState,
} from "react";

import {
    useParams
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    getPedidoById
} from "../../redux/action";

import { STORE_CONFIG } from "../../config/storeConfig";

import "./ticketPage.css";

const METODO_PAGO_LABEL = {
    mercadopago: "Mercado Pago",
    whatsapp: "Coordinado por WhatsApp",
};

const TicketPage = () => {

    const { id } = useParams();
    const dispatch = useDispatch();

    // Antes esta pantalla dependía de que state.allPedidos ya estuviera
    // cargado (por haber pasado antes por la lista de Pedidos). Como el
    // botón "Ticket" abre esta ruta en una pestaña nueva (window.open),
    // esa pestaña arranca con el store de Redux vacío, así que nunca
    // encontraba el pedido — el ticket no cargaba nunca. Ahora este
    // componente busca el pedido por su cuenta, por id, sin depender de
    // ninguna otra pantalla haya cargado antes.
    const [pedido, setPedido] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const configuracion = useSelector((state) => state.configuracion);
    const nombreTienda = configuracion?.nombre_tienda || STORE_CONFIG.name;

    useEffect(() => {

        let vigente = true;

        const cargarPedido = async () => {
            setCargando(true);
            setError(null);

            try {
                const data = await dispatch(getPedidoById(id));

                if (!vigente) return;

                setPedido(data);

            } catch (err) {

                if (!vigente) return;

                if (err?.response?.status === 401) {
                    setError("Tu sesión de admin venció. Volvé a iniciar sesión e intentá de nuevo.");
                } else if (err?.response?.status === 404) {
                    setError("No encontramos ese pedido.");
                } else {
                    setError("No pudimos cargar el ticket. Probá de nuevo en unos segundos.");
                }

            } finally {
                if (vigente) setCargando(false);
            }
        };

        cargarPedido();

        return () => {
            vigente = false;
        };

    }, [id, dispatch]);

    if (cargando) {

        return (
            <div className="ticket-error">
                Cargando ticket...
            </div>
        );

    }

    if (error || !pedido) {

        return (
            <div className="ticket-error">
                <h2>
                    {error || "Pedido no encontrado"}
                </h2>
            </div>
        );

    }

    const detalles = pedido.DetallesPedidos || [];

    const subtotalProductos = detalles.reduce(
        (acc, item) => acc + (item.total || 0),
        0
    );

    const fecha = pedido.fecha_pedido
        ? new Date(pedido.fecha_pedido).toLocaleString("es-AR")
        : "";

    const esEnvio = pedido.tipo_entrega === "ENVIO";

    const direccionCompleta = [
        pedido.direccion,
        pedido.ciudad,
        pedido.provincia,
    ].filter(Boolean).join(", ");

    return (

        <div className="ticket-page">

            <div className="ticket-container">

                <div className="ticket-header">

                    <h1>
                        {nombreTienda}
                    </h1>

                    <span>
                        Ticket de Compra
                    </span>

                </div>

                <div className="ticket-info">

                    <div>
                        <strong>Pedido:</strong>
                        <p>#{pedido.id_pedido}</p>
                    </div>

                    <div>
                        <strong>Fecha:</strong>
                        <p>{fecha}</p>
                    </div>

                    <div>
                        <strong>Estado:</strong>
                        <p className={`ticket-badge ${pedido.estado}`}>
                            {pedido.estado}
                        </p>
                    </div>

                    <div>
                        <strong>Método de pago:</strong>
                        <p>
                            {METODO_PAGO_LABEL[pedido.metodo_pago] || pedido.metodo_pago}
                        </p>
                    </div>

                </div>

                <div className="ticket-cliente">

                    <div>
                        <strong>Cliente:</strong>
                        <p>{pedido.nombre}</p>
                        <p className="ticket-cliente-secundario">{pedido.email_cliente}</p>
                        {pedido.telefono && (
                            <p className="ticket-cliente-secundario">{pedido.telefono}</p>
                        )}
                    </div>

                    <div>
                        <strong>
                            {esEnvio ? "Envío a domicilio:" : "Retiro en local"}
                        </strong>
                        {esEnvio && (
                            <p>{direccionCompleta || "Sin dirección cargada"}</p>
                        )}
                    </div>

                </div>

                <div className="ticket-products">

                    <div className="ticket-row ticket-head">
                        <span>Producto</span>
                        <span>Cant.</span>
                        <span>Total</span>
                    </div>

                    {detalles.length ? (
                        detalles.map(
                            item => (

                                <div
                                    key={item.id_detalle_pedido}
                                    className="ticket-row"
                                >

                                    <div>
                                        <strong>{item.nombre}</strong>
                                        <small>
                                            {item.color}
                                            {item.color && item.talle ? " - " : ""}
                                            {item.talle}
                                        </small>
                                    </div>

                                    <span>{item.cantidad}</span>

                                    <span>
                                        ${Number(item.total || 0).toLocaleString("es-AR")}
                                    </span>

                                </div>

                            )
                        )
                    ) : (
                        <div className="ticket-row">
                            <span>No hay productos cargados en este pedido.</span>
                        </div>
                    )}

                </div>

                <div className="ticket-totales">

                    <div className="ticket-subtotal-row">
                        <span>Subtotal productos</span>
                        <span>${subtotalProductos.toLocaleString("es-AR")}</span>
                    </div>

                    {pedido.descuento_cupon > 0 && (
                        <div className="ticket-subtotal-row">
                            <span>
                                Descuento {pedido.cupon_codigo ? `(${pedido.cupon_codigo})` : ""}
                            </span>
                            <span>-${Number(pedido.descuento_cupon).toLocaleString("es-AR")}</span>
                        </div>
                    )}

                    {pedido.costo_envio > 0 && (
                        <div className="ticket-subtotal-row">
                            <span>Envío</span>
                            <span>${Number(pedido.costo_envio).toLocaleString("es-AR")}</span>
                        </div>
                    )}

                    <div className="ticket-total">
                        <span>Total</span>
                        <strong>
                            ${Number(pedido.total_pedido || 0).toLocaleString("es-AR")}
                        </strong>
                    </div>

                </div>

                <div className="ticket-footer">
                    <p>Gracias por tu compra</p>
                    <p>Conserve este comprobante</p>
                </div>

                <button
                    className="print-btn"
                    onClick={() => window.print()}
                >
                    Imprimir Ticket
                </button>

            </div>

        </div>

    );
};

export default TicketPage;
