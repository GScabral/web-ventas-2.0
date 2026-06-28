import { useState } from "react";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import {
  addPedido,
  vaciarCarrito,
} from "../../../../redux/action";

const useCheckout = () => {

  const dispatch = useDispatch();

  const carrito = useSelector(
    state => state.carrito
  );

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [shippingData, setShippingData] =
    useState({
      tipoEntrega: "ENVIO",
      nombre: "",
      telefono: "",
      provincia: "",
      ciudad: "",
      direccion: "",
    });

  const handleShippingChange = (
    e
  ) => {

    const { name, value } = e.target;

    setShippingData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const [submitError, setSubmitError] =
    useState("");

  const confirmarPedido = async () => {

    setSubmitError("");

    try {

      setLoading(true);

      const pedidoData = {
        email_cliente: email,
        tipo_entrega: shippingData.tipoEntrega,
        nombre: shippingData.nombre,
        telefono: shippingData.telefono,
        provincia: shippingData.provincia,
        ciudad: shippingData.ciudad,
        direccion: shippingData.direccion,
        productos: carrito.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          precio_unitario:
            item.precio ??
            item.precio_unitario ??
            0,
          cantidad:
            item.cantidad_elegida ??
            item.cantidad ??
            1,
          subtotal:
            (item.precio ??
              item.precio_unitario ??
              0) *
            (item.cantidad_elegida ??
              item.cantidad ??
              1),
          color: item.color || null,
          talle: item.talle || null,
        })),
      };

      const response =
        await dispatch(
          addPedido(pedidoData)
        );

      if (response) {

        const productos = carrito
          .map((item) => {

            const cantidad =
              item.cantidad_elegida ??
              item.cantidad ??
              1;

            return `• ${item.nombre} x${cantidad}`;
          })
          .join("\n");

        const total = carrito.reduce(
          (acc, item) => {

            const precio =
              item.precio ??
              item.precio_unitario ??
              0;

            const cantidad =
              item.cantidad_elegida ??
              item.cantidad ??
              1;

            return acc + precio * cantidad;

          },
          0
        );

        const mensaje = `
🛒 NUEVO PEDIDO

Cliente: ${shippingData.nombre}
Teléfono: ${shippingData.telefono}
Email: ${email}

Tipo de entrega:
${shippingData.tipoEntrega}

${shippingData.tipoEntrega === "ENVIO"
            ? `
Provincia: ${shippingData.provincia}
Ciudad: ${shippingData.ciudad}
Dirección: ${shippingData.direccion}
`
            : "Retiro en local"
          }

Productos:
${productos}

Total: $${total}
      `;

        // CAMBIAR POR TU NÚMERO
        const numero =
          "+5493794562823";

        window.open(
          `https://wa.me/${numero}?text=${encodeURIComponent(
            mensaje
          )}`,
          "_blank"
        );

        dispatch(
          vaciarCarrito()
        );

        return true;
      }

    } catch (error) {

      console.error(error);

      setSubmitError(
        "No pudimos crear el pedido. Probá de nuevo en un momento."
      );

    } finally {

      setLoading(false);

    }
  };
  return {

    email,
    setEmail,

    shippingData,
    handleShippingChange,

    confirmarPedido,

    loading,

    submitError,
    setSubmitError,
  };
};

export default useCheckout;