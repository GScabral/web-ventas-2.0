import React, { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { buscar, getProductos } from "../../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import FiltrosSidebar from "../barralado/filtros";
import './Nav.css';

const Nav = () => {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const [showCategories, setShowCategories] = useState(false);

    const handleSearch = (nombre) => {
        dispatch(buscar(nombre));
    };

    const handleClearSearch = () => {
        setSearchText("");
        dispatch(getProductos());
    };

    const toggleCategories = () => {
        setShowCategories(!showCategories);
    };

    const isCarritoPage = window.location.pathname === '/carrito';

    return (
        <div className="nav-container">
            {/* Marquee */}
            <div className="marquee-container">
                <div className="marquee">
                   AMORE MIO
                </div>
            </div>

            {/* Navbar */}
            <div className="back-nav">
                <div className="nav-menu">
                    <Link to="/">
                        <button className="superior">Inicio</button>
                    </Link>
                </div>

                <div className="nav-menu">
                    <button className="menu-button" onClick={toggleCategories}>Categorías</button>
                    <div className={`dropdown-menu ${showCategories ? 'show' : ''}`}>
                      <FiltrosSidebar />
                    </div>
                </div>

                {!isCarritoPage && (
                    <SearchBar
                        className="barra-buscar"
                        onSearch={handleSearch}
                        onClearSearch={handleClearSearch}
                        value={searchText}
                    />
                )}

                {!isCarritoPage && (
                    <Link to="/carrito">
                        <button className="carrito-nav">
                            <FontAwesomeIcon icon={faShoppingCart} />
                            <span className="cart-counter"></span>
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Nav;
