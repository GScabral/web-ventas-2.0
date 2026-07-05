import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buscar, getProductos, getCategorias } from "../../../redux/action";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { STORE_CONFIG } from "../../../config/storeConfig";
import "./Nav.css";

const Nav = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const carrito = useSelector((state) => state.carrito);
  const categorias = useSelector((state) => state.categorias) || [];
  const configuracion = useSelector((state) => state.configuracion);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  // Mientras no cargó la configuración de Personalización (o si el
  // admin dejó el campo vacío), usamos el valor por defecto del
  // archivo estático, para no mostrar "undefined" ni nada vacío.
  const nombreTienda = configuracion?.nombre_tienda || STORE_CONFIG.name;
  const logoUrl = configuracion?.logo_url;

  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const navRef = useRef(null);

  // El Nav está montado en casi toda la navegación pública (a diferencia
  // del sidebar de filtros, que solo vive en la home); por eso dispara su
  // propia carga de categorías en vez de depender de que otro componente
  // ya las haya pedido.
  useEffect(() => {
    dispatch(getCategorias());
  }, [dispatch]);

  // Animación de "bump" cuando se agrega algo al carrito.
  useEffect(() => {
    if (carrito && carrito.length > 0) {
      setCartBump(true);
      const timer = setTimeout(() => setCartBump(false), 400);
      return () => clearTimeout(timer);
    }
  }, [carrito]);

  // Sombra al hacer scroll.
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 10) {
          navRef.current.classList.add("nav-scrolled");
        } else {
          navRef.current.classList.remove("nav-scrolled");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Si el menú mobile queda abierto y la ruta cambia, lo cerramos.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();

    if (!term) return;

    if (location.pathname !== "/") {
      navigate("/");
    }

    dispatch(buscar(term));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(getProductos());
  };

  return (
    <nav className="nav-shein" ref={navRef}>

      <div className="nav-top">

        <button
          type="button"
          className="nav-burger"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <Link to="/" className="nav-logo">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={nombreTienda}
              className="nav-logo-img"
            />
          )}
          {nombreTienda}
        </Link>

        <form className="nav-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
          />

          {searchTerm && (
            <button
              type="button"
              className="nav-search-clear"
              onClick={handleClearSearch}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}

          <button type="submit" className="nav-search-btn" aria-label="Buscar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        <Link
          to={isLoggedIn ? "/mi-cuenta" : "/iniciar-sesion"}
          className="nav-cart"
          aria-label={isLoggedIn ? "Mi cuenta" : "Iniciar sesión"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Link>

        {location.pathname !== "/carrito" && (
          <Link to="/carrito" className={`nav-cart${cartBump ? " bump" : ""}`} aria-label="Ver carrito">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {carrito && carrito.length > 0 && (
              <span className="nav-cart-badge">{carrito.length}</span>
            )}
          </Link>
        )}

      </div>

      {categorias.length > 0 && (
        <div className="nav-categories">
          {categorias.slice(0, 12).map((cat) => (
            <Link
              key={cat.id_categoria}
              to={`/?categoria=${encodeURIComponent(cat.nombre)}`}
              className="nav-category-chip"
            >
              {cat.nombre}
            </Link>
          ))}
        </div>
      )}

      {menuOpen && (
        <div className="nav-mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <aside className={`nav-mobile-menu ${menuOpen ? "open" : ""}`} role="navigation" aria-label="Menú principal">

        <Link to="/" className="nav-mobile-link">
          Inicio
        </Link>

        <Link to="/catalogo" className="nav-mobile-link">
          Catálogo
        </Link>

        <Link to={isLoggedIn ? "/mi-cuenta" : "/iniciar-sesion"} className="nav-mobile-link">
          {isLoggedIn ? "Mi cuenta" : "Iniciar sesión"}
        </Link>

        {categorias.length > 0 && (
          <>
            <p className="nav-mobile-section-title">Categorías</p>

            {categorias.map((cat) => (
              <Link
                key={cat.id_categoria}
                to={`/?categoria=${encodeURIComponent(cat.nombre)}`}
                className="nav-mobile-link nav-mobile-link-sub"
              >
                {cat.nombre}
              </Link>
            ))}
          </>
        )}

      </aside>

    </nav>
  );
};

export default Nav;
