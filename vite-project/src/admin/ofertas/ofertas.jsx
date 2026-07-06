import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ofertas } from "../../redux/action";
import "./ofertas.css";

const OfertasModal = ({ product, show, handleClose }) => {
  const dispatch = useDispatch();
  const [oferta, setOferta] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");

  const handleOferta = (e) => {
    setOferta(e.target.value);
  };

  const handleInicioChange = (e) => {
    setInicio(e.target.value);
  };

  const handleFinChange = (e) => {
    setFin(e.target.value);
  };

  useEffect(() => {
    if (product) {
      setOferta(product.oferta || ""); // Si el producto tiene una oferta existente, establezca ese valor
      setInicio(""); // Resetea la fecha de inicio
      setFin(""); // Resetea la fecha de fin
    }
  }, [product]);

  const handleOfertaSubmit = () => {
    const nuevaOferta = {
      producto_id: product.id,
      descuento: Number(oferta),
      inicio: inicio,
      fin: fin,
    };

    dispatch(ofertas(nuevaOferta))
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        console.error("Error al aplicar la oferta:", error);
      });
  };

  if (!show) return null;

  return (
    <div className="custom-modal-overlay" onClick={handleClose}>
      <div
        className="custom-modal ofertas-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-modal-header ofertas-modal-header">
          <h2>Oferta para {product && product.nombre}</h2>

          <button
            type="button"
            className="custom-modal-close"
            onClick={handleClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="custom-modal-body ofertas-modal-body">
          <div className="form-group">
            <label htmlFor="ofertaPorcentaje">Porcentaje de la oferta</label>
            <input
              id="ofertaPorcentaje"
              type="number"
              value={oferta}
              onChange={handleOferta}
              placeholder="Ingrese el porcentaje de la oferta"
              className="ofertas-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="inicioOferta">Fecha de inicio</label>
            <input
              id="inicioOferta"
              type="date"
              value={inicio}
              onChange={handleInicioChange}
              className="ofertas-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="finOferta">Fecha de fin</label>
            <input
              id="finOferta"
              type="date"
              value={fin}
              onChange={handleFinChange}
              className="ofertas-input"
            />
          </div>
        </div>

        <div className="custom-modal-footer ofertas-modal-footer">
          <button
            type="button"
            className="btn-cancel ofertas-cancel-button"
            onClick={handleClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-save ofertas-submit-button"
            onClick={handleOfertaSubmit}
          >
            Aplicar Oferta
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfertasModal;