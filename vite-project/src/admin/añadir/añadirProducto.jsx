import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";

import { addProduct, createCategoria, getCategorias } from "../../redux/action";

import ProductInfoCard from "./productInfoCard.jsx/ProductInfoCard";
import CategoryCard from "./categoryCard.jsx/CategoryCard";
import VariantCard from "./VariantCard/VariantCard";
import PublishCard from "./PublishCard/PublishCard";

import "./NewProduct.css";

const NewProduct = ({ addProduct, createCategoria }) => {
  const dispatch = useDispatch()
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescrip, setProductDescrip] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);

  const [productGrupo, setProductGrupo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");


  const categorias = useSelector(state => state.categorias || []);

  const [variantesData, setVariantesData] =
    useState([]);

  const [loading, setLoading] = useState(false);

  const [successMsg, setSuccessMsg] =
    useState("");

  const [errorMsg, setErrorMsg] =
    useState("");

  // Errores por campo, para mostrar el aviso pegado a cada input
  // en vez de un único cartel genérico al final del formulario.
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (field, value) => {
    let message = "";

    if (field === "productName" && !value.trim()) {
      message = "Ingresá un nombre para el producto.";
    }

    if (field === "productPrice") {
      if (!value) {
        message = "Ingresá un precio.";
      } else if (Number(value) <= 0) {
        message = "El precio debe ser mayor a 0.";
      }
    }

    if (field === "productDescrip" && !value.trim()) {
      message = "Agregá una descripción.";
    }

    if (field === "productGrupo" && !value.trim()) {
      message = "Ingresá una rama para el producto.";
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: message,
    }));

    return message === "";
  };


  useEffect(() => {
    dispatch(getCategorias());
  }, [dispatch]);



  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");

    const nameOk = validateField("productName", productName);
    const priceOk = validateField("productPrice", productPrice);
    const descripOk = validateField("productDescrip", productDescrip);
    const grupoOk = validateField("productGrupo", productGrupo);

    if (!categoriaId && !nuevaCategoria.trim()) {
      setErrorMsg(
        "Elegí una categoría existente o creá una nueva."
      );
      return;
    }

    if (!nameOk || !priceOk || !descripOk || !grupoOk) {
      setErrorMsg(
        "Revisá los campos marcados en rojo."
      );
      return;
    }

    if (variantesData.length === 0) {
      setErrorMsg(
        "Agregá al menos una variante (color, imágenes y tallas)."
      );
      return;
    }

    for (const variante of variantesData) {
      if (!variante.color) {
        setErrorMsg(
          "Cada variante necesita un color."
        );
        return;
      }

      if (
        !variante.imagenFiles ||
        variante.imagenFiles.length === 0
      ) {
        setErrorMsg(
          `La variante "${variante.color}" necesita al menos una imagen.`
        );
        return;
      }

      if (
        !variante.tallas ||
        variante.tallas.length === 0
      ) {
        setErrorMsg(
          `La variante "${variante.color}" necesita al menos una talla.`
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
            `Revisá las tallas de la variante "${variante.color}": todas necesitan nombre y stock mayor a 0.`
          );
          return;
        }
      }
    }

    setLoading(true);

    try {

      let categoriaFinal = categoriaId;

      if (nuevaCategoria.trim()) {

        const categoriaCreada =
          await createCategoria(nuevaCategoria);
        console.log("categoriaCreada:", categoriaCreada);
        categoriaFinal =
          categoriaCreada.id_categoria;
      }

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
        "categoriaId",
        categoriaFinal
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
      setCategoriaId("");
      setSelectedSections([]);

      setVariantesData([]);
      setFieldErrors({});
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

  // Checklist de progreso: qué falta para poder publicar.
  // Se muestra en PublishCard así la persona ve de un vistazo
  // qué le falta, sin tener que tocar "Guardar" para enterarse.
  const checklist = [
    {
      label: "Nombre del producto",
      done: productName.trim().length > 0,
    },
    {
      label: "Precio válido",
      done: Number(productPrice) > 0,
    },
    {
      label: "Descripción",
      done: productDescrip.trim().length > 0,
    },
    {
      label: "Rama y categoría",
      done:
        productGrupo.trim().length > 0 &&
        (Boolean(categoriaId) || nuevaCategoria.trim().length > 0),
    },
    {
      label: "Al menos una variante completa",
      done:
        variantesData.length > 0 &&
        variantesData.every(
          (v) =>
            v.color &&
            v.imagenFiles?.length > 0 &&
            v.tallas?.length > 0 &&
            v.tallas.every((t) => t.talla && t.cantidad > 0)
        ),
    },
  ];

  const isReadyToPublish = checklist.every((item) => item.done);

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
              stepNumber={1}
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
              fieldErrors={fieldErrors}
              validateField={validateField}
            />

            <div className="variants-section">
              <div className="variants-header">
                <h2>
                  <span className="step-badge">3</span>
                  Variantes
                </h2>

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

              {variantesData.length === 0 && (
                <div className="variants-empty-state">
                  <p>
                    Todavía no agregaste ninguna variante.
                  </p>
                  <span>
                    Cada variante representa un color con sus
                    imágenes y tallas disponibles. Necesitás
                    al menos una para poder publicar.
                  </span>
                  <button
                    type="button"
                    className="btn-add-variant"
                    onClick={handleAddVariante}
                  >
                    + Agregar mi primera variante
                  </button>
                </div>
              )}

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
              stepNumber={2}
              productGrupo={productGrupo}
              setProductGrupo={setProductGrupo}

              categorias={categorias}

              categoriaId={categoriaId}
              setCategoriaId={setCategoriaId}

              nuevaCategoria={nuevaCategoria}
              setNuevaCategoria={setNuevaCategoria}

              fieldErrors={fieldErrors}
              validateField={validateField}
            />
            <div className="sections-card">

              <h3>Mostrar producto en</h3>
              <p className="sections-hint">
                Opcional: elegí en qué secciones de la
                tienda querés que aparezca.
              </p>

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
              stepNumber={4}
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
              checklist={checklist}
              isReadyToPublish={isReadyToPublish}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default connect(null, {
  addProduct,
  createCategoria,
})(NewProduct);