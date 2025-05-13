import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ofertas } from "../../redux/action";
import { Modal, Button, Form } from "react-bootstrap";
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

    // Log the data being sent
    console.log("Enviando nueva oferta:", nuevaOferta);

    dispatch(ofertas(nuevaOferta))
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        console.error("Error al aplicar la oferta:", error);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} className="ofertas-modal">
      <Modal.Header closeButton className="ofertas-modal-header">
        <Modal.Title>Oferta para {product && product.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="ofertas-modal-body">
        <Form>
          <Form.Group controlId="ofertaPorcentaje">
            <Form.Label>Porcentaje de la oferta</Form.Label>
            <Form.Control
              type="number"
              value={oferta}
              onChange={handleOferta}
              placeholder="Ingrese el porcentaje de la oferta"
              className="ofertas-input"
            />
          </Form.Group>
          <Form.Group controlId="inicioOferta">
            <Form.Label>Fecha de inicio</Form.Label>
            <Form.Control
              type="date"
              value={inicio}
              onChange={handleInicioChange}
              className="ofertas-input"
            />
          </Form.Group>
          <Form.Group controlId="finOferta">
            <Form.Label>Fecha de fin</Form.Label>
            <Form.Control
              type="date"
              value={fin}
              onChange={handleFinChange}
              className="ofertas-input"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="ofertas-modal-footer">
        <Button variant="secondary" onClick={handleClose} className="ofertas-cancel-button">
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleOfertaSubmit} className="ofertas-submit-button">
          Aplicar Oferta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OfertasModal;
