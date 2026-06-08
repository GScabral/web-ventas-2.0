import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cards from "../Cards/Cards";
import Footer from "../footer/Footer";



const PagMaquillaje = () => {

    const dispatch = useDispatch
    const allProductos = useSelector((state) => state.allProductosforFiltro);
    const [productosEnCarrito, setProductosEnCarrito] = useState([]);


    const agregarAlCarrito = (producto, precio) => {
        const nuevoProducto = { producto, precio };
        setProductosEnCarrito([...productosEnCarrito, nuevoProducto]);
    };



    return (
        <>
            <div className="Home-container">
                <Cards
                    productos={allProductos.filter(
                        (producto) => producto.rama === "Maquillaje"
                    )}
                    agregarAlCarrito={agregarAlCarrito}
                />
            </div>
            <Footer />
        </>
    )
}



export default PagMaquillaje;