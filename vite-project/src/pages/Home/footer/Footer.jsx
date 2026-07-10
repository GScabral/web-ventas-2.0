import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { STORE_CONFIG } from "../../../config/storeConfig";
import "./Footer.css";

// Mismo criterio que en Nav: si Personalización todavía no cargó, o
// el admin dejó un campo vacío, se usa el valor por defecto del
// archivo estático en vez de mostrar algo vacío o roto.
const Footer = () => {

  const configuracion = useSelector(state => state.configuracion);

  const nombreTienda = configuracion?.nombre_tienda || STORE_CONFIG.name;
  const tagline = configuracion?.tagline || STORE_CONFIG.tagline;
  const whatsapp = configuracion?.whatsapp || STORE_CONFIG.whatsapp;
  const instagram = configuracion?.instagram || STORE_CONFIG.instagram;
  const facebook = configuracion?.facebook || STORE_CONFIG.facebook;
  const direccion = configuracion?.direccion || STORE_CONFIG.address;
  const mapsUrl = configuracion?.maps_url || STORE_CONFIG.mapsUrl;

  return (
    <footer className="footer-shein">
      <div className="footer-box">

        <div>
          <h3>Sobre nosotros</h3>
          <p>
            {tagline}. Ropa cómoda y de calidad para el día a día.
          </p>
        </div>

        <div>
          <h3>Enlaces</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo">Tienda</Link></li>
            <li><Link to="/carrito">Carrito</Link></li>
            <li><Link to="/DevolucionCambio">Cambios y devoluciones</Link></li>
            <li><Link to="/terminos-y-condiciones">Términos y Condiciones</Link></li>
            <li><Link to="/politica-de-privacidad">Política de Privacidad</Link></li>
          </ul>
        </div>

        <div>
          <h3>Síguenos</h3>
          <div className="social-row">
            <a
              href={facebook || "#"}
              title={facebook ? "Facebook" : "Próximamente"}
            >
              <img src="/icons8-facebook-nuevo-48.png" alt="Facebook" />
            </a>
            <a
              href={instagram || "#"}
              title={instagram ? "Instagram" : "Próximamente"}
            >
              <img src="/instagram.png" alt="Instagram" />
            </a>
            <a
              href={whatsapp ? `https://wa.me/${whatsapp}` : "#"}
              title={whatsapp ? "WhatsApp" : "Próximamente"}
            >
              <img src="/whatssap.png" alt="Whatsapp" />
            </a>
          </div>
        </div>

        <div>
          <h3>Ubicación</h3>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="location-row"
          >
            <p>{direccion}</p>
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
          © {new Date().getFullYear()} {nombreTienda}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
