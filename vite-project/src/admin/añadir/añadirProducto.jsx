// añadirProducto.jsx
import React, { useState } from "react";
import { connect } from "react-redux";
import { addProduct } from "../../redux/action";
import "./panel.css";

const NewProduct = ({ addProduct }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescrip, setProductDescrip] = useState('');
  const [productCategoria, setProductCategoria] = useState('');
  const [productSubCategoria, setProductSubCategoria] = useState('');
  const [variantesData, setVariantesData] = useState([]);
  const [showAddTallaForm, setShowAddTallaForm] = useState(false);
  const [newTalla, setNewTalla] = useState('');
  const [newCantidad, setNewCantidad] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!productName || !productPrice || !productDescrip || !productCategoria || !productSubCategoria || variantesData.length === 0) return;
    try {
      const formData = new FormData();
      formData.append('nombre_producto', productName);
      formData.append('descripcion', productDescrip);
      formData.append('precio', productPrice);
      formData.append('categoria', productCategoria);
      formData.append('subcategoria', productSubCategoria);
      variantesData.forEach((variante, index) => {
        formData.append(`variantesData[${index}][color]`, variante.color);
        variante.imagenFiles.forEach((file, fileIndex) => {
          formData.append(`variantesData[${index}][imagenFiles][${fileIndex}]`, file);
        });
        variante.tallas.forEach((talla, tallaIndex) => {
          formData.append(`variantesData[${index}][tallas][${tallaIndex}][talla]`, talla.talla);
          formData.append(`variantesData[${index}][tallas][${tallaIndex}][cantidad]`, talla.cantidad);
        });
      });
      await addProduct(formData);
      setProductName(''); setProductPrice(''); setProductDescrip(''); setProductCategoria(''); setProductSubCategoria(''); setVariantesData([]);
    } catch (error) {
      console.error('Error al agregar el producto', error);
    }
  };

  return (
    <div className="admin-panel">
      <h1 className="h1-panel">Ingresar Producto</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <fieldset>
          <legend>Detalles del Producto</legend>
          <label className="label-admin" htmlFor="productName">Nombre del Producto:</label>
          <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required /><br /><br />
          <label className="label-admin" htmlFor="productPrice">Precio:</label>
          <input type="number" id="productPrice" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required /><br /><br />
          <label className="label-admin" htmlFor="productDescrip">Descripción:</label>
          <input type="text" id="productDescrip" value={productDescrip} onChange={(e) => setProductDescrip(e.target.value)} required /><br /><br />
          <label className="label-admin" htmlFor="productCategoria">Categoría:</label>
          <input type="text" id="productCategoria" value={productCategoria} onChange={(e) => setProductCategoria(e.target.value)} required /><br /><br />
          <label className="label-admin" htmlFor="productSubCategoria">Subcategoría:</label>
          <input type="text" id="productSubCategoria" value={productSubCategoria} onChange={(e) => setProductSubCategoria(e.target.value)} required /><br /><br />
        </fieldset>

        <button type="button" onClick={() => setVariantesData([...variantesData, { color: '', imagenFiles: [], tallas: [] }])}>Agregar Variante</button>

        {variantesData.map((variante, index) => (
          <div key={index} className="variantes-añadir">
            <label>Variante {index + 1}</label>
            <input type="text" placeholder="Color" value={variante.color} onChange={(e) => {
              const updated = [...variantesData];
              updated[index].color = e.target.value;
              setVariantesData(updated);
            }} />
            <input type="file" onChange={(e) => {
              const updated = [...variantesData];
              updated[index].imagenFiles = Array.from(e.target.files);
              setVariantesData(updated);
            }} multiple />
            <button type="button" onClick={() => setShowAddTallaForm(true)}>Agregar Talla</button>
            {showAddTallaForm && (
              <div className="newT-addProduc">
                <input type="text" placeholder="Talla" value={newTalla} onChange={(e) => setNewTalla(e.target.value)} />
                <input type="number" placeholder="Cantidad" value={newCantidad} onChange={(e) => setNewCantidad(e.target.value)} />
                <button type="button" onClick={() => {
                  if (!newTalla || newCantidad <= 0) return;
                  const updated = [...variantesData];
                  if (!updated[index].tallas.some(t => t.talla === newTalla)) {
                    updated[index].tallas.push({ talla: newTalla, cantidad: parseInt(newCantidad, 10) });
                    setVariantesData(updated);
                    setShowAddTallaForm(false);
                    setNewTalla('');
                    setNewCantidad(0);
                  }
                }}>Guardar Talla</button>
              </div>
            )}
          </div>
        ))}

        <button type="submit">Agregar Producto</button>
      </form>
    </div>
  );
};

export default connect(null, { addProduct })(NewProduct);
