import React, { useState, useEffect } from "react";
import "./editar.css";

const EditProductModal = ({
  show,
  handleClose,
  product,
  handleSaveChanges,
}) => {
  const [editedProduct, setEditedProduct] =
    useState(null);
  const availableSections = [
    "hero",
    "banner",
    "destacados",
    "nuevos",
    "ofertas"
  ];
  useEffect(() => {
    if (product) {
      setEditedProduct({
        ...product,
      });
    }
  }, [product]);

  if (!editedProduct) return null;
  if (!show) return null;

  const handleInputChange = (
    field,
    value
  ) => {
    setEditedProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVariantChange = (
    index,
    field,
    value
  ) => {
    const updatedVariants = [
      ...editedProduct.variantes,
    ];

    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };

    setEditedProduct((prev) => ({
      ...prev,
      variantes: updatedVariants,
    }));
  };

  const handleSave = () => {
    handleSaveChanges(editedProduct);
    handleClose();
  };

  const handleSectionToggle = (
    sectionName
  ) => {

    const currentSections =
      editedProduct.sections || [];

    const exists =
      currentSections.some(
        s =>
          s.section === sectionName
      );

    let updatedSections;

    if (exists) {

      updatedSections =
        currentSections.filter(
          s =>
            s.section !== sectionName
        );

    } else {

      updatedSections = [
        ...currentSections,
        {
          section: sectionName,
          title:
            sectionName.charAt(0)
              .toUpperCase() +
            sectionName.slice(1)
        }
      ];

    }

    setEditedProduct(prev => ({
      ...prev,
      sections: updatedSections
    }));

  };

  return (
    <div
      className="custom-modal-overlay"
      onClick={handleClose}
    >
      <div
        className="custom-modal edit-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-modal-header">
          <h2>Editar Producto</h2>

          <button
            type="button"
            className="custom-modal-close"
            onClick={handleClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="custom-modal-body">

        <div className="edit-layout">

          <div className="edit-main-card">

            <h3>
              Información General
            </h3>

            <div className="form-group">
              <label>
                Nombre del producto
              </label>

              <input
                type="text"
                value={editedProduct.nombre || ""}
                onChange={(e) =>
                  handleInputChange(
                    "nombre",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Precio</label>

                <input
                  type="number"
                  value={
                    editedProduct.precio || ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "precio",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>Categoría</label>

                <input
                  type="text"
                  value={
                    editedProduct.categoria.nombre ||
                    ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "categoria",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="form-group">

                <p className="current-sections">

                  Actualmente en:

                  {
                    editedProduct.sections?.map(
                      s => s.title
                    ).join(", ")
                  }

                </p>
                <label>
                  Mostrar producto en
                </label>

                <div className="sections-selector">

                  {availableSections.map(
                    section => (

                      <button
                        type="button"
                        key={section}
                        className={`section-chip ${editedProduct.sections?.some(
                          s => s.section === section
                        )
                          ? "active"
                          : ""
                          }`}
                        onClick={() =>
                          handleSectionToggle(section)
                        }
                      >
                        {section}
                      </button>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

          <div className="edit-main-card">

            <div className="section-header">
              <h3>Variantes</h3>

              <span>
                {
                  editedProduct.variantes
                    ?.length
                }{" "}
                variantes
              </span>
            </div>

            {editedProduct.variantes?.map(
              (variante, index) => (
                <div
                  key={index}
                  className="variant-card"
                >
                  <h4>
                    Variante #
                    {index + 1}
                  </h4>

                  <div className="variant-grid">

                    <div className="form-group">
                      <label>
                        Talla
                      </label>

                      <input
                        type="text"
                        value={
                          variante.talla ||
                          ""
                        }
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "talla",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Color
                      </label>

                      <input
                        type="text"
                        value={
                          variante.color ||
                          ""
                        }
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "color",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Stock
                      </label>

                      <input
                        type="number"
                        value={
                          variante.cantidad_disponible ||
                          0
                        }
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "cantidad_disponible",
                            e.target.value
                          )
                        }
                      />
                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        </div>

        </div>

        <div className="custom-modal-footer">

          <button
            className="btn-cancel"
            onClick={handleClose}
          >
            Cancelar
          </button>

          <button
            className="btn-save"
            onClick={handleSave}
          >
            Guardar Cambios
          </button>

        </div>
      </div>
    </div>
  );
};

export default EditProductModal;