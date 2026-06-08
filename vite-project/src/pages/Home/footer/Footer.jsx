import React from "react";
import "./Footer.css";

const Footer = () => (
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
          <a><img src="/icons8-facebook-nuevo-48.png" alt="Facebook" /></a>
          <img src="/instagram.png" alt="Instagram" />
          <img src="/whatssap.png" alt="Whatsapp" />
        </div>
      </div>
      <div>
        <h3>Ubicación</h3>
        <a
          href="https://maps.app.goo.gl/qD8RgwyPKD6n3Ph86"
          target="_blank"
          className="location-row"
        >
          <p>catamarca 1330,corrientes capital</p>
          <img src="/icons8-location-48.png" alt="Ubicación" />
        </a>
      </div>
      <div>
        <h3>Formas de pago</h3>
        <img src="/icons8-mercado-pago-48.png" alt="Mercado Pago" />
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2025 Amore Mio. Todos los derechos reservados.</p>
    </div>
  </footer>
);

export default Footer;
