import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductos, buscar } from "../../../redux/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import FiltrosSidebar from "../barralado/filtros";
import "./Nav.css"

const Nav = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const carrito = useSelector((state) => state.carrito);

  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const navRef = useRef(null);

  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPriceOrder, setSelectedPriceOrder] = useState("");


  // Animación bump en carrito
  useEffect(() => {
    if (carrito && carrito.length > 0) {
      setCartBump(true);
      const timer = setTimeout(() => setCartBump(false), 400);
      return () => clearTimeout(timer);
    }
  }, [carrito]);

  // Blur y sombra al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 10) {
          navRef.current.classList.add("nav-blur");
        } else {
          navRef.current.classList.remove("nav-blur");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Overlay para menú lateral
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    setOverlay(!menuOpen ? true : false);
  };
  const handleOverlayClick = () => {
    setMenuOpen(false);
    setOverlay(false);
  };

  // Links con animación y activo
  const navLinks = [
    { to: "/", label: "Ropa" },
    { to: "/Accesorios", label: "Accesorios" },
    { to: "/Maquillaje", label: "Maquillaje" }
  ];

  return (
    <nav className="nav-boutique" ref={navRef}>
      {/* Overlay para menú lateral */}
      {overlay && <div className="nav-overlay" onClick={handleOverlayClick}></div>}
      <div className="nav-inner">
        {/* BURGER */}
        {/* <button className="nav-burger" onClick={handleMenuToggle} aria-label="Abrir menú">
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button> */}
        {/* LOGO animado */}
        <h1 className="nav-logo nav-logo-animated">
          <span className="nav-logo-gradient">nombre</span> <span className="nav-logo-light">tienda</span>
        </h1>
        {/* CART */}
        {window.location.pathname !== "/carrito" && (
          <Link to="/carrito">
            <button className={`nav-cart${cartBump ? " bump" : ""}`} aria-label="Ver carrito">
              <FontAwesomeIcon icon={faShoppingCart} />
              {carrito && carrito.length > 0 && (
                <span className="nav-cart-badge">{carrito.length}</span>
              )}
            </button>
          </Link>
        )}
      </div>
      {/* MENÚ LATERAL SLIDE-IN */}
      <aside className={`nav-menu nav-menu-slide ${menuOpen ? "show" : ""}`} role="navigation" aria-label="Menú principal">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link nav-link-animated${location.pathname === link.to ? " active" : ""}`}
            onClick={handleMenuToggle}
          >
            {link.label}
          </Link>
        ))}
        <button
          className="nav-link dropdown-btn"
          onClick={() => setShowCategories(!showCategories)}
        >
          {showCategories ? "Cerrar filtros ▲" : "Filtros ▼"}
        </button>
        {/* NUEVO DROPDOWN ANIMADO */}
        <div className={`dropdown-card ${showCategories ? "open" : ""}`}>
          <FiltrosSidebar
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedPriceOrder={selectedPriceOrder}
            setSelectedPriceOrder={setSelectedPriceOrder}
          />
        </div>
      </aside>
    </nav>
  );
};

export default Nav;