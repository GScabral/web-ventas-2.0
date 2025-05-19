import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { buscar, getProductos } from "../../../redux/action";
import Carousel from "../carrusel/carrusel";
import { useDispatch, useSelector } from "react-redux";
import FiltrosSidebar from "../barralado/filtros";
// import './Navresponsive.css'
import './Nav.css';




const Nav = ({ onSearch }) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.isLoggedIn)
    const cliente = useSelector((state) => state.cliente)
    const [searchText, setSearchText] = useState("");
     const [showCategories, setShowCategories] = useState(false);





    const handleSearch = (nombre) => {
        dispatch(buscar(nombre));

    };


    const handleClearSearch = () => {
        // Limpiar el texto del buscador y cargar todos los productos nuevamente
        setSearchText("");
        dispatch(getProductos());
    };

        const toggleCategories = () => {
        setShowCategories(!showCategories);
    };

    



    return (
        <div className="nav-container"> {/* <--- clase agregada para estilos globales de nav */}
            {/* Marquee */}
            <div className="marquee-container">
                <div className="marquee">
                    🚨 ¡30% OFF en toda la tienda! 🚨 ¡6 cuotas sin interés o 10% extra por transferencia bancaria! 🚨
                </div>
            </div>

            {/* Navbar */}
            <div className="back-nav">
                <div className="nav-menu">
                    <button className="menu-button">Categorías</button>
                    <div className="dropdown-menu">
                        <FiltrosSidebar />
                    </div>
                </div>
                <Link to="/">
                    <button className="superior">Inicio</button>
                </Link>
                <Link to="/Ofertas">
                    <button className="superior">%OFERTAS%</button>
                </Link>
                {window.location.pathname !== '/carrito' && (
                    <SearchBar
                        className="barra-buscar"
                        onSearch={handleSearch}
                        onClearSearch={handleClearSearch}
                        value={searchText}
                    />
                )}
                {window.location.pathname !== '/carrito' && (
                    <Link to="/carrito">
                        <button className="carrito-nav">
                            <FontAwesomeIcon icon={faShoppingCart} />
                            <span className="cart-counter"></span> {/* Contador del carrito */}
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Nav;


