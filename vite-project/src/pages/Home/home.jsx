import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { getProductos, paginado } from "../../redux/action";
import "./home.css";
import Nav from "./Nav/Nav";
import Cards from "./Cards/Cards";
import FiltrosSidebar from "./barralado/filtros";
import Carrito from "./carrito/carrito";
import Carousel from "./carrusel/carrusel";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const allProductos = useSelector((state) => state.allProductos);
  const currentPage = useSelector((state) => state.currentPage);
  const totalPages = useSelector((state) => state.totalPages);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [productosEnCarrito, setProductosEnCarrito] = useState([]);
  const [productosEnFav, setProductosEnFav] = useState([]);
  const [isResponsive, setIsResponsive] = useState(false);

  useEffect(() => {
    dispatch(getProductos());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const handleResize = () => setIsResponsive(window.innerWidth <= 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (!isResponsive) setSidebarVisible(!sidebarVisible);
  };

  const agregarAlCarrito = (producto, precio) => {
    setProductosEnCarrito([...productosEnCarrito, { producto, precio }]);
  };

  const agregarFav = (producto, precio) => {
    setProductosEnFav([...productosEnFav, { producto, precio }]);
  };

  return (
    <div className="home-fondo">

      {/* MAIN */}
      <div className={`main-content modern-container ${sidebarVisible ? "sidebar-open" : ""}`}>
        
        <div className="Home-container fade-in">
          <Cards
            productos={allProductos.filter(p => p.rama?.toLowerCase() === "ropa")}
            agregarAlCarrito={agregarAlCarrito}
            agregarFav={agregarFav}
          />
        </div>

        {/* PAGINADO */}
        <div className="paginado-wrapper">
          <button
            className="arrow-btn"
            onClick={() => currentPage > 1 && dispatch(paginado("prev"))}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <ul className="paginado-modern">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i}>
                <button
                  className={`page-pill ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => dispatch(paginado(i + 1))}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="arrow-btn"
            onClick={() => currentPage < totalPages && dispatch(paginado("next"))}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer-modern">

        <div className="footer-box">
          <div>
            <h3>Sobre Nosotros</h3>
            <p>
              Somos una tienda dedicada a ofrecer ropa única y de alta calidad.
              Buscamos combinar estilo y confort en cada producto.
            </p>
          </div>

          <div>
            <h3>Enlaces</h3>
            <ul>
              <li><a>Inicio</a></li>
              <li><a>Tienda</a></li>
              <li><a>Contacto</a></li>
            </ul>
          </div>

          <div>
            <h3>Síguenos</h3>
            <div className="social-row">
              <a><img src="/icons8-facebook-nuevo-48.png" /></a>
              <a href="https://www.instagram.com/amore_mio.showroom" target="_blank">
                <img src="/instagram.png" />
              </a>
              <a href="https://wa.me/5493794155821" target="_blank">
                <img src="public/whatssap.png" />
              </a>
            </div>
          </div>

          <div>
            <h3>Ubicación</h3>
            <a
              href="https://maps.app.goo.gl/qD8RgwyPKD6n3Ph86"
              target="_blank"
              className="location-row"
            >
              <p>Ontiveros 2010, Corrientes</p>
              <img src="/icons8-location-48.png" />
            </a>
          </div>

          <div>
            <h3>Formas de pago</h3>
            <img src="/icons8-mercado-pago-48.png" />
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Amore Mio. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
