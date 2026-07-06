import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  addPedido,
  vaciarCarrito,
  validarCuponCheckout,
  calcularCostoEnvioCheckout,
  getMisPedidos,
} from "../../../../redux/action";

import { STORE_CONFIG } from "../../../../config/storeConfig";

const useCheckout = () => {

  const dispatch = useDispatch();

  const carrito = useSelector(
    state => state.carrito
  );

  // Mismo criterio que en Nav/Footer: si Personalización todavía no
  // cargó, o el admin no cargó un WhatsApp, usamos el valor por
  // defecto del archivo estático.
  const configuracion = useSelector(
    state => state.configuracion
  );

  const whatsapp = configuracion?.whatsapp || STORE_CONFIG.whatsapp;

  // Si el cliente tiene sesión iniciada, precargamos sus datos en vez de
  // pedirle que los tipee de cero cada vez que compra. La fuente más
  // completa es su último pedido (tiene teléfono/provincia/ciudad, que
  // el registro de cuenta ni siquiera guarda); si todavía no compró
  // nunca, usamos lo poco que sí tiene la cuenta (nombre y correo).
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const cliente = useSelector(state => state.cliente);
  const misPedidos = useSelector(state => state.misPedidos);

  // "pedidosListos" marca que ya se intentó traer el historial (haya
  // salido bien o mal), para no precargar de forma apurada solo con los
  // datos flacos de la cuenta cuando en realidad el último pedido
  // (con teléfono/provincia/ciudad incluidos) está por llegar.
  const [pedidosListos, setPedidosListos] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    let vigente = true;

    dispatch(getMisPedidos()).finally(() => {
      if (vigente) setPedidosListos(true);
    });

    return () => {
      vigente = false;
    };
  }, [isLoggedIn, dispatch]);

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

  // Para el toggle de forma de entrega: no depende de un evento de
  // input, así que tiene su propio setter directo.
  const setTipoEntrega = (tipo) => {
    setShippingData(prev => ({
      ...prev,
      tipoEntrega: tipo,
    }));
  };

  // Se ejecuta una sola vez que llegan los datos (pedidos o cuenta), y
  // solo completa los campos que todavía están vacíos — así, si el
  // cliente ya empezó a escribir algo distinto, no se lo pisamos.
  const [prefillHecho, setPrefillHecho] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !pedidosListos || prefillHecho) return;

    // misPedidos viene ordenado del más nuevo al más viejo (DESC por
    // fecha_pedido), así que el primero es el envío más reciente.
    const ultimoPedido = Array.isArray(misPedidos) && misPedidos.length > 0
      ? misPedidos[0]
      : null;

    if (!ultimoPedido && !cliente) return;

    setEmail(prev => prev || ultimoPedido?.email_cliente || cliente?.correo || "");

    setShippingData(prev => ({
      ...prev,
      nombre: prev.nombre || ultimoPedido?.nombre || cliente?.nombre || "",
      telefono: prev.telefono || ultimoPedido?.telefono || "",
      provincia: prev.provincia || ultimoPedido?.provincia || "",
      ciudad: prev.ciudad || ultimoPedido?.ciudad || "",
      direccion: prev.direccion || ultimoPedido?.direccion || cliente?.direccion || "",
    }));

    setPrefillHecho(true);
  }, [isLoggedIn, pedidosListos, cliente, misPedidos, prefillHecho]);

  const [submitError, setSubmitError] =
    useState("");

  const subtotal = carrito.reduce(
    (acc, item) =>
      acc +
      (item.precio ?? item.precio_unitario ?? 0) *
      (item.cantidad_elegida ?? item.cantidad ?? 1),
    0
  );

  // ---- Cupón de descuento ----

  const [cuponInput, setCuponInput] = useState("");
  const [cuponAplicado, setCuponAplicado] = useState(null); // { codigo, descuento }
  const [cuponError, setCuponError] = useState("");
  const [validandoCupon, setValidandoCupon] = useState(false);

  const aplicarCupon = async () => {

    if (!cuponInput.trim()) return;

    setCuponError("");
    setValidandoCupon(true);

    try {
      const resultado = await validarCuponCheckout(cuponInput.trim(), subtotal);

      setCuponAplicado({
        codigo: resultado.codigo,
        descuento: resultado.descuento,
      });

    } catch (error) {
      setCuponAplicado(null);
      setCuponError(
        error?.response?.data?.error ||
        "No pudimos validar ese cupón."
      );
    } finally {
      setValidandoCupon(false);
    }
  };

  const quitarCupon = () => {
    setCuponAplicado(null);
    setCuponInput("");
    setCuponError("");
  };

  const descuentoCupon = cuponAplicado?.descuento || 0;

  // ---- Costo de envío ----
  // Se recalcula solo, con un pequeño debounce mientras el cliente
  // todavía está escribiendo la provincia, para no pegarle al
  // backend en cada letra.
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [envioEncontrado, setEnvioEncontrado] = useState(true);

  useEffect(() => {

    if (shippingData.tipoEntrega !== "ENVIO" || !shippingData.provincia.trim()) {
      setCostoEnvio(0);
      setEnvioEncontrado(true);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const resultado = await calcularCostoEnvioCheckout(shippingData.provincia.trim());
        setCostoEnvio(resultado.costo);
        setEnvioEncontrado(resultado.encontrado);
      } catch (error) {
        setCostoEnvio(0);
        setEnvioEncontrado(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [shippingData.tipoEntrega, shippingData.provincia]);

  const total = Math.max(0, subtotal - descuentoCupon + costoEnvio);

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
        cupon_codigo: cuponAplicado?.codigo || null,
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

        // Usamos el total que en realidad quedó guardado en el pedido
        // (por si el cupón dejó de ser válido justo en el momento de
        // confirmar, el servidor manda la verdad, no lo que se veía
        // en pantalla un segundo antes).
        const totalReal = response.total_pedido ?? total;

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
${cuponAplicado ? `\nCupón aplicado: ${cuponAplicado.codigo} (-$${descuentoCupon.toLocaleString("es-AR")})` : ""}
${shippingData.tipoEntrega === "ENVIO" && costoEnvio > 0 ? `\nCosto de envío: $${costoEnvio.toLocaleString("es-AR")}` : ""}

Total: $${totalReal.toLocaleString("es-AR")}
      `;

        window.open(
          `https://wa.me/${whatsapp}?text=${encodeURIComponent(
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

    carrito,
    subtotal,
    total,

    email,
    setEmail,

    shippingData,
    handleShippingChange,
    setTipoEntrega,

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

    loading,

    submitError,
    setSubmitError,
  };
};

export default useCheckout;
