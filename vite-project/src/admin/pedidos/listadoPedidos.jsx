import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  getPedidos,
  actualizarEstadoPedidoGeneral,
  mostrarToast
} from "../../redux/action";

import PedidoCard from "./pedidoCardList";
import InfoTooltip from "../components/InfoTooltip";

import "./PedidoList.css";

// Arma un CSV con separador ";" (no ",") y BOM UTF-8 al principio: es
// lo que hace que Excel en español/Argentina lo abra bien de una, con
// tildes correctas y sin mezclar columnas — con coma como separador,
// Excel en este idioma suele interpretarlo todo como una sola columna
// porque la coma la usa como separador decimal.
const escaparCampoCSV = (valor) => {
  const texto = String(valor ?? "").replace(/"/g, '""');
  return `"${texto}"`;
};

const exportarPedidosCSV = (pedidos) => {

  const encabezados = [
    "ID", "Fecha", "Cliente", "Email", "Teléfono",
    "Tipo de entrega", "Provincia", "Ciudad", "Dirección",
    "Estado", "Productos", "Total",
  ];

  const filas = pedidos.map((pedido) => {

    const productos = (pedido.DetallesPedidos || [])
      .map((d) => `${d.nombre} x${d.cantidad}`)
      .join(" | ");

    return [
      pedido.id_pedido,
      pedido.fecha_pedido
        ? new Date(pedido.fecha_pedido).toLocaleDateString("es-AR")
        : "",
      pedido.nombre,
      pedido.email_cliente,
      pedido.telefono,
      pedido.tipo_entrega,
      pedido.provincia,
      pedido.ciudad,
      pedido.direccion,
      pedido.estado,
      productos,
      pedido.total_pedido,
    ].map(escaparCampoCSV).join(";");
  });

  const contenido = [
    encabezados.map(escaparCampoCSV).join(";"),
    ...filas,
  ].join("\r\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + contenido], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fecha = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `pedidos_${fecha}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Beep corto generado con Web Audio API, sin depender de ningún
// archivo de audio externo. Si el navegador bloquea el audio por no
// haber interacción previa del usuario, simplemente no suena — no es
// crítico, el toast visual ya avisa igual.
const reproducirAvisoSonoro = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const contexto = new AudioContextClass();
    const oscilador = contexto.createOscillator();
    const ganancia = contexto.createGain();

    oscilador.type = "sine";
    oscilador.frequency.setValueAtTime(880, contexto.currentTime);

    ganancia.gain.setValueAtTime(0.15, contexto.currentTime);
    ganancia.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.4);

    oscilador.connect(ganancia);
    ganancia.connect(contexto.destination);

    oscilador.start();
    oscilador.stop(contexto.currentTime + 0.4);
  } catch (error) {
    // Silencioso a propósito: el aviso sonoro es un extra, no algo
    // de lo que dependa el flujo de gestión de pedidos.
  }
};

const PedidoList = () => {
  const dispatch = useDispatch();

  const allPedidos = useSelector(
    (state) => state.allPedidos || []
  );

  const [feedbackMsg, setFeedbackMsg] =
    useState("");

  // IDs de pedidos ya vistos, para poder detectar cuáles son nuevos en
  // cada actualización. Empieza en null (todavía no se cargó nada) así
  // el primer pedido que carga la pantalla no dispara un aviso falso.
  const idsConocidos = useRef(null);

  useEffect(() => {
    dispatch(getPedidos());
  }, [dispatch]);

  // Revisa cada 30 segundos si hay pedidos nuevos, mientras esta
  // pantalla esté abierta. No es tiempo real (no hay websockets acá),
  // pero para el uso normal de un admin chequeando pedidos alcanza.
  useEffect(() => {
    const intervalo = setInterval(() => {
      dispatch(getPedidos());
    }, 30000);

    return () => clearInterval(intervalo);
  }, [dispatch]);

  useEffect(() => {
    if (!allPedidos.length) return;

    const idsActuales = new Set(allPedidos.map((p) => p.id_pedido));

    if (idsConocidos.current === null) {
      // Primera carga: solo registramos qué hay, sin avisar nada.
      idsConocidos.current = idsActuales;
      return;
    }

    const nuevos = allPedidos.filter(
      (p) => !idsConocidos.current.has(p.id_pedido)
    );

    if (nuevos.length > 0) {
      reproducirAvisoSonoro();

      const mensaje = nuevos.length === 1
        ? `Nuevo pedido de ${nuevos[0].nombre || "un cliente"} — $${Number(nuevos[0].total_pedido).toLocaleString("es-AR")}`
        : `${nuevos.length} pedidos nuevos`;

      dispatch(mostrarToast(mensaje));
    }

    idsConocidos.current = idsActuales;
  }, [allPedidos, dispatch]);

  const handleEstadoChange =
    useCallback(
      async (pedidoId, estado, datosEnvio) => {
        await dispatch(
          actualizarEstadoPedidoGeneral(
            pedidoId,
            estado,
            undefined,
            datosEnvio
          )
        );

        setFeedbackMsg(
          "Estado actualizado correctamente"
        );

        setTimeout(() => {
          setFeedbackMsg("");
        }, 2500);
      },
      [dispatch]
    );

  const handleMarcarEntregado =
    useCallback(
      async (pedidoId, metodoPago) => {
        const resultado = await dispatch(
          actualizarEstadoPedidoGeneral(
            pedidoId,
            "entregado",
            metodoPago
          )
        );

        if (resultado?.caja?.registrado) {
          dispatch(mostrarToast("Pedido entregado. Se registró el ingreso en Caja."));
        } else if (resultado?.caja?.motivo) {
          dispatch(mostrarToast(`Pedido entregado. ${resultado.caja.motivo}`));
        } else {
          dispatch(mostrarToast("Pedido marcado como entregado."));
        }
      },
      [dispatch]
    );

  // ---- Búsqueda y filtro por fecha ----

  const [busqueda, setBusqueda] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [metodoPago, setMetodoPago] = useState("");

  const pedidosFiltrados = useMemo(() => {

    let resultado = allPedidos;

    if (busqueda.trim()) {
      const termino = busqueda.trim().toLowerCase();

      resultado = resultado.filter((p) =>
        String(p.id_pedido).includes(termino) ||
        (p.nombre || "").toLowerCase().includes(termino) ||
        (p.email_cliente || "").toLowerCase().includes(termino)
      );
    }

    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      desde.setHours(0, 0, 0, 0);

      resultado = resultado.filter((p) =>
        new Date(p.fecha_pedido) >= desde
      );
    }

    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59, 999);

      resultado = resultado.filter((p) =>
        new Date(p.fecha_pedido) <= hasta
      );
    }

    if (metodoPago) {
      resultado = resultado.filter((p) =>
        metodoPago === "mercadopago"
          ? p.metodo_pago === "mercadopago"
          : p.metodo_pago !== "mercadopago"
      );
    }

    return resultado;
  }, [allPedidos, busqueda, fechaDesde, fechaHasta, metodoPago]);

  const hayFiltrosActivos = busqueda.trim() || fechaDesde || fechaHasta || metodoPago;

  const limpiarFiltros = () => {
    setBusqueda("");
    setFechaDesde("");
    setFechaHasta("");
    setMetodoPago("");
  };

  const pendientes =
    pedidosFiltrados.filter(
      (p) => p.estado === "pendiente"
    );

  // "pagado" es el estado que pone automáticamente el webhook de
  // Mercado Pago apenas se confirma el pago (ver server/.../mp/webhook.js)
  // — antes no tenía columna propia en el tablero, así que un pedido
  // pagado online no aparecía en ningún lado hasta que alguien lo
  // pasaba a mano a "preparando".
  const pagados =
    pedidosFiltrados.filter(
      (p) => p.estado === "pagado"
    );

  const preparando =
    pedidosFiltrados.filter(
      (p) => p.estado === "preparando"
    );

  const enviados =
    pedidosFiltrados.filter(
      (p) => p.estado === "enviado"
    );

  const entregados =
    pedidosFiltrados.filter(
      (p) => p.estado === "entregado"
    );

  // Mismo caso: "cancelado" tampoco tenía columna, así que un pedido
  // cancelado quedaba invisible en el tablero (solo se veía buscándolo
  // por ID/email o en el CSV exportado).
  const cancelados =
    pedidosFiltrados.filter(
      (p) => p.estado === "cancelado"
    );

  return (
    <div className="pedidos-page">
      <div className="pedidos-header">
        <div>
          <h1>
            Pedidos
            <InfoTooltip texto="Cada pedido pasa por estados: nuevo, pagado, preparando, enviado, entregado (o cancelado). Cambiá el estado a mano, o se actualiza solo cuando el cliente paga con Mercado Pago." />
          </h1>

          <p>
            Gestiona todos los pedidos
            de la tienda
          </p>
        </div>

        <button
          type="button"
          className="btn-exportar-pedidos"
          onClick={() => exportarPedidosCSV(pedidosFiltrados)}
          disabled={!pedidosFiltrados.length}
        >
          Exportar a Excel/CSV
        </button>
      </div>

      <div className="pedidos-filtros">

        <input
          type="text"
          className="pedidos-buscador"
          placeholder="Buscar por cliente, email o Nº de pedido..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="pedidos-filtro-fechas">
          <label>
            Desde
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </label>

          <label>
            Hasta
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </label>
        </div>

        <label className="pedidos-filtro-metodo-pago">
          Método de pago
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="mercadopago">Mercado Pago</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </label>

        {hayFiltrosActivos && (
          <button
            type="button"
            className="pedidos-limpiar-filtros"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        )}

      </div>

      {hayFiltrosActivos && (
        <p className="pedidos-resultado-count">
          {pedidosFiltrados.length} {pedidosFiltrados.length === 1 ? "resultado" : "resultados"}
        </p>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{pedidosFiltrados.length}</h3>
          <span>Total</span>
        </div>

        <div className="stat-card warning">
          <h3>{pendientes.length}</h3>
          <span>Pendientes</span>
        </div>

        <div className="stat-card pagado">
          <h3>{pagados.length}</h3>
          <span>Pagados</span>
        </div>

        <div className="stat-card info">
          <h3>{preparando.length}</h3>
          <span>Preparando</span>
        </div>

        <div className="stat-card success">
          <h3>{enviados.length}</h3>
          <span>Enviados</span>
        </div>

        <div className="stat-card complete">
          <h3>{entregados.length}</h3>
          <span>Entregados</span>
        </div>

        <div className="stat-card cancelado">
          <h3>{cancelados.length}</h3>
          <span>Cancelados</span>
        </div>
      </div>

      {feedbackMsg && (
        <div className="feedback-success">
          {feedbackMsg}
        </div>
      )}

      <div className="kanban-board">

        <div className="kanban-column">
          <h2 className="pendiente">
            Pendientes
          </h2>

          {pendientes.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              onEstadoChange={
                handleEstadoChange
              }
              onMarcarEntregado={
                handleMarcarEntregado
              }
            />
          ))}
        </div>

        <div className="kanban-column">
          <h2 className="pagado">
            Pagados
          </h2>

          {pagados.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              onEstadoChange={
                handleEstadoChange
              }
              onMarcarEntregado={
                handleMarcarEntregado
              }
            />
          ))}
        </div>

        <div className="kanban-column">
          <h2 className="preparando">
            Preparando
          </h2>

          {preparando.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              onEstadoChange={
                handleEstadoChange
              }
              onMarcarEntregado={
                handleMarcarEntregado
              }
            />
          ))}
        </div>

        <div className="kanban-column">
          <h2 className="enviado">
            Enviados
          </h2>

          {enviados.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              onEstadoChange={
                handleEstadoChange
              }
              onMarcarEntregado={
                handleMarcarEntregado
              }
            />
          ))}
        </div>

        <div className="kanban-column">
          <h2 className="entregado">
            Entregados
          </h2>

          {entregados.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              onEstadoChange={
                handleEstadoChange
              }
              onMarcarEntregado={
                handleMarcarEntregado
              }
            />
          ))}
        </div>

        <div className="kanban-column">
          <h2 className="cancelado">
            Cancelados
          </h2>

          {cancelados.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              onEstadoChange={
                handleEstadoChange
              }
              onMarcarEntregado={
                handleMarcarEntregado
              }
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default PedidoList;