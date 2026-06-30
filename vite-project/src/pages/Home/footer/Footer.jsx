import React from "react";
import { Link } from "react-router-dom";
import { STORE_CONFIG } from "../../../config/storeConfig";
import "./Footer.css";

const Footer = () => (
  <footer className="footer-shein">
    <div className="footer-box">

      <div>
        <h3>Sobre nosotros</h3>
        <p>
          {STORE_CONFIG.tagline}. Ropa cómoda y de calidad para el día a día.
        </p>
      </div>

      <div>
        <h3>Enlaces</h3>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/catalogo">Tienda</Link></li>
          <li><Link to="/carrito">Carrito</Link></li>
          <li><Link to="/DevolucionCambio">Cambios y devoluciones</Link></li>
        </ul>
      </div>

      <div>
        <h3>Síguenos</h3>
        <div className="social-row">
          <a
            href={STORE_CONFIG.facebook || "#"}
            title={STORE_CONFIG.facebook ? "Facebook" : "Próximamente"}
          >
            <img src="/icons8-facebook-nuevo-48.png" alt="Facebook" />
          </a>
          <a
            href={STORE_CONFIG.instagram || "#"}
            title={STORE_CONFIG.instagram ? "Instagram" : "Próximamente"}
          >
            <img src="/instagram.png" alt="Instagram" />
          </a>
          <a
            href={STORE_CONFIG.whatsapp ? `https://wa.me/${STORE_CONFIG.whatsapp}` : "#"}
            title={STORE_CONFIG.whatsapp ? "WhatsApp" : "Próximamente"}
          >
            <img src="/whatssap.png" alt="Whatsapp" />
          </a>
        </div>
      </div>

      <div>
        <h3>Ubicación</h3>
        <a
          href={STORE_CONFIG.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="location-row"
        >
          <p>{STORE_CONFIG.address}</p>
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
        © {new Date().getFullYear()} {STORE_CONFIG.name}. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
