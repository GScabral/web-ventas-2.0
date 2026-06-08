import React, { useMemo, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faPrint,
    faChevronDown,
    faChevronUp
} from "@fortawesome/free-solid-svg-icons";

import "./PedidoCard.css";

const PedidoCard = ({
    pedido,
    onEstadoChange
}) => {

    const [open, setOpen] = useState(false);

    const fechaBonita = useMemo(() => {

        if (!pedido?.fecha_pedido) return "";

        return new Date(
            pedido.fecha_pedido
        ).toLocaleString("es-AR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

    }, [pedido?.fecha_pedido]);

    return (

        <div className="pedido-card">

            <div className="pedido-top">

                <div>

                    <span className="pedido-id">
                        Pedido #{pedido.id_pedido}
                    </span>

                    <p className="pedido-email">
                        {pedido.email_cliente}
                    </p>

                    <p className="pedido-date">
                        {fechaBonita}
                    </p>

                </div>

                <div className="pedido-total">

                    $
                    {Number(
                        pedido.total_pedido || 0
                    ).toLocaleString("es-AR")}

                </div>

            </div>

            <div className="pedido-actions">

                <select
                    value={pedido.estado}
                    onChange={(e) =>
                        onEstadoChange(
                            pedido.id_pedido,
                            e.target.value
                        )
                    }
                >

                    <option value="pendiente">
                        Pendiente
                    </option>

                    <option value="pagado">
                        Pagado
                    </option>

                    <option value="preparando">
                        Preparando
                    </option>

                    <option value="enviado">
                        Enviado
                    </option>

                    <option value="entregado">
                        Entregado
                    </option>

                    <option value="cancelado">
                        Cancelado
                    </option>

                </select>

                <button
                    className="btn-ticket"
                    onClick={() =>
                        window.open(
                            `/admin/ticket/${pedido.id_pedido}`,
                            "_blank"
                        )
                    }
                >
                    <FontAwesomeIcon icon={faPrint} />
                    Ticket
                </button>

                <button
                    className="btn-details"
                    onClick={() =>
                        setOpen(!open)
                    }
                >
                    {open ? (
                        <FontAwesomeIcon
                            icon={faChevronUp}
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faChevronDown}
                        />
                    )}
                </button>

            </div>

            {open && (

                <div className="pedido-details">

                    {pedido.DetallesPedidos?.length ? (

                        pedido.DetallesPedidos.map(
                            (item) => (

                                <div
                                    key={
                                        item.id_detalle_pedido
                                    }
                                    className="detalle-item"
                                >

                                    <strong>
                                        {item.nombre}
                                    </strong>

                                    <div className="chips">

                                        <span>
                                            Cant: {item.cantidad}
                                        </span>

                                        {item.color && (
                                            <span>
                                                {item.color}
                                            </span>
                                        )}

                                        {item.talle && (
                                            <span>
                                                {item.talle}
                                            </span>
                                        )}

                                    </div>

                                    <div className="subtotal">

                                        $
                                        {Number(
                                            item.total || 0
                                        ).toLocaleString(
                                            "es-AR"
                                        )}

                                    </div>

                                </div>

                            )
                        )

                    ) : (

                        <p>
                            No hay productos en
                            este pedido.
                        </p>

                    )}

                </div>

            )}

        </div>

    );
};

export default PedidoCard;