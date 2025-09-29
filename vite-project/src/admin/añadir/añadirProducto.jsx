import React, { useState } from "react";
import { connect } from "react-redux";
import { addProduct } from "../../redux/action";
import { categoriasGlobal } from "../../pages/Home/barralado/categorias";
import "./panel.css";

const NewProduct = ({ addProduct }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescrip, setProductDescrip] = useState("");
  const [productCategoria, setProductCategoria] = useState("");
  const [productSubCategoria, setProductSubCategoria] = useState("");
  const [variantesData, setVariantesData] = useState([]);
  const [productGrupo, setProductGrupo] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !productName ||
      !productPrice ||
      !productDescrip ||
      !productCategoria
    )
      return;

    try {
      const formData = new FormData();
      formData.append("nombre_producto", productName);
      formData.append("descripcion", productDescrip);
      formData.append("precio", productPrice);
      formData.append("rama", productGrupo);
      formData.append("categoria", productCategoria);
      formData.append("subcategoria", productSubCategoria);


      variantesData.forEach((variante, index) => {
        formData.append(`variantesData[${index}][color]`, variante.color);
        variante.imagenFiles.forEach((file, fileIndex) => {
          formData.append(
            `variantesData[${index}][imagenFiles][${fileIndex}]`,
            file
          );
        });
        variante.tallas.forEach((talla, tallaIndex) => {
          formData.append(
            `variantesData[${index}][tallas][${tallaIndex}][talla]`,
            talla.talla
          );
          formData.append(
            `variantesData[${index}][tallas][${tallaIndex}][cantidad]`,
            talla.cantidad
          );
        });
      });

      await addProduct(formData);

      // Reset form
      setProductName("");
      setProductPrice("");
      setProductDescrip("");
      setProductCategoria("");
      setProductSubCategoria("");
      setVariantesData([]);
    } catch (error) {
      console.error("Error al agregar el producto", error);
    }
  };

  const handleAddVariante = () => {
    setVariantesData([
      ...variantesData,
      { color: "", imagenFiles: [], tallas: [] },
    ]);
  };

  const handleAddTalla = (index) => {
    const talla = prompt("Ingrese la talla:");
    const cantidad = prompt("Ingrese la cantidad:");
    if (!talla || !cantidad) return;

    const updated = [...variantesData];
    updated[index].tallas.push({
      talla,
      cantidad: parseInt(cantidad, 10),
    });
    setVariantesData(updated);
  };

  return (
    <div className="admin-panel">
      <h1 className="h1-panel">Ingresar Producto</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Datos generales */}
        <fieldset>
          <legend>Detalles del Producto</legend>

          <label>Nombre:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />

          <label>Precio:</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />

          <label>Descripción:</label>
          <textarea
            value={productDescrip}
            onChange={(e) => setProductDescrip(e.target.value)}
            required
          />

          {/* Select de Categorías */}
          <label>Rama:</label>
          <select
            value={productGrupo}
            onChange={(e) => {
              setProductGrupo(e.target.value);
              setProductCategoria("");
              setProductSubCategoria("");
            }}
            required
          >
            <option value="">-- Selecciona una rama --</option>
            {Object.keys(categoriasGlobal).map((rama) => (
              <option key={rama} value={rama}>
                {rama}
              </option>
            ))}
          </select>

          {/* Categoría según la rama */}
          {productGrupo && (
            <>
              <label>Categoría:</label>
              <select
                value={productCategoria}
                onChange={(e) => {
                  setProductCategoria(e.target.value);
                  setProductSubCategoria("");
                }}
                required
              >
                <option value="">-- Selecciona una categoría --</option>
                {Object.keys(categoriasGlobal[productGrupo]).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Subcategoría si existe */}
          {productCategoria &&
            Array.isArray(categoriasGlobal[productGrupo][productCategoria]) && (
              <>
                <label>Subcategoría:</label>
                <select
                  value={productSubCategoria}
                  onChange={(e) => setProductSubCategoria(e.target.value)}
                >
                  <option value="">-- Selecciona una subcategoría --</option>
                  {categoriasGlobal[productGrupo][productCategoria].map((sub, i) => (
                    <option key={i} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </>
            )}
        </fieldset>

        {/* Variantes */}
        <div className="variante-section">
          <h2>Variantes</h2>
          <button
            type="button"
            className="btn-add"
            onClick={handleAddVariante}
          >
            + Agregar Variante
          </button>

          {variantesData.map((variante, index) => (
            <div key={index} className="variante-card">
              <h3>Variante {index + 1}</h3>

              <label>Color:</label>
              <input
                type="text"
                placeholder="Ej: Rojo"
                value={variante.color}
                onChange={(e) => {
                  const updated = [...variantesData];
                  updated[index].color = e.target.value;
                  setVariantesData(updated);
                }}
              />

              <label>Imágenes:</label>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const updated = [...variantesData];
                  updated[index].imagenFiles = Array.from(e.target.files);
                  setVariantesData(updated);
                }}
              />

              {/* Previews */}
              <div className="preview-container">
                {variante.imagenFiles.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="preview-img"
                  />
                ))}
              </div>

              {/* Tallas */}
              <h4>Tallas disponibles</h4>
              <table>
                <thead>
                  <tr>
                    <th>Talla</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {variante.tallas.map((t, i) => (
                    <tr key={i}>
                      <td>{t.talla}</td>
                      <td>{t.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                className="btn-add"
                onClick={() => handleAddTalla(index)}
              >
                + Agregar Talla
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn-submit">
          ✅ Guardar Producto
        </button>
      </form>
    </div>
  );
};

export default connect(null, { addProduct })(NewProduct);
