import React, { useState } from "react";

import ShippingForm from "./ShippingForm";
import useCheckout from "./useCheckout";

import styles from "../styles/CheckoutModal.module.css";

const CheckoutModal = ({ show, onClose }) => {
  const {
    email,
    setEmail,
    shippingData,
    handleShippingChange,
    confirmarPedido,
    loading,
    submitError,
    setSubmitError,
  } = useCheckout();

  const [fieldErrors, setFieldErrors] = useState({});

  if (!show) return null;

  const handleSubmit = async () => {
    const errors = {};

    if (!email) {
      errors.email = "Ingresá tu correo electrónico.";
    }

    if (!shippingData.nombre) {
      errors.nombre = "Ingresá tu nombre.";
    }

    if (!shippingData.telefono) {
      errors.telefono = "Ingresá un teléfono de contacto.";
    }

    if (shippingData.tipoEntrega === "ENVIO") {
      if (!shippingData.provincia) {
        errors.provincia = "Ingresá tu provincia.";
      }

      if (!shippingData.ciudad) {
        errors.ciudad = "Ingresá tu ciudad.";
      }

      if (!shippingData.direccion) {
        errors.direccion = "Ingresá tu dirección.";
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const ok = await confirmarPedido();

    if (ok) {
      onClose();
    }
  };

  return (
    <div className="custom-modal-overlay" onClick={onClose}>

      <div
        className={`custom-modal ${styles.modal}`}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="custom-modal-header">
          <h2>Finalizar Compra</h2>

          <button
            type="button"
            className="custom-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="custom-modal-body">

          {submitError && (
            <div className={styles.submitError}>
              {submitError}
            </div>
          )}

          <div
            className={`${styles.formGroup} ${fieldErrors.email ? styles.hasError : ""}`}
          >

            <label>
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="ejemplo@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSubmitError("");
              }}
            />

            {fieldErrors.email && (
              <span className={styles.fieldError}>
                {fieldErrors.email}
              </span>
            )}

          </div>

          <ShippingForm
            data={shippingData}
            onChange={handleShippingChange}
            fieldErrors={fieldErrors}
          />

        </div>

        <div className="custom-modal-footer">

          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-save"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Procesando pedido..."
              : "Confirmar Pedido"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default CheckoutModal;