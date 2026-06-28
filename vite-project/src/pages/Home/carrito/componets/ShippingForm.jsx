import React from "react";
import styles from "../styles/ShippingForm.module.css";

const ShippingForm = ({ data, onChange, fieldErrors = {} }) => {
  return (
    <div className={styles.fieldsWrapper}>

      <div className={styles.formGroup}>
        <label>Forma de entrega</label>

        <select
          name="tipoEntrega"
          value={data.tipoEntrega}
          onChange={onChange}
        >
          <option value="ENVIO">
            Envío a domicilio
          </option>

          <option value="RETIRO">
            Retiro en local
          </option>
        </select>
      </div>

      <div className={`${styles.formGroup} ${fieldErrors.nombre ? styles.hasError : ""}`}>
        <label>Nombre</label>

        <input
          name="nombre"
          placeholder="Nombre completo"
          value={data.nombre}
          onChange={onChange}
        />

        {fieldErrors.nombre && (
          <span className={styles.fieldError}>
            {fieldErrors.nombre}
          </span>
        )}
      </div>

      <div className={`${styles.formGroup} ${fieldErrors.telefono ? styles.hasError : ""}`}>
        <label>Teléfono</label>

        <input
          name="telefono"
          placeholder="Ej: 3794123456"
          value={data.telefono}
          onChange={onChange}
        />

        {fieldErrors.telefono && (
          <span className={styles.fieldError}>
            {fieldErrors.telefono}
          </span>
        )}
      </div>

      {data.tipoEntrega === "ENVIO" && (
        <>
          <div className={`${styles.formGroup} ${fieldErrors.provincia ? styles.hasError : ""}`}>
            <label>Provincia</label>

            <input
              name="provincia"
              placeholder="Provincia"
              value={data.provincia}
              onChange={onChange}
            />

            {fieldErrors.provincia && (
              <span className={styles.fieldError}>
                {fieldErrors.provincia}
              </span>
            )}
          </div>

          <div className={`${styles.formGroup} ${fieldErrors.ciudad ? styles.hasError : ""}`}>
            <label>Ciudad</label>

            <input
              name="ciudad"
              placeholder="Ciudad"
              value={data.ciudad}
              onChange={onChange}
            />

            {fieldErrors.ciudad && (
              <span className={styles.fieldError}>
                {fieldErrors.ciudad}
              </span>
            )}
          </div>

          <div className={`${styles.formGroup} ${fieldErrors.direccion ? styles.hasError : ""}`}>
            <label>Dirección</label>

            <input
              name="direccion"
              placeholder="Calle y número"
              value={data.direccion}
              onChange={onChange}
            />

            {fieldErrors.direccion && (
              <span className={styles.fieldError}>
                {fieldErrors.direccion}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShippingForm;