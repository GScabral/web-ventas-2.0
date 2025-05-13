import React from 'react';
import { useNavigate } from 'react-router-dom';
import './barraAdmin.css';

const BarraAdmin = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="titulo-sidebar">Mi Tienda</h2>
      <button className="boton-sidebar" onClick={() => navigate('/admin/new')}>Añadir producto</button>
      <button className="boton-sidebar" onClick={() => navigate('/admin/lista')}>inventario</button>
      <button className="boton-sidebar" onClick={() => navigate('/admin/PedidosLista')}>pedidos</button>
      <button className="boton-sidebar" onClick={() => navigate('/admin/ofertas')}>ofertas</button>
    </div>
  );
};

export default BarraAdmin;
