const { ConfiguracionSitio } = require("../../db");

// Valida que sea un color hex de 6 dígitos (#ffffff). Rechazamos
// cualquier otra cosa para no terminar con "background: color-mix(algo raro)"
// roto en el CSS de todo el sitio.
const esColorHexValido = (valor) =>
  typeof valor === "string" && /^#[0-9a-fA-F]{6}$/.test(valor);

// Pares tipográficos válidos (ver vite-project/src/config/fuentes.js
// para el detalle de qué fuente real carga cada clave).
const FUENTES_VALIDAS = ["clasica", "moderna", "elegante", "minimal"];

// Campos de texto libre: si vienen, deben ser string (pueden venir
// vacíos para "borrar" el dato, ej. sacar el Facebook si no tiene).
const CAMPOS_TEXTO_LIBRE = [
  "tagline",
  "logo_url",
  "whatsapp",
  "instagram",
  "facebook",
  "direccion",
  "maps_url",
  "email_notificaciones",
];

const actualizarConfiguracion = async (datos) => {

  const {
    nombre_tienda,
    color_primario,
    color_secundario,
    color_acento,
    fuente,
  } = datos;

  const camposAActualizar = {};

  if (nombre_tienda !== undefined) {
    if (typeof nombre_tienda !== "string" || !nombre_tienda.trim()) {
      throw new Error("El nombre de la tienda no puede estar vacío.");
    }
    camposAActualizar.nombre_tienda = nombre_tienda.trim();
  }

  for (const [campo, valor] of Object.entries({
    color_primario,
    color_secundario,
    color_acento,
  })) {
    if (valor === undefined) continue;

    if (!esColorHexValido(valor)) {
      throw new Error(`El color "${campo}" debe ser un hexadecimal válido, ej: #ff6b35.`);
    }

    camposAActualizar[campo] = valor;
  }

  if (fuente !== undefined) {
    if (!FUENTES_VALIDAS.includes(fuente)) {
      throw new Error(`La tipografía "${fuente}" no es una opción válida.`);
    }
    camposAActualizar.fuente = fuente;
  }

  for (const campo of CAMPOS_TEXTO_LIBRE) {
    const valor = datos[campo];
    if (valor === undefined) continue;

    if (typeof valor !== "string") {
      throw new Error(`El campo "${campo}" debe ser texto.`);
    }

    camposAActualizar[campo] = valor.trim();
  }

  // Umbral de envío gratis. Se permite null/"" para desactivarlo
  // (vuelve a cobrarse el envío siempre), o un número >= 0.
  if (datos.envio_gratis_desde !== undefined) {
    const valor = datos.envio_gratis_desde;

    if (valor === null || valor === "") {
      camposAActualizar.envio_gratis_desde = null;
    } else {
      const numero = Number(valor);
      if (Number.isNaN(numero) || numero < 0) {
        throw new Error("El monto de envío gratis debe ser un número mayor o igual a 0.");
      }
      camposAActualizar.envio_gratis_desde = numero;
    }
  }

  const [configuracion] = await ConfiguracionSitio.findOrCreate({
    where: { id: 1 },
  });

  await configuracion.update(camposAActualizar);

  return configuracion;
};

module.exports = actualizarConfiguracion;
