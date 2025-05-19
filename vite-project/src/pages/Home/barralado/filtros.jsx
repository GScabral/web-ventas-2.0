import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterProduc, orderProducto } from "../../../redux/action";
import { categoria } from "./categorias";
import { Link } from "react-router-dom";

const FiltrosSidebar = () => {
    const [mostrarF, setMostrarF] = useState(false);
    const [mostrarO, setMostrarO] = useState(false);
    const [precio, setPrecio] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedPriceOrder, setSelectedPriceOrder] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

    const allProductos = useSelector((state) => state.allProductos);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 800);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleFiltros = () => {
        setMostrarF(!mostrarF);
    };

    const toggleOrden = () => {
        setMostrarO(!mostrarO);
    };

    const handleFilter = (category) => {
        if (selectedCategory === category) {
            setSelectedCategory("");
            dispatch(filterProduc({ categoria: "", subcategoria: "", allProductos }));
        } else {
            setSelectedCategory(category);
            dispatch(filterProduc({ categoria: category, subcategoria: "", allProductos }));
        }
    };

    const handleOrder = (orderType) => {
        if (orderType === selectedPriceOrder) {
            unselectOrder();
        } else {
            setSelectedPriceOrder(orderType);
            dispatch(orderProducto(orderType));
        }
    };

    const unselectOrder = () => {
        setSelectedPriceOrder("");
        dispatch(orderProducto(""));
    };

    return (
        <div className={`sidebar ${isMobile ? "mobile-sidebar" : ""}`}>
            <button className="button-filtros" onClick={toggleFiltros}>
                FILTRAR POR:
            </button>
            {mostrarF && (
                <ul className="ul-filtros">
                    {Object.keys(categoria).map((categoriaPrincipal) => (
                        <li key={categoriaPrincipal}>
                            <button
                                className={selectedCategory === categoriaPrincipal ? "button-selected" : "button-talles"}
                                onClick={() => handleFilter(categoriaPrincipal)}
                            >
                                {categoriaPrincipal}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <hr className="divider" />

            <button className="button-filtros" onClick={toggleOrden}>
                ORDENAR POR:
            </button>
            {mostrarO && (
                <ul className="ul-filtros">
                    <button className="button-filtros" onClick={() => setPrecio(!precio)}>
                        Precio
                    </button>
                    {precio && (
                        <div>
                            <button
                                className={selectedPriceOrder === "precioAsc" ? "button-selected" : "button-talles"}
                                onClick={() => handleOrder("precioAsc")}
                            >
                                Menor a Mayor
                            </button>
                            <button
                                className={selectedPriceOrder === "precioDesc" ? "button-selected" : "button-talles"}
                                onClick={() => handleOrder("precioDesc")}
                            >
                                Mayor a Menor
                            </button>
                        </div>
                    )}
                </ul>
            )}

            {isMobile && (
                <div className="links-container">
                    <Link to="/"><button className="superior-barra">Inicio</button></Link>
                    <Link to="/DevolucionCambio"><button className="superior-barra">Cambio/Devolución</button></Link>
                    <Link to="/comoPagar"><button className="superior-barra">Venta por mayor</button></Link>
                </div>
            )}
        </div>
    );
};

export default FiltrosSidebar;
