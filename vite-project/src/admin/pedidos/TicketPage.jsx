import React, {
    useMemo
} from "react";

import {
    useParams
} from "react-router-dom";

import {
    useSelector
} from "react-redux";

import "./ticketPage.css";

const TicketPage = () => {

    const { id } = useParams();

    const pedidos = useSelector(
        state => state.allPedidos
    );

    const pedido = useMemo(() => {

        return pedidos?.find(
            p =>
                String(p.id_pedido) === String(id) ||
                String(p.id) === String(id)
        );

    }, [pedidos, id]);

    if (!pedido) {

        return (

            <div className="ticket-error">

                <h2>
                    Pedido no encontrado
                </h2>

            </div>

        );

    }

    const totalPedido =
        pedido.detalles.reduce(
            (acc, item) =>
                acc + (item.total || 0),
            0
        );

    const fecha = new Date(
        pedido.fecha
    ).toLocaleString("es-AR");

    return (

        <div className="ticket-page">

            <div className="ticket-container">

                <div className="ticket-header">

                    <h1>
                        MI TIENDA
                    </h1>

                    <span>
                        Ticket de Compra
                    </span>

                </div>

                <div className="ticket-info">

                    <div>

                        <strong>
                            Pedido:
                        </strong>

                        <p>
                            #{pedido.id}
                        </p>

                    </div>

                    <div>

                        <strong>
                            Fecha:
                        </strong>

                        <p>{fecha}</p>

                    </div>

                </div>

                <div className="ticket-products">

                    <div className="ticket-row ticket-head">

                        <span>
                            Producto
                        </span>

                        <span>
                            Cant.
                        </span>

                        <span>
                            Total
                        </span>

                    </div>

                    {pedido.detalles.map(
                        item => (

                            <div
                                key={
                                    item.id_detalle_pedido
                                }
                                className="ticket-row"
                            >

                                <div>

                                    <strong>
                                        {item.nombre}
                                    </strong>

                                    <small>
                                        {item.color}
                                        {" - "}
                                        {item.talle}
                                    </small>

                                </div>

                                <span>
                                    {item.cantidad}
                                </span>

                                <span>
                                    $
                                    {item.total?.toLocaleString(
                                        "es-AR"
                                    )}
                                </span>

                            </div>

                        )
                    )}

                </div>

                <div className="ticket-total">

                    <span>Total</span>

                    <strong>
                        $
                        {totalPedido.toLocaleString(
                            "es-AR"
                        )}
                    </strong>

                </div>

                <div className="ticket-footer">

                    <p>
                        Gracias por tu compra
                    </p>

                    <p>
                        Conserve este comprobante
                    </p>

                </div>

                <button
                    className="print-btn"
                    onClick={() =>
                        window.print()
                    }
                >
                    Imprimir Ticket
                </button>

            </div>

        </div>

    );
};

export default TicketPage;