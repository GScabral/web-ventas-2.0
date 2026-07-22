import React from "react";
import styles from "../styles/ShippingForm.module.css";
import { PROVINCIAS_AR } from "../../../../config/provinciasAR";

// Texto amable del tiempo de entrega a partir de { min, max } días.
const textoDias = (d) => {
  if (!d) return "";
  const { min, max } = d;
  if (min && max && min !== max) return `Llega en ${min} a ${max} días hábiles`;
  const n = max || min;
  if (!n) return "";
  return n === 1 ? "Llega en 1 día hábil" : `Llega en ${n} días hábiles`;
};

const ShippingForm = ({
  data,
  onChange,
  onTipoEntregaChange,
  fieldErrors = {},
  medioEnvio,
  onMedioEnvioChange,
  zonaMotoDisponible,
  costoMoto,
  costoEnvioCorreo,
  diasCorreo,
  diasMoto,
  ciudadesMoto = [],
}) => {

  // Tiempo de entrega a mostrar según el medio elegido.
  const diasActuales =
    medioEnvio === "moto" && zonaMotoDisponible ? diasMoto : diasCorreo;
  const textoEntrega = textoDias(diasActuales);
  return (
    <div className={styles.fieldsWrapper}>

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Forma de entrega</span>

        <div className={styles.entregaToggle}>
          <button
            type="button"
            className={
              data.tipoEntrega === "ENVIO"
                ? `${styles.entregaBtn} ${styles.entregaBtnActiva}`
                : styles.entregaBtn
            }
            onClick={() => onTipoEntregaChange("ENVIO")}
          >
            📦 Envío a domicilio
          </button>

          <button
            type="button"
            className={
              data.tipoEntrega === "RETIRO"
                ? `${styles.entregaBtn} ${styles.entregaBtnActiva}`
                : styles.entregaBtn
            }
            onClick={() => onTipoEntregaChange("RETIRO")}
          >
            🏬 Retiro en local
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Tus datos</span>

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
      </div>

      {data.tipoEntrega === "ENVIO" && (
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Dirección de envío</span>

          <div className={`${styles.formGroup} ${fieldErrors.provincia ? styles.hasError : ""}`}>
            <label>Provincia</label>

            <select
              name="provincia"
              value={data.provincia}
              onChange={onChange}
            >
              <option value="">Elegí tu provincia</option>
              {PROVINCIAS_AR.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>

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
              list="ciudades-con-moto"
              autoComplete="off"
            />

            {/* Ciudades con envío por moto disponible, como sugerencias. */}
            {ciudadesMoto.length > 0 && (
              <datalist id="ciudades-con-moto">
                {ciudadesMoto.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            )}

            {fieldErrors.ciudad && (
              <span className={styles.fieldError}>
                {fieldErrors.ciudad}
              </span>
            )}
          </div>

          {zonaMotoDisponible && (
            <div className={styles.formGroup}>
              <label>Medio de envío</label>

              <div className={styles.entregaToggle}>
                <button
                  type="button"
                  className={
                    medioEnvio === "correo"
                      ? `${styles.entregaBtn} ${styles.entregaBtnActiva}`
                      : styles.entregaBtn
                  }
                  onClick={() => onMedioEnvioChange("correo")}
                >
                  📦 Correo{costoEnvioCorreo > 0 ? ` · $${costoEnvioCorreo.toLocaleString("es-AR")}` : ""}
                </button>

                <button
                  type="button"
                  className={
                    medioEnvio === "moto"
                      ? `${styles.entregaBtn} ${styles.entregaBtnActiva}`
                      : styles.entregaBtn
                  }
                  onClick={() => onMedioEnvioChange("moto")}
                >
                  🏍️ Moto/cadete · ${costoMoto.toLocaleString("es-AR")}
                </button>
              </div>
            </div>
          )}

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

          {textoEntrega && (
            <p className={styles.entregaEstimada}>
              🚚 {textoEntrega}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingForm;
