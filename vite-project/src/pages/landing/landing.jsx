import React from "react";
import './landing.css'
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing-back">
      <div className="landing-container">
        <h1 className="landing-titulo">NOMBRE DE LA PAG</h1>
        <div className="button-info-container">
          <div className="button-info-wrapper">
            <Link to="/home">
              <button className="landing-button">MIRAR</button>
            </Link>
            <div className="info-landing"><h3>en caso de que solo desee mirar ingrese aquí</h3></div>
          </div>
          <span className="vertical-line"></span>
          <div className="button-info-wrapper">
            <Link>
              <button className="landing-button">INICIAR SESION</button>
            </Link>
            <div className="info-landing"><h3>si ya tiene una cuenta</h3></div>
          </div>
          <span className="vertical-line"></span>
          <div className="button-info-wrapper">
            <Link>
              <button className="landing-button">REGISTRAR</button>
            </Link>
            <div className="info-landing"><h3>si desea realizar una compra necesitará estar registrado</h3></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
