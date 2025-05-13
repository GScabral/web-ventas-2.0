import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cambios, getProductos, borrar, ofertas, paginado } from '../../redux/action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { Modal } from 'react-bootstrap';
import EditProductModal from './editar';
import OfertasModal from '../ofertas/ofertas';
import './listado.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const allProductos = useSelector((state) => state.allProductos);
  const currentPage = useSelector((state) => state.currentPage);
  const totalPages = useSelector((state) => state.totalPages);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showOfertaModal, setShowOfertaModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productIdToEdit, setProductIdToEdit] = useState(null);
  const [ofertaId, setOfertaId] = useState(false);

  useEffect(() => {
    dispatch(getProductos());
  }, [dispatch]);

  const handleEdit = (productId) => {
    const productToEdit = allProductos.find((producto) => producto.id === productId);
    setSelectedProduct(productToEdit);
    setShowEditModal(true);
    setProductIdToEdit(productId);
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Estás seguro que deseas eliminar este producto?')) {
      dispatch(borrar(productId));
    }
  };

  const handleOferta = (productId) => {
    const productToOferta = allProductos.find((producto) => producto.id === productId);
    setSelectedProduct(productToOferta);
    setShowOfertaModal(true);
    setOfertaId(productId);
  };

  const handleClose = () => {
    setShowEditModal(false);
  };

  const handleCloseOfertaModal = () => {
    setShowOfertaModal(false);
  };

  const handleSaveChanges = (editedProduct) => {
    dispatch(cambios(productIdToEdit, editedProduct));
    setShowEditModal(false);
  };

  const handleSaveChagensOferta = () => {
    dispatch(ofertas(ofertaId));
    setShowOfertaModal(false);
  };

  return (
    <div className="product-list-container">
      <h2>Listado de Productos</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Talles</th>
            <th>Colores</th>
            <th>Cantidad Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
          <tbody>
            {Array.isArray(allProductos) ? (
              allProductos.map((producto) => (
                <tr key={producto.id}>
                  <td data-label="ID">{producto.id}</td>
                  <td data-label="Nombre">{producto.nombre}</td>
                  <td data-label="Categoría">{producto.categoria}</td>
                  <td data-label="Precio">{producto.precio}</td>
                  <td data-label="Talles">
                    {producto.variantes.map((variante, index) => (
                      <div key={`${producto.id}-${index}-talla`}>{variante.talla}</div>
                    ))}
                  </td>
                  <td data-label="Colores">
                    {producto.variantes.map((variante, index) => (
                      <div key={`${producto.id}-${index}-color`}>{variante.color}</div>
                    ))}
                  </td>
                  <td data-label="Cantidad Disponible">
                    {producto.variantes.map((variante, index) => (
                      <div key={`${producto.id}-${index}-cantidad`}>{variante.cantidad_disponible}</div>
                    ))}
                  </td>
                  <td data-label="Acciones">
                    <button className="action-button" onClick={() => handleEdit(producto.id)}>Editar</button>
                    <button className="action-button" onClick={() => handleDelete(producto.id)}>Eliminar</button>
                    <button className="action-button" onClick={() => handleOferta(producto.id)}>Oferta</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Cargando productos...</td>
              </tr>
            )}
          </tbody>
      </table>

      <div className="botones-paginado-admin">
        <button
          className="arrow-paginado-admin"
          name="prev"
          onClick={() => currentPage > 1 && dispatch(paginado('prev'))}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div>
          <ul className="paginado-admin">
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index}>
                <a href="#">{index + 1}</a>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="arrow-paginado-admin"
          name="next"
          onClick={() => currentPage < totalPages && dispatch(paginado('next'))}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <Modal className="modal-dialog" show={showEditModal} onHide={handleClose}>
        <EditProductModal
          show={showEditModal}
          handleClose={handleClose}
          product={selectedProduct}
          handleSaveChanges={handleSaveChanges}
        />
      </Modal>
      <Modal className="modal-dialog" show={showOfertaModal} onHide={handleCloseOfertaModal}>
        <OfertasModal
          show={showOfertaModal}
          handleClose={handleCloseOfertaModal}
          product={selectedProduct}
          handleSaveChanges={handleSaveChagensOferta}
        />
      </Modal>
    </div>
  );
};

export default ProductList;
