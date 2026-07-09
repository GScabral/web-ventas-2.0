import React, { useEffect, useState, useRef } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import { getEstadoPedidoPublico } from "../../../redux/action";
import "./pago.css";

// Una sola pantalla para /pago-exitoso, /pago-fallido y /pago-pendiente.
// La ruta por la que Mercado Pago redirige es solo una "pista" de lo que
// pasó — la verdad real es el estado guardado en nuestra base (que solo
// cambia cuando llega y se valida el webhook, ver server/.../mp/webhook.js).
// Por eso acá SIEMPRE se vuelve a consultar el pedido, en vez de confiar
// en a qué URL te mandó Mercado Pago.
const PagoResultado = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const idPedido = searchParams.get("pedido");

  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const intentosRef = useRef(0);

  useEffect(() => {
    if (!idPedido) {
      setCargando(false);
      return;
    }

    let vigente = true;

    const consultar = async () => {
      try {
        const data = await getEstadoPedidoPublico(idPedido);
        if (!vigente) return;

        setEstado(data);
        setError(false);
        setCargando(false);

        // El webhook puede tardar unos segundos más que el redirect del
        // navegador. Si todavía no está "pagado" ni "cancelado", y no nos
        // pasamos de intentos, reintentamos cada 2.5s (máximo ~15s).
        const sigueEsperando = data.estado !== "pagado" && data.estado !== "cancelado";

        if (sigueEsperando && intentosRef.current < 6) {
          intentosRef.current += 1;
          setTimeout(consultar, 2500);
        }
      } catch (err) {
        if (!vigente) return;
        setError(true);
        setCargando(false);
      }
    };

    consultar();

    return () => {
      vigente = false;
    };
  }, [idPedido]);

  const esRutaExitoso = location.pathname === "/pago-exitoso";
  const esRutaFallido = location.pathname === "/pago-fallido";

  // La verdad manda sobre la pista de la URL: si el webhook ya confirmó
  // el pago, mostramos éxito aunque MP te haya mandado a /pago-pendiente.
  const pagado = estado?.estado === "pagado";
  const cancelado = estado?.estado === "cancelado";
  const confirmando = !pagado && !cancelado && !esRutaFallido;

  let tono = "info";
  let titulo = "Estamos confirmando tu pago";
  let mensaje = "Puede tardar unos minutos. Te vamos a avisar por correo apenas se acredite.";

  if (pagado) {
    tono = "exito";
    titulo = "¡Pago confirmado!";
    mensaje = "Ya registramos tu pedido como pagado. Te enviamos un correo con los detalles.";
  } else if (cancelado) {
    tono = "error";
    titulo = "Este pedido fue cancelado";
    mensaje = "Si te parece un error, escribinos y lo revisamos.";
  } else if (esRutaFallido) {
    tono = "error";
    titulo = "No pudimos procesar el pago";
    mensaje = "Podés intentar de nuevo o coordinar el pago por WhatsApp.";
  } else if (!idPedido) {
    tono = esRutaExitoso ? "exito" : "info";
    titulo = esRutaExitoso ? "¡Listo!" : "Volviendo de Mercado Pago";
    mensaje = "No encontramos el número de pedido en el link. Si tenés dudas sobre tu compra, escribinos.";
  }

  return (
    <div className="contenedor pago-resultado-page">
      <div className={`tarjeta pago-resultado-card pago-resultado-${tono}`}>

        <div className="pago-resultado-icono">
          {tono === "exito" && (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
          {tono === "error" && (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
          {tono === "info" && (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={confirmando && cargando === false ? "pago-resultado-spin" : ""}>
              <path d="M21 12a9 9 0 1 1-3-6.7" />
            </svg>
          )}
        </div>

        <h1>{titulo}</h1>
        <p className="pago-resultado-mensaje">{mensaje}</p>

        {idPedido && (
          <p className="pago-resultado-detalle">
            Pedido #{idPedido}
            {estado?.total_pedido ? ` · $${Number(estado.total_pedido).toLocaleString("es-AR")}` : ""}
          </p>
        )}

        {error && (
          <p className="pago-resultado-detalle">
            No pudimos consultar el estado ahora. Si el pago se acreditó, igual vas a recibir el correo de confirmación.
          </p>
        )}

        <Link to="/" className="btn btn-primary pago-resultado-volver">
          Volver a la tienda
        </Link>

      </div>
    </div>
  );
};

export default PagoResultado;
