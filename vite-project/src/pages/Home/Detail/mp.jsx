import React from "react";
import { Link } from "react-router-dom";
import "./vm.css"



const MetodoPago = () => {
 return (
        <div className="container-vm">
            <p className="vm-h1">
                Para realizar compras al por mayor, ofrecemos descuentos después de la compra de 3 productos de cualquier tipo.
            </p>
            <p className="vm-p">
                Para consultas, contáctanos a través de WhatsApp o Instagram:
            </p>
            <div className="social-links">
                <a href="https://www.instagram.com/amore_mio.showroom?igsh=MXBhdjRua3ltem44cQ==">
                    <img className="social-logo" src="\instagram.png" alt="Instagram" />
                </a>
                <a href="https://wa.me/message/CTLCYWOO7XTML1">
                    <img className="social-logo" src="\whatssap.png" alt="WhatsApp" />
                </a>
            </div>
            <Link to="/">
                <button className="vm-button">Volver</button>
            </Link>
            <footer className="contact-info">
                <p>
                    Encuéntranos en Ontiveros 1069 entre Gabriela Mistral y Gregorio de la Ferrere
                    <a href="https://maps.app.goo.gl/s6qNmbvebfZF7XLo9">
                        <img className="map-logo" src="\pngwing.com (9).png" alt="Google Maps" />
                    </a>
                </p>
            </footer>
        </div>
    );
};


export default MetodoPago;