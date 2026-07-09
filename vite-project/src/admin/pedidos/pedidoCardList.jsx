import React, { useMemo, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faPrint,
    faChevronDown,
    faChevronUp
} from "@fortawesome/free-solid-svg-icons";

import "./PedidoCard.css";

const METODOS_PAGO = [
    { value: "efectivo", label: "💵 Efectivo" },
    { value: "transferencia", label: "🏦 Transferencia" },
    { value: "tarjeta_debito", label: "💳 Tarjeta débito" },
    { value: "tarjeta_credito", label: "💳 Tarjeta crédito" },
    { value: "mercado_pago", label: "📱 Mercado Pago" },
    { value: "otro", label: "Otro" },
];

const PedidoCard = ({
    pedido,
    onEstadoChange,
    onMarcarEntregado,
}) => {

    const [open, setOpen] = useState(false);

    // Cuando eligen "Entregado" en el <select>, no se dispara el
    // cambio de estado al toque: primero se pregunta el método de
    // pago, así se puede generar el ingreso en Caja en el mismo paso
    // (o el admin puede cancelar y no pasa nada).
    const [pidiendoMetodoPago, setPidiendoMetodoPago] = useState(false);

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

                    <span
                        className={
                            pedido.metodo_pago === "mercadopago"
                                ? "badge-metodo-pago badge-mp"
                                : "badge-metodo-pago badge-whatsapp"
                        }
                    >
                        {pedido.metodo_pago === "mercadopago"
                            ? "💳 Mercado Pago"
                            : "💬 WhatsApp"}
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
                    onChange={(e) => {
                        if (e.target.value === "entregado" && !pedido.registrado_en_caja) {
                            setPidiendoMetodoPago(true);
                        } else {
                            onEstadoChange(
                                pedido.id_pedido,
                                e.target.value
                            );
                        }
                    }}
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

                {pidiendoMetodoPago && (
                    <div className="metodo-pago-picker">

                        <span className="metodo-pago-picker-label">
                            ¿Cómo pagó? (se registra en Caja)
                        </span>

                        <div className="metodo-pago-picker-opciones">
                            {METODOS_PAGO.map((m) => (
                                <button
                                    key={m.value}
                                    type="button"
                                    onClick={() => {
                                        onMarcarEntregado(pedido.id_pedido, m.value);
                                        setPidiendoMetodoPago(false);
                                    }}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="metodo-pago-picker-cancelar"
                            onClick={() => setPidiendoMetodoPago(false)}
                        >
                            Cancelar
                        </button>

                    </div>
                )}

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

                    {pedido.metodo_pago === "mercadopago" && pedido.mp_payment_id && (
                        <p className="pedido-mp-id">
                            ID de pago en Mercado Pago: {pedido.mp_payment_id}
                        </p>
                    )}

                </div>

            )}

        </div>

    );
};

export default PedidoCard;