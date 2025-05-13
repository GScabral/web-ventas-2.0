import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './editar.css';

const EditProductModal = ({ show, handleClose, product, handleSaveChanges }) => {
  const [editedProduct, setEditedProduct] = useState(product);

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const handleVariantInputChange = (e, index, field) => {
    const { value } = e.target;
    setEditedProduct((prevProduct) => {
      const updatedVariants = [...prevProduct.variantes];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value,
      };
      return {
        ...prevProduct,
        variantes: updatedVariants,
      };
    });
  };

  const handleSaveChangesLocal = () => {
    // Aquí construyes el objeto con la información actualizada del producto
    const updatedProduct = {
      id: editedProduct.id,
      nombre: editedProduct.nombre,
      categoria: editedProduct.categoria,
      precio: editedProduct.precio,
      variantes: editedProduct.variantes,
    };
    handleSaveChanges(updatedProduct); // Llama a la función handleSaveChanges de ProductList
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} className="edit-product-modal">
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          {editedProduct.variantes.map((variante, index) => (
            <div key={index} className="variant-form-group">
              <div className="form-group">
                <label className="form-label">Talle</label>
                <input
                  type="text"
                  className="form-control"
                  value={variante.talla}
                  onChange={(e) => handleVariantInputChange(e, index, 'talle')}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  className="form-control"
                  value={variante.color}
                  onChange={(e) => handleVariantInputChange(e, index, 'color')}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cantidad Disponible</label>
                <input
                  type="number"
                  className="form-control"
                  value={variante.cantidad_disponible}
                  onChange={(e) => handleVariantInputChange(e, index, 'cantidad_disponible')}
                />
              </div>
            </div>
          ))}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSaveChangesLocal}>
          Guardar Cambios
        </Button>
        
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;
