import React from "react";
import "./devolucion.css";

const DevolucionCambio = () => {
  return (
    <div className="cambio-container">
      <h1 className="cambio-titulo">Política de Cambio y Devolución</h1>
      <p className="cambio-texto">
        Aceptamos cambios y devoluciones exclusivamente cuando la compra se
        realiza mediante la opción de envío. Los cambios se efectúan por motivos
        de talla o modelo, debiendo el comprador asumir los costos del nuevo
        envío. Por otro lado, las devoluciones se aceptan únicamente por defectos
        en las prendas.
      </p>
      <p className="cambio-texto">
        Tanto los cambios como las devoluciones deben solicitarse dentro de las
        24 horas posteriores a la compra. En caso de cambio, se requiere
        seleccionar una prenda de igual valor o superior; no se permiten cambios
        por prendas de valor inferior.
      </p>
      <p className="cambio-texto">
        ¿Tienes alguna duda? No dudes en escribirnos por{" "} 
        <a
          href="https://wa.me/1234567890" /* Reemplaza con tu enlace de WhatsApp */
          className="cambio-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </p>
    </div>
  );
};

export default DevolucionCambio;
