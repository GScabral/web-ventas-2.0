import React, { useState } from "react";

import ShippingForm from "./ShippingForm";
import MercadoPagoButton from "./MercadoPagoButton";
import useCheckout from "./useCheckout";

import styles from "../styles/CheckoutModal.module.css";

const CheckoutModal = ({ show, onClose }) => {
  const {
    carrito,
    subtotal,
    total,
    email,
    setEmail,
    shippingData,
    handleShippingChange,
    setTipoEntrega,
    medioEnvio,
    setMedioEnvio,
    zonaMotoDisponible,
    costoMoto,
    costoEnvioCorreo,
    envioGratisDesde,
    envioGratisAplicado,
    faltanteEnvioGratis,
    cuponInput,
    setCuponInput,
    cuponAplicado,
    cuponError,
    validandoCupon,
    aplicarCupon,
    quitarCupon,
    descuentoCupon,
    costoEnvio,
    envioEncontrado,
    confirmarPedido,
    metodoPago,
    setMetodoPago,
    pedidoCreado,
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

    // Con WhatsApp el pedido queda coordinado ahí mismo y cerramos. Con
    // Mercado Pago, en cambio, confirmarPedido ya dejó pedidoCreado
    // cargado — nos quedamos en el modal para mostrar el botón de pago
    // en vez de cerrar de una.
    if (ok && metodoPago === "whatsapp") {
      onClose();
    }
  };

  // ---- Paso 2: pedido ya creado, falta pagarlo con Mercado Pago ----
  if (pedidoCreado) {
    return (
      <div className="custom-modal-overlay" onClick={onClose}>
        <div
          className={`custom-modal ${styles.modal}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="custom-modal-header">
            <h2>Pagá tu pedido</h2>
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
            <p className={styles.resumenLabel}>
              Pedido #{pedidoCreado.id_pedido} · Total ${Number(pedidoCreado.total_pedido).toLocaleString("es-AR")}
            </p>

            <p className={styles.envioSinCargar}>
              Guardamos tu pedido. Completá el pago para confirmarlo — vas a
              recibir un correo apenas se acredite.
            </p>

            <MercadoPagoButton pedidoId={pedidoCreado.id_pedido} />
          </div>
        </div>
      </div>
    );
  }

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

          {/* Resumen: para no perder de vista qué se está comprando
              mientras se completan los datos. */}
          <div className={styles.resumen}>

            <span className={styles.resumenLabel}>
              Tu pedido ({carrito.length} {carrito.length === 1 ? "producto" : "productos"})
            </span>

            <div className={styles.resumenLista}>
              {carrito.map((item, i) => (
                <div key={i} className={styles.resumenItem}>
                  <span className={styles.resumenItemNombre}>
                    {item.nombre}
                    {item.color && ` · ${item.color}`}
                    {item.talla && ` · Talle ${item.talla}`}
                    {" "}× {item.cantidad_elegida ?? item.cantidad ?? 1}
                  </span>
                  <span className={styles.resumenItemPrecio}>
                    ${(
                      (item.precio ?? item.precio_unitario ?? 0) *
                      (item.cantidad_elegida ?? item.cantidad ?? 1)
                    ).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.resumenTotal}>
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString("es-AR")}</span>
            </div>

            {cuponAplicado && (
              <div className={styles.resumenDescuento}>
                <span>Cupón {cuponAplicado.codigo}</span>
                <span>-${descuentoCupon.toLocaleString("es-AR")}</span>
              </div>
            )}

            {shippingData.tipoEntrega === "ENVIO" && shippingData.provincia.trim() && (
              envioGratisAplicado ? (
                <div className={styles.resumenEnvio}>
                  <span>Envío {medioEnvio === "moto" && zonaMotoDisponible ? "por moto" : "a " + shippingData.provincia}</span>
                  <span>¡Gratis!</span>
                </div>
              ) : costoEnvio > 0 ? (
                <div className={styles.resumenEnvio}>
                  <span>
                    Envío {medioEnvio === "moto" && zonaMotoDisponible ? "por moto/cadete" : `a ${shippingData.provincia}`}
                  </span>
                  <span>${costoEnvio.toLocaleString("es-AR")}</span>
                </div>
              ) : !envioEncontrado ? (
                <p className={styles.envioSinCargar}>
                  Todavía no tenemos un costo de envío cargado para "{shippingData.provincia}" — lo coordinamos por WhatsApp.
                </p>
              ) : null
            )}

            {shippingData.tipoEntrega === "ENVIO" && faltanteEnvioGratis > 0 && (
              <p className={styles.envioSinCargar}>
                Te faltan ${faltanteEnvioGratis.toLocaleString("es-AR")} en productos para tener envío gratis.
              </p>
            )}

            <div className={styles.resumenTotalFinal}>
              <span>Total</span>
              <strong>${total.toLocaleString("es-AR")}</strong>
            </div>

          </div>

          {/* ---- Cupón de descuento ---- */}
          <div className={styles.cuponBox}>

            {cuponAplicado ? (
              <div className={styles.cuponAplicado}>
                <span>
                  ✓ Cupón <strong>{cuponAplicado.codigo}</strong> aplicado
                </span>
                <button type="button" onClick={quitarCupon}>
                  Quitar
                </button>
              </div>
            ) : (
              <div className={styles.cuponInputRow}>
                <input
                  type="text"
                  placeholder="Código de descuento"
                  value={cuponInput}
                  onChange={(e) => setCuponInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      aplicarCupon();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={aplicarCupon}
                  disabled={validandoCupon || !cuponInput.trim()}
                >
                  {validandoCupon ? "..." : "Aplicar"}
                </button>
              </div>
            )}

            {cuponError && (
              <span className={styles.cuponErrorMsg}>{cuponError}</span>
            )}

          </div>

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
            onTipoEntregaChange={setTipoEntrega}
            fieldErrors={fieldErrors}
            medioEnvio={medioEnvio}
            onMedioEnvioChange={setMedioEnvio}
            zonaMotoDisponible={zonaMotoDisponible}
            costoMoto={costoMoto}
            costoEnvioCorreo={costoEnvioCorreo}
          />

          <div className={styles.formGroup}>
            <label>¿Cómo querés pagar?</label>

            <div className={styles.metodoPagoOpciones}>
              <label className={styles.metodoPagoOpcion}>
                <input
                  type="radio"
                  name="metodoPago"
                  value="whatsapp"
                  checked={metodoPago === "whatsapp"}
                  onChange={() => setMetodoPago("whatsapp")}
                />
                Coordinar por WhatsApp
              </label>

              <label className={styles.metodoPagoOpcion}>
                <input
                  type="radio"
                  name="metodoPago"
                  value="mercadopago"
                  checked={metodoPago === "mercadopago"}
                  onChange={() => setMetodoPago("mercadopago")}
                />
                Pagar ahora con Mercado Pago
              </label>
            </div>
          </div>

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
              : metodoPago === "mercadopago"
                ? `Ir a pagar · $${total.toLocaleString("es-AR")}`
                : `Confirmar Pedido · $${total.toLocaleString("es-AR")}`}
          </button>

        </div>

      </div>

    </div>
  );
};

export default CheckoutModal;
