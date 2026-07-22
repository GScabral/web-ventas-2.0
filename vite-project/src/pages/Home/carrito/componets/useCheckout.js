import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  addPedido,
  vaciarCarrito,
  validarCuponCheckout,
  calcularCostoEnvioCheckout,
  calcularCostoMotoCheckout,
  getMisPedidos,
  getZonasMotoPublico,
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

  // Medio de envío cuando tipoEntrega es "ENVIO": "correo" (por
  // provincia, el de siempre) o "moto" (cadete, solo si la ciudad
  // tipeada tiene zona cargada — ver el efecto de zonaMotoDisponible
  // más abajo). Arranca en "correo" porque es la opción que siempre
  // existe.
  const [medioEnvio, setMedioEnvio] = useState("correo");

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

  // "whatsapp": el camino de siempre, se coordina el pago a mano.
  // "mercadopago": paga online; en ese caso no cerramos el checkout al
  // crear el pedido, sino que mostramos el botón de pago para ESE pedido
  // (ver pedidoCreado más abajo).
  const [metodoPago, setMetodoPago] = useState("whatsapp");

  // Se completa recién cuando el pedido ya se creó en el servidor y el
  // cliente eligió pagar con Mercado Pago. CheckoutModal usa esto para
  // pasar de "completá tus datos" a "pagá tu pedido #N".
  const [pedidoCreado, setPedidoCreado] = useState(null);

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

  // ---- Costo de envío por correo (provincia) ----
  // Se recalcula solo, con un pequeño debounce mientras el cliente
  // todavía está escribiendo la provincia, para no pegarle al
  // backend en cada letra.
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [envioEncontrado, setEnvioEncontrado] = useState(true);
  // Tiempo estimado de entrega { min, max } de la provincia elegida
  // (correo). null si no hay dato cargado.
  const [diasCorreo, setDiasCorreo] = useState(null);

  useEffect(() => {

    if (shippingData.tipoEntrega !== "ENVIO" || !shippingData.provincia.trim()) {
      setCostoEnvio(0);
      setEnvioEncontrado(true);
      setDiasCorreo(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const resultado = await calcularCostoEnvioCheckout(shippingData.provincia.trim());
        setCostoEnvio(resultado.costo);
        setEnvioEncontrado(resultado.encontrado);
        setDiasCorreo(
          resultado.encontrado && (resultado.dias_min || resultado.dias_max)
            ? { min: resultado.dias_min, max: resultado.dias_max }
            : null
        );
      } catch (error) {
        setCostoEnvio(0);
        setEnvioEncontrado(false);
        setDiasCorreo(null);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [shippingData.tipoEntrega, shippingData.provincia]);

  // Ciudades con envío por moto activo, para el desplegable del checkout.
  const [ciudadesMoto, setCiudadesMoto] = useState([]);
  useEffect(() => {
    let vigente = true;
    getZonasMotoPublico()
      .then((zonas) => {
        if (vigente) setCiudadesMoto((zonas || []).map((z) => z.ciudad));
      })
      .catch(() => {});
    return () => { vigente = false; };
  }, []);

  // ---- Envío por moto (ciudad) ----
  // Mismo criterio de debounce. Si la ciudad tipeada tiene una zona de
  // moto cargada, se ofrece la opción en el checkout; si no, solo
  // queda disponible el envío por correo (y si el cliente tenía "moto"
  // elegido de una ciudad anterior, se lo vuelve a pasar a "correo").
  const [costoMoto, setCostoMoto] = useState(0);
  const [zonaMotoDisponible, setZonaMotoDisponible] = useState(false);
  const [diasMoto, setDiasMoto] = useState(null);

  useEffect(() => {

    if (shippingData.tipoEntrega !== "ENVIO" || !shippingData.ciudad.trim()) {
      setCostoMoto(0);
      setZonaMotoDisponible(false);
      setDiasMoto(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const resultado = await calcularCostoMotoCheckout(shippingData.ciudad.trim());
        setCostoMoto(resultado.costo);
        setZonaMotoDisponible(resultado.encontrado);
        setDiasMoto(
          resultado.encontrado && (resultado.dias_min || resultado.dias_max)
            ? { min: resultado.dias_min, max: resultado.dias_max }
            : null
        );
        if (!resultado.encontrado) {
          setMedioEnvio("correo");
        }
      } catch (error) {
        setCostoMoto(0);
        setZonaMotoDisponible(false);
        setDiasMoto(null);
        setMedioEnvio("correo");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [shippingData.tipoEntrega, shippingData.ciudad]);

  // Costo de envío efectivo según el medio elegido.
  const costoEnvioElegido =
    shippingData.tipoEntrega === "ENVIO" && medioEnvio === "moto" && zonaMotoDisponible
      ? costoMoto
      : costoEnvio;

  // ---- Envío gratis a partir de un monto (Personalización) ----
  const envioGratisDesde = Number(configuracion?.envio_gratis_desde) || 0;
  const subtotalConDescuento = Math.max(0, subtotal - descuentoCupon);
  const envioGratisAplicado =
    shippingData.tipoEntrega === "ENVIO" &&
    envioGratisDesde > 0 &&
    subtotalConDescuento >= envioGratisDesde;

  const costoEnvioFinal = envioGratisAplicado ? 0 : costoEnvioElegido;

  // Cuánto falta para llegar al envío gratis (0 si ya lo alcanzó, o si
  // no hay envío gratis configurado / no es tipo ENVIO).
  const faltanteEnvioGratis =
    shippingData.tipoEntrega === "ENVIO" && envioGratisDesde > 0 && !envioGratisAplicado
      ? Math.max(0, envioGratisDesde - subtotalConDescuento)
      : 0;

  const total = Math.max(0, subtotal - descuentoCupon + costoEnvioFinal);

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
        medio_envio: shippingData.tipoEntrega === "ENVIO" ? medioEnvio : null,
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

        // El pedido ya está creado (stock descontado, precios validados
        // por el servidor) sin importar cómo se termine pagando. Si el
        // cliente eligió Mercado Pago, cortamos acá: no coordinamos por
        // WhatsApp ni cerramos el modal, sino que mostramos el botón de
        // pago para este pedido puntual.
        if (metodoPago === "mercadopago") {
          dispatch(vaciarCarrito());
          setPedidoCreado(response);
          return true;
        }

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
Medio de envío: ${medioEnvio === "moto" && zonaMotoDisponible ? "Moto/cadete" : "Correo"}
Provincia: ${shippingData.provincia}
Ciudad: ${shippingData.ciudad}
Dirección: ${shippingData.direccion}
`
            : "Retiro en local"
          }

Productos:
${productos}
${cuponAplicado ? `\nCupón aplicado: ${cuponAplicado.codigo} (-$${descuentoCupon.toLocaleString("es-AR")})` : ""}
${shippingData.tipoEntrega === "ENVIO" && costoEnvioFinal > 0 ? `\nCosto de envío: $${costoEnvioFinal.toLocaleString("es-AR")}` : ""}
${envioGratisAplicado ? `\n¡Envío gratis!` : ""}

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

    medioEnvio,
    setMedioEnvio,
    zonaMotoDisponible,
    costoMoto,
    costoEnvioCorreo: costoEnvio,
    diasCorreo,
    diasMoto,
    ciudadesMoto,

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

    costoEnvio: costoEnvioFinal,
    envioEncontrado,

    confirmarPedido,

    metodoPago,
    setMetodoPago,
    pedidoCreado,

    loading,

    submitError,
    setSubmitError,
  };
};

export default useCheckout;
