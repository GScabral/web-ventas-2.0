import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { getProductos, paginado } from "../../redux/action";
import './home.css';
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth <= 1000);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (!isResponsive) setSidebarVisible(!sidebarVisible);
  };

  const agregarAlCarrito = (producto, precio) => {
    const nuevoProducto = { producto, precio };
    setProductosEnCarrito([...productosEnCarrito, nuevoProducto]);
  };

  const agregarFav = (producto, precio) => {
    const nuevoProducto = { producto, precio };
    setProductosEnFav([...productosEnFav, nuevoProducto]);
  };

  return (
    <div className="home-fondo">
      <div className={`main-content ${sidebarVisible ? 'sidebar-open' : ''}`}>
        <div className="Home-container">
          <Cards productos={allProductos} agregarAlCarrito={agregarAlCarrito} agregarFav={agregarFav} />
        </div>

        <div className="botones-paginado">
          <button
            className="arrow-paginado"
            onClick={() => currentPage > 1 && dispatch(paginado("prev"))}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
         <ul className="paginado">
  {Array.from({ length: totalPages }, (_, index) => (
    <li key={index}>
      <a
        href="#"
        className={currentPage === index + 1 ? 'active' : ''}
        onClick={(e) => {
          e.preventDefault();
          dispatch(paginado(index + 1));
        }}
      >
        {index + 1}
      </a>
    </li>
  ))}
</ul>
          <button
            className="arrow-paginado"
            onClick={() => currentPage < totalPages && dispatch(paginado("next"))}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>Sobre Nosotros</h3>
            <p>Somos una tienda dedicada a ofrecer ropa única y de alta calidad. Nuestro objetivo es combinar estilo y confort en cada producto.</p>
          </div>

          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Tienda</a></li>
              <li><a href="#">Ofertas</a></li>
              <li><a href="#">Contacto</a></li>
              <li><a href="#">Política de Privacidad</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Síguenos</h3>
            <div className="social-icons">
              <a href="#"><img src="/icons8-facebook-nuevo-48.png" alt="Facebook" /></a>
              <a 
                href="https://www.instagram.com/amore_mio.showroom?igsh=MW1lOHBoeTFleHRobg==" 
                target="_blank" 
                rel="noopener noreferrer">
                <img src="/instagram.png" alt="Instagram" />
              </a>
              <a
                href="https://wa.me/5493794155821?text=Hola%20quiero%20hacer%20una%20consulta"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="public/whatssap.png" alt="WhatsApp" />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Estamos en</h3>
            <a
              href="https://maps.app.goo.gl/qD8RgwyPKD6n3Ph86"
              target="_blank"
              rel="noopener noreferrer"
              className="location-link"
              >
            <p>Ontiveros 2010, W3402 Corrientes</p>
            <img src="/icons8-location-48.png" alt="Ubicación" />
            </a>
          </div>

          <div className="footer-section">
            <h3>Formas de pago</h3>
            <div className="payment-icons">
            <img src="/icons8-mercado-pago-48.png" alt="Mercado Pago" />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Amore Mio. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
