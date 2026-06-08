import React, { useState } from "react";
import { connect } from "react-redux";

import { addProduct } from "../../redux/action";

import ProductInfoCard from "./productInfoCard.jsx/ProductInfoCard";
import CategoryCard from "./categoryCard.jsx/CategoryCard";
import VariantCard from "./VariantCard/VariantCard";
import PublishCard from "./PublishCard/PublishCard";

import "./NewProduct.css";

const NewProduct = ({ addProduct }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescrip, setProductDescrip] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);

  const [productGrupo, setProductGrupo] = useState("");
  const [productCategoria, setProductCategoria] = useState("");
  const [productSubCategoria, setProductSubCategoria] =
    useState("");

  const [variantesData, setVariantesData] =
    useState([]);

  const [loading, setLoading] = useState(false);

  const [successMsg, setSuccessMsg] =
    useState("");

  const [errorMsg, setErrorMsg] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");

    if (
      !productName ||
      !productPrice ||
      !productDescrip ||
      !productCategoria
    ) {
      setErrorMsg(
        "Completa todos los campos obligatorios."
      );
      return;
    }

    if (Number(productPrice) <= 0) {
      setErrorMsg(
        "El precio debe ser mayor a 0."
      );
      return;
    }

    if (variantesData.length === 0) {
      setErrorMsg(
        "Agrega al menos una variante."
      );
      return;
    }

    for (const variante of variantesData) {
      if (!variante.color) {
        setErrorMsg(
          "Cada variante debe tener un color."
        );
        return;
      }

      if (
        !variante.imagenFiles ||
        variante.imagenFiles.length === 0
      ) {
        setErrorMsg(
          "Cada variante debe tener al menos una imagen."
        );
        return;
      }

      if (
        !variante.tallas ||
        variante.tallas.length === 0
      ) {
        setErrorMsg(
          "Cada variante debe tener al menos una talla."
        );
        return;
      }

      for (const talla of variante.tallas) {
        if (
          !talla.talla ||
          !talla.cantidad ||
          talla.cantidad <= 0
        ) {
          setErrorMsg(
            "Todas las tallas deben tener nombre y stock válido."
          );
          return;
        }
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "nombre_producto",
        productName
      );

      formData.append(
        "descripcion",
        productDescrip
      );

      formData.append(
        "precio",
        productPrice
      );

      formData.append(
        "rama",
        productGrupo
      );

      formData.append(
        "categoria",
        productCategoria
      );

      formData.append(
        "subcategoria",
        productSubCategoria
      );
      formData.append(
        "secciones",
        JSON.stringify(selectedSections)
      );

      variantesData.forEach(
        (variante, index) => {
          formData.append(
            `variantesData[${index}][color]`,
            variante.color
          );

          variante.imagenFiles.forEach(
            (file, fileIndex) => {
              formData.append(
                `variantesData[${index}][imagenFiles][${fileIndex}]`,
                file
              );
            }
          );

          variante.tallas.forEach(
            (talla, tallaIndex) => {
              formData.append(
                `variantesData[${index}][tallas][${tallaIndex}][talla]`,
                talla.talla
              );

              formData.append(
                `variantesData[${index}][tallas][${tallaIndex}][cantidad]`,
                talla.cantidad
              );
            }
          );
        }
      );

      await addProduct(formData);

      setSuccessMsg(
        "Producto guardado correctamente."
      );

      setProductName("");
      setProductPrice("");
      setProductDescrip("");

      setProductGrupo("");
      setProductCategoria("");
      setProductSubCategoria("");
      setSelectedSections([]);

      setVariantesData([]);
    } catch (error) {
      console.error(error);

      setErrorMsg(
        "Error al agregar el producto."
      );
    }

    setLoading(false);
  };

  const handleAddVariante = () => {
    setVariantesData((prev) => [
      ...prev,
      {
        color: "",
        imagenFiles: [],
        tallas: [],
      },
    ]);
  };

  const handleRemoveVariante = (index) => {
    setVariantesData((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleAddTalla = (index) => {
    setVariantesData((prev) =>
      prev.map((variante, i) =>
        i === index
          ? {
            ...variante,
            tallas: [
              ...variante.tallas,
              {
                talla: "",
                cantidad: 1,
              },
            ],
          }
          : variante
      )
    );
  };

  const handleRemoveTalla = (
    varIndex,
    tallaIndex
  ) => {
    setVariantesData((prev) =>
      prev.map((variante, i) =>
        i === varIndex
          ? {
            ...variante,
            tallas:
              variante.tallas.filter(
                (_, idx) =>
                  idx !== tallaIndex
              ),
          }
          : variante
      )
    );
  };

  const handleTallaChange = (
    varIndex,
    tallaIndex,
    field,
    value
  ) => {
    setVariantesData((prev) =>
      prev.map((variante, i) =>
        i === varIndex
          ? {
            ...variante,
            tallas:
              variante.tallas.map(
                (talla, idx) =>
                  idx === tallaIndex
                    ? {
                      ...talla,
                      [field]:
                        field ===
                          "cantidad"
                          ? Number(
                            value
                          )
                          : value,
                    }
                    : talla
              ),
          }
          : variante
      )
    );
  };

  const handleRemoveImagen = (
    varIndex,
    imgIndex
  ) => {
    setVariantesData((prev) =>
      prev.map((variante, i) =>
        i === varIndex
          ? {
            ...variante,
            imagenFiles:
              variante.imagenFiles.filter(
                (_, idx) =>
                  idx !== imgIndex
              ),
          }
          : variante
      )
    );
  };

  const handleSectionChange = (e) => {

    const { value, checked } = e.target;

    if (checked) {

      setSelectedSections(prev => [
        ...prev,
        value
      ]);

    } else {

      setSelectedSections(prev =>
        prev.filter(
          section => section !== value
        )
      );

    }

  };

  return (
    <div className="new-product-page">
      <div className="new-product-header">
        <h1>Nuevo Producto</h1>

        <p>
          Crea y configura productos para tu
          tienda
        </p>
      </div>

      {successMsg && (
        <div className="notification-success">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="notification-error">
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="new-product-layout">
          <div className="left-column">
            <ProductInfoCard
              productName={productName}
              setProductName={
                setProductName
              }
              productPrice={productPrice}
              setProductPrice={
                setProductPrice
              }
              productDescrip={
                productDescrip
              }
              setProductDescrip={
                setProductDescrip
              }
            />

            <div className="variants-section">
              <div className="variants-header">
                <h2>Variantes</h2>

                <button
                  type="button"
                  className="btn-add-variant"
                  onClick={
                    handleAddVariante
                  }
                >
                  + Agregar Variante
                </button>
              </div>

              {variantesData.map(
                (variante, index) => (
                  <VariantCard
                    key={index}
                    variante={variante}
                    index={index}
                    loading={loading}
                    variantesData={
                      variantesData
                    }
                    setVariantesData={
                      setVariantesData
                    }
                    handleAddTalla={
                      handleAddTalla
                    }
                    handleRemoveTalla={
                      handleRemoveTalla
                    }
                    handleRemoveVariante={
                      handleRemoveVariante
                    }
                    handleRemoveImagen={
                      handleRemoveImagen
                    }
                    handleTallaChange={
                      handleTallaChange
                    }
                  />
                )
              )}
            </div>
          </div>

          <div className="right-column">
            <CategoryCard
              productGrupo={
                productGrupo
              }
              setProductGrupo={
                setProductGrupo
              }
              productCategoria={
                productCategoria
              }
              setProductCategoria={
                setProductCategoria
              }
              productSubCategoria={
                productSubCategoria
              }
              setProductSubCategoria={
                setProductSubCategoria
              }

            />
            <div className="sections-card">

              <h3>Mostrar producto en</h3>

              <label className="section-option">

                <input
                  type="checkbox"
                  value="hero"
                  checked={selectedSections.includes("hero")}
                  onChange={handleSectionChange}
                />

                Hero Principal

              </label>

              <label className="section-option">

                <input
                  type="checkbox"
                  value="trending"
                  checked={selectedSections.includes("trending")}
                  onChange={handleSectionChange}
                />

                Trending

              </label>

              <label className="section-option">

                <input
                  type="checkbox"
                  value="principal"
                  checked={selectedSections.includes("principal")}
                  onChange={handleSectionChange}
                />

                principal

              </label>

              <label className="section-option">

                <input
                  type="checkbox"
                  value="featured"
                  checked={selectedSections.includes("featured")}
                  onChange={handleSectionChange}
                />

                Destacados

              </label>
              <label className="section-option">

                <input
                  type="checkbox"
                  value="banner"
                  checked={selectedSections.includes("banner")}
                  onChange={handleSectionChange}
                />

                banner

              </label>

            </div>

            <PublishCard
              loading={loading}
              variantesData={
                variantesData
              }
              productName={
                productName
              }
              productPrice={
                productPrice
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default connect(null, {
  addProduct,
})(NewProduct);