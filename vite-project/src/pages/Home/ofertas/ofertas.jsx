import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cards from "../Cards/Cards";

import { getProductos, getOfertas, ofertas } from "../../../redux/action";
import "./ofertas.css";


const Ofertas = () => {
    const dispatch = useDispatch()
    const allProductosforFiltro = useSelector((state) => state.allProductosforFiltro)
    const ofertasActivas = useSelector((state) => state.ofertasActivas)


    useEffect(() => {
        dispatch(getProductos());
        dispatch(getOfertas());
    }, [dispatch])


    useEffect(() => {
        console.log("Ofertas activas:", ofertasActivas);
    }, [ofertasActivas, allProductosforFiltro]);

    const productosConOfertas = allProductosforFiltro.filter(producto => {
        const oferta = ofertasActivas.find(oferta => {
            const inicio = new Date(oferta.inicio);
            const fin = new Date(oferta.fin);
            const hoy = new Date();
            return oferta.producto_id === producto.id && hoy >= inicio && hoy <= fin;
        });
        return !!oferta;
    });

    console.log("Todos los productos:", allProductosforFiltro);
    console.log("Buscando producto con ID 21:", allProductosforFiltro.find(p => p.id === 21));





    return (
        <div>
            <h1>OFERTAS ACTUALES</h1>
            <div className="cards-container">
                {productosConOfertas.map(producto => {
                    const oferta = ofertasActivas.find(oferta => oferta.producto_id === producto.id);
                    const precioFinal = oferta ? producto.precio * (1 - oferta.descuento / 100) : producto.precio;
                    return (
                        <Cards
                            key={producto.id}
                            producto={producto}
                            precioFinal={precioFinal}
                            oferta={oferta ? oferta.descuento : null}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Ofertas;