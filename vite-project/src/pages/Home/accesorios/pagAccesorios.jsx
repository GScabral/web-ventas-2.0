import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cards from "../Cards/Cards";



const PagAccesorios = () => {

    const dispatch = useDispatch
    const allProductos = useSelector((state) => state.allProductos); 
    const [productosEnCarrito, setProductosEnCarrito] = useState([]);


    const agregarAlCarrito = (producto, precio) => {
        const nuevoProducto = { producto, precio };
        setProductosEnCarrito([...productosEnCarrito, nuevoProducto]);
    };



    return (
        <div className="Home-container">
            <Cards
                productos={allProductos.filter(
                    (producto) => producto.rama === "Accesorios"
                )}
                agregarAlCarrito={agregarAlCarrito}
            />
        </div>

    )
}



export default PagAccesorios;