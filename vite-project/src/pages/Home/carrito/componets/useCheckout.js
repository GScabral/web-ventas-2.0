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

  const confirmarPedido =
    async () => {

      try {

        setLoading(true);

        // Enviar campos que coincidan con el backend: email_cliente, tipo_entrega, nombre, telefono, provincia, ciudad, direccion
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
            precio_unitario: item.precio ?? item.precio_unitario ?? 0,
            cantidad: item.cantidad_elegida ?? item.cantidad ?? 1,
            subtotal: (item.precio ?? item.precio_unitario ?? 0) * (item.cantidad_elegida ?? item.cantidad ?? 1),
            color: item.color || null,
            talle: item.talle || null,
          })),
        };

        const response =
          await dispatch(
            addPedido(pedidoData)
          );

        if (response) {

          dispatch(
            vaciarCarrito()
          );

          alert(
            "Pedido creado correctamente"
          );
        }

      } catch (error) {

        console.error(error);

        alert(
          "Error al crear pedido"
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
  };
};

export default useCheckout;