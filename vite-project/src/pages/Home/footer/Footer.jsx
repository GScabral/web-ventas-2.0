import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <div>
    <footer className="footer-modern">
      <div className="footer-box">

        <div>
          <h3>Sobre nosotros</h3>
          <p>
            Somos una tienda dedicada a ofrecer ropa única y de alta calidad.
            Buscamos combinar estilo y confort en cada producto.
          </p>
        </div>

        <div>
          <h3>Enlaces</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo">Tienda</Link></li>
            <li><Link to="/carrito">Carrito</Link></li>
          </ul>
        </div>

        <div>
          <h3>Síguenos</h3>
          <div className="social-row">
            <a href="#" title="Próximamente">
              <img src="/icons8-facebook-nuevo-48.png" alt="Facebook" />
            </a>
            <a href="#" title="Próximamente">
              <img src="/instagram.png" alt="Instagram" />
            </a>
            <a href="#" title="Próximamente">
              <img src="/whatssap.png" alt="Whatsapp" />
            </a>
          </div>
        </div>

        <div>
          <h3>Ubicación</h3>
          <a
            href="https://maps.app.goo.gl/qD8RgwyPKD6n3Ph86"
            target="_blank"
            rel="noopener noreferrer"
            className="location-row"
          >
            <p>Catamarca 1330, Corrientes Capital</p>
            <img src="/icons8-location-48.png" alt="Ubicación" />
          </a>
        </div>

        <div>
          <h3>Formas de pago</h3>
          <div className="payment-row">
            <img src="/icons8-mercado-pago-48.png" alt="Mercado Pago" />
            <img src="/icons8-visa-48.png" alt="Visa" />
            <img src="/icons8-mastercard-48.png" alt="Mastercard" />
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Amore Mio. Todos los derechos reservados.
        </p>
      </div>
    </footer >
  </div >
);

export default Footer;