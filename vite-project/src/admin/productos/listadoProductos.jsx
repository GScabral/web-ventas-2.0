import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  cambios,
  getProductos,
  borrar,
  ofertas,
  paginado,
} from "../../redux/action";

import { Modal } from "react-bootstrap";
import EditProductModal from "./editar";
import OfertasModal from "../ofertas/ofertas";
import ProductCard from "./components/ProductCard";
import ProductPagination from "./components/ProductPagination";

import "./listadoProductos.css";

const ProductList = () => {
  const dispatch = useDispatch();

  const allProductos = useSelector(
    (state) => state.allProductos
  );


  console.log(allProductos)
  const currentPage = useSelector(
    (state) => state.currentPage
  );

  const totalPages = useSelector(
    (state) => state.totalPages
  );

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showOfertaModal, setShowOfertaModal] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [productIdToEdit, setProductIdToEdit] =
    useState(null);

  const [ofertaId, setOfertaId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [feedbackMsg, setFeedbackMsg] =
    useState("");

  const [feedbackType, setFeedbackType] =
    useState("");

  useEffect(() => {
    dispatch(getProductos());
  }, [dispatch]);

  const handleEdit = (productId) => {
    const productToEdit =
      allProductos.find(
        (producto) =>
          producto.id === productId
      );

    setSelectedProduct(productToEdit);

    setProductIdToEdit(productId);

    setShowEditModal(true);
  };

  const handleDelete = (productId) => {
    const confirmDelete =
      window.confirm(
        "¿Deseas eliminar este producto?"
      );

    if (!confirmDelete) return;

    dispatch(borrar(productId));

    setFeedbackMsg(
      "Producto eliminado correctamente"
    );

    setFeedbackType("success");

    setTimeout(() => {
      setFeedbackMsg("");
    }, 2500);
  };

  const handleOferta = (productId) => {
    const productToOferta =
      allProductos.find(
        (producto) =>
          producto.id === productId
      );

    setSelectedProduct(productToOferta);

    setOfertaId(productId);

    setShowOfertaModal(true);
  };

  const handleSaveChanges = (
    editedProduct
  ) => {
    dispatch(
      cambios(
        productIdToEdit,
        editedProduct
      )
    );

    setShowEditModal(false);

    setFeedbackMsg(
      "Producto actualizado correctamente"
    );

    setFeedbackType("success");

    setTimeout(() => {
      setFeedbackMsg("");
    }, 2500);
  };

  const handleSaveOferta = () => {
    dispatch(ofertas(ofertaId));

    setShowOfertaModal(false);

    setFeedbackMsg(
      "Oferta aplicada correctamente"
    );

    setFeedbackType("success");

    setTimeout(() => {
      setFeedbackMsg("");
    }, 2500);
  };

  const filteredProducts =
    allProductos?.filter((producto) =>
      producto.nombre
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="products-page">

      {/* HEADER */}

      <div className="products-header">

        <div>

          <h1>
            Gestión de Productos
          </h1>

          <p>
            Administra todo tu catálogo
          </p>

        </div>

        <div className="products-stats">

          <div className="stat-card">

            <span>
              Total Productos
            </span>

            <strong>
              {allProductos?.length || 0}
            </strong>

          </div>

        </div>

      </div>

      {/* ALERTAS */}

      {feedbackMsg && (
        <div
          className={`feedback-alert ${feedbackType}`}
        >
          {feedbackMsg}
        </div>
      )}

      {/* BUSCADOR */}

      <div className="search-container">

        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

      </div>

      {/* GRID */}

      <div className="products-grid">

        {filteredProducts?.map(
          (producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onEdit={
                handleEdit
              }
              onDelete={
                handleDelete
              }
              onOferta={
                handleOferta
              }
            />
          )
        )}

      </div>

      {/* PAGINACIÓN */}

      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChangePage={(page) =>
          dispatch(
            paginado(page)
          )
        }
      />

      {/* MODAL EDITAR */}

      <Modal
        show={showEditModal}
        onHide={() =>
          setShowEditModal(false)
        }
      >
        <EditProductModal
          show={showEditModal}
          handleClose={() =>
            setShowEditModal(false)
          }
          product={selectedProduct}
          handleSaveChanges={
            handleSaveChanges
          }
        />
      </Modal>

      {/* MODAL OFERTA */}

      <OfertasModal
        show={showOfertaModal}
        handleClose={() =>
          setShowOfertaModal(false)
        }
        product={selectedProduct}
        handleSaveChanges={
          handleSaveOferta
        }
      />

    </div>
  );
};

export default ProductList;