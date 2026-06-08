import React from "react";

import ShippingForm from "./ShippingForm";
import useCheckout from "./useCheckout";

import styles from "../styles/CheckoutModal.module.css";

const CheckoutModal = ({show,onClose,}) => {
  const { email,setEmail,shippingData, handleShippingChange,confirmarPedido,loading, } = useCheckout();

  if (!show) return null;

  const handleSubmit = async () => {

    if (!email) {
      alert("Ingrese un correo electrónico");
      return;
    }

    if (!shippingData.nombre) {
      alert("Ingrese su nombre");
      return;
    }

    if (!shippingData.telefono) {
      alert("Ingrese un teléfono");
      return;
    }

    if (!shippingData.provincia) {
      alert("Ingrese una provincia");
      return;
    }

    if (!shippingData.ciudad) {
      alert("Ingrese una ciudad");
      return;
    }

    if (!shippingData.direccion) {
      alert("Ingrese una dirección");
      return;
    }

    const ok = await confirmarPedido();

    if (ok) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          ×
        </button>

        <h2 className={styles.title}>
          Finalizar Compra
        </h2>

        <div className={styles.formGroup}>

          <label>
            Correo electrónico
          </label>

          <input
            type="email"
            placeholder="ejemplo@email.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

        </div>

        <ShippingForm
          data={shippingData}
          onChange={handleShippingChange}
        />

        <button
          className={styles.confirmButton}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Procesando pedido..."
            : "Confirmar Pedido"}
        </button>

      </div>

    </div>
  );
};

export default CheckoutModal;