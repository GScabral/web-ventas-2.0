import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { getProductos, paginado } from "../../redux/action";
import './home.css'
// import './homeresponsive.css'
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
  const [productosEnCarrito, setProductosEnCarrito] = useState([]); // Estado para almacenar los productos del carrito
  const [productosEnFav, setProductosEnFav] = useState([]);
  const [isResponsive, setIsResponsive] = useState(false);


  useEffect(() => {
    dispatch(getProductos());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth <= 1000); // Ajusta el valor según el ancho de tu breakpoint
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    if (!isResponsive) {
      setSidebarVisible(!sidebarVisible);
    }
  };

  const agregarAlCarrito = (producto, precio) => {
    // Lógica para agregar producto al carrito
    const nuevoProducto = {
      producto: producto,
      precio: precio
    };
    setProductosEnCarrito([...productosEnCarrito, nuevoProducto]);
  };

  const agregarFav = (producto, precio) => {
    // Lógica para agregar producto al carrito
    const nuevoProducto = {
      producto: producto,
      precio: precio
    };
    setProductosEnFav([...productosEnFav, nuevoProducto]);
  };

  return (
    <div className="home-fondo">
      {/* <button className={`toggle-sidebar ${isResponsive ? 'responsive' : ''}`} onClick={toggleSidebar}>
        <FontAwesomeIcon icon={sidebarVisible ? faBars : faBars} />
      </button> */}

      <div className={`main-content ${sidebarVisible ? 'sidebar-open' : ''}`}>
        <div className="Home-container">
          <Cards productos={allProductos} agregarAlCarrito={agregarAlCarrito} agregarFav={agregarFav} />
        </div>

        <div className="botones-paginado">
          <button
            className="arrow-paginado"
            name="prev"
            onClick={() => currentPage > 1 && dispatch(paginado("prev"))}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <ul className="paginado">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}><a href="#">{index + 1}</a></li>
              ))}
            </ul>
          </div>
          <button
            className="arrow-paginado"
            name="next"
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
              <a href="#"><img src="/instagram.png" alt="Instagram" /></a>
              <a href="#"><img src="/icons8-x-50.png" alt="Twitter" /></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Estamos en</h3>
            <p>Narnia al 5500.</p>
            <div className="payment-methods">
              <img src="/icons8-location-48.png" alt="Visa" />
             
            </div>
          </div>

          <div className="footer-section">
            <h3>Formas de pago</h3>
            <div className="payment-methods">
              <img src="/icons8-visa-48.png" alt="Visa" />
              <img src="/icons8-mastercard-48.png" alt="Mastercard" />
              <img src="/icons8-mercado-pago-48.png" alt="Mercado Pago" />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Tienda de Ropa. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
