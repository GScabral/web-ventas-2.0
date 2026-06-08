import React from "react";
import "./VariantCard.css";

const VariantCard = ({
    variante,
    index,
    loading,
    variantesData,
    setVariantesData,
    handleAddTalla,
    handleRemoveTalla,
    handleRemoveVariante,
    handleRemoveImagen,
    handleTallaChange,
}) => {
    return (
        <div className="variant-card">

            <div className="variant-header">

                <div>
                    <h3>
                        {variante.color
                            ? `Color: ${variante.color}`
                            : `Variante ${index + 1}`}
                    </h3>

                    <span>
                        Configuración de color, imágenes y stock
                    </span>
                </div>

                <button
                    type="button"
                    className="btn-delete-variant"
                    onClick={() =>
                        handleRemoveVariante(index)
                    }
                    disabled={loading}
                >
                    Eliminar
                </button>

            </div>

            <div className="variant-section">

                <label>Color</label>

                <input
                    type="text"
                    placeholder="Ej: Negro"
                    value={variante.color}
                    onChange={(e) => {
                        const updated = [...variantesData];

                        updated[index].color =
                            e.target.value;

                        setVariantesData(updated);
                    }}
                    required
                />

            </div>

            <div className="variant-section">

                <label>Imágenes</label>

                <input
                    type="file"
                    multiple
                    onChange={(e) => {
                        const updated = [...variantesData];

                        updated[index].imagenFiles =
                            Array.from(e.target.files);

                        setVariantesData(updated);
                    }}
                    required
                />

            </div>

            <div className="image-grid">

                {variante.imagenFiles.map(
                    (file, imgIndex) => (
                        <div
                            key={imgIndex}
                            className="image-item"
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="preview-image"
                            />

                            <button
                                type="button"
                                className="remove-image"
                                onClick={() =>
                                    handleRemoveImagen(
                                        index,
                                        imgIndex
                                    )
                                }
                                disabled={loading}
                            >
                                ×
                            </button>
                        </div>
                    )
                )}

            </div>

            <div className="sizes-container">

                <div className="sizes-header">

                    <h4>Tallas disponibles</h4>

                    <button
                        type="button"
                        className="btn-add-size"
                        onClick={() =>
                            handleAddTalla(index)
                        }
                        disabled={loading}
                    >
                        + Agregar talla
                    </button>

                </div>

                {variante.tallas.length > 0 ? (

                    <table className="sizes-table">

                        <thead>
                            <tr>
                                <th>Talla</th>
                                <th>Stock</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {variante.tallas.map(
                                (talla, tallaIndex) => (
                                    <tr key={tallaIndex}>

                                        <td>
                                            <input
                                                type="text"
                                                value={talla.talla}
                                                onChange={(e) =>
                                                    handleTallaChange(
                                                        index,
                                                        tallaIndex,
                                                        "talla",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                value={talla.cantidad}
                                                onChange={(e) =>
                                                    handleTallaChange(
                                                        index,
                                                        tallaIndex,
                                                        "cantidad",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                className="btn-delete-size"
                                                onClick={() =>
                                                    handleRemoveTalla(
                                                        index,
                                                        tallaIndex
                                                    )
                                                }
                                                disabled={loading}
                                            >
                                                Eliminar
                                            </button>

                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>

                ) : (
                    <div className="empty-sizes">
                        Aún no agregaste tallas
                    </div>
                )}

            </div>

        </div>
    );
};

export default VariantCard;