import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getOfertas,
    borrarOferta
} from "../../redux/action";

import "./listadoOferta.css";

const OfertasLista = () => {

    const dispatch = useDispatch();

    const ofertas = useSelector(
        state => state.ofertasActivas
    );

    useEffect(() => {
        dispatch(getOfertas());
    }, [dispatch]);

    const handleDeleteOferta = (
        idOferta
    ) => {

        const confirmDelete =
            window.confirm(
                "¿Eliminar esta oferta?"
            );

        if (!confirmDelete) return;

        dispatch(
            borrarOferta(idOferta)
        );
    };

    const isActiva = (fechaFin) => {
        return (
            new Date(fechaFin) >
            new Date()
        );
    };

    return (

        <div className="offers-page">

            <div className="offers-header">

                <div>

                    <h1>
                        Ofertas Activas
                    </h1>

                    <p>
                        Gestiona descuentos y promociones
                    </p>

                </div>

                <div className="offers-counter">

                    {ofertas?.length || 0}

                </div>

            </div>

            <div className="offers-grid">

                {ofertas?.map(oferta => (

                    <div
                        key={oferta.id_oferta}
                        className="offer-card"
                    >

                        <div className="offer-badge">

                            {oferta.descuento}% OFF

                        </div>

                        <div className="offer-content">

                            <h3>
                                Producto #{oferta.producto_id}
                            </h3>

                            <div className="offer-info">

                                <span>
                                    📅 Inicio
                                </span>

                                <strong>
                                    {oferta.inicio}
                                </strong>

                            </div>

                            <div className="offer-info">

                                <span>
                                    ⏳ Fin
                                </span>

                                <strong>
                                    {oferta.fin}
                                </strong>

                            </div>

                            <div
                                className={
                                    isActiva(oferta.fin)
                                        ? "status active"
                                        : "status expired"
                                }
                            >

                                {isActiva(oferta.fin)
                                    ? "Activa"
                                    : "Finalizada"}

                            </div>

                        </div>

                        <button
                            className="delete-offer-btn"
                            onClick={() =>
                                handleDeleteOferta(
                                    oferta.id_oferta
                                )
                            }
                        >
                            Eliminar
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default OfertasLista;