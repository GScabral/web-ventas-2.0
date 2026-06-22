import React from "react";

const ShippingForm = ({ data, onChange }) => {
  return (
    <>
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

      <input
        name="nombre"
        placeholder="Nombre"
        value={data.nombre}
        onChange={onChange}
      />

      <input
        name="telefono"
        placeholder="Teléfono"
        value={data.telefono}
        onChange={onChange}
      />

      {data.tipoEntrega === "ENVIO" && (
        <>
          <input
            name="provincia"
            placeholder="Provincia"
            value={data.provincia}
            onChange={onChange}
          />

          <input
            name="ciudad"
            placeholder="Ciudad"
            value={data.ciudad}
            onChange={onChange}
          />

          <input
            name="direccion"
            placeholder="Dirección"
            value={data.direccion}
            onChange={onChange}
          />
        </>
      )}
    </>
  );
};

export default ShippingForm;